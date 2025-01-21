import { CircuitState, Operation } from "@/types/enums";
import { CircuitNode } from "@/types/types";
import { Edge, getIncomers, getOutgoers } from "@xyflow/react";
import { Logic } from "./logic";
import isEqual from "lodash.isequal";

const MAX_INPUTS: Record<Operation, number> = {
  [Operation.ConstantHigh]: 0,
  [Operation.ConstantLow]: 0,
  [Operation.Output]: 1,
  [Operation.And]: 2,
  [Operation.Or]: 2,
  [Operation.Not]: 1,
  [Operation.Nand]: 2,
  [Operation.Xor]: 2,
  [Operation.Nor]: 2,
  [Operation.Xnor]: 2,
};

export function isOutputNode(id: string, nodes: CircuitNode[]) {
  const node = nodes.find((n) => n.id === id);
  return node?.data.operation === Operation.Output;
}

export function getSourceNodes(nodes: CircuitNode[]): CircuitNode[] {
  return nodes.filter(
    (n) =>
      n.data.operation === Operation.ConstantHigh ||
      n.data.operation === Operation.ConstantLow
  );
}

export function computeGateSignal(op: Operation, inputs: number[]): number {
  if (inputs.length < MAX_INPUTS[op]) {
    return CircuitState.FLOATING;
  }

  switch (op) {
    case Operation.ConstantLow:
      return CircuitState.LOW;
    case Operation.ConstantHigh:
      return CircuitState.HIGH;
    case Operation.Output:
      return inputs[0] ?? CircuitState.LOW;
    case Operation.And:
      return Logic.and(inputs);
    case Operation.Or:
      return Logic.or(inputs);
    case Operation.Not:
      return Logic.not(inputs);
    case Operation.Nand:
      return Logic.nand(inputs);
    case Operation.Xor:
      return Logic.xor(inputs);
    case Operation.Nor:
      return Logic.nor(inputs);
    case Operation.Xnor:
      return Logic.xnor(inputs);
    default:
      return CircuitState.FLOATING;
  }
}

export function simulateCircuit(
  nodes: CircuitNode[],
  edges: Edge[]
): Record<string, number> {
  const states: Record<string, number> = {};

  const sources = getSourceNodes(nodes);
  const queue = [...sources];

  for (const source of sources) {
    states[source.id] =
      source.data.operation === Operation.ConstantHigh
        ? CircuitState.HIGH
        : CircuitState.LOW;
  }

  while (queue.length > 0) {
    const current = queue.shift()!;
    const connectedNodes = getOutgoers(current, nodes, edges);

    connectedNodes.forEach((target) => {
      const incoming = getIncomers(target, nodes, edges);
      const signals = incoming.map((i) => states[i.id] ?? CircuitState.LOW);

      if (signals.length < MAX_INPUTS[target.data.operation]) {
        console.warn(`Node ${target.id} has insufficient inputs.`);
        return;
      }

      const signal = computeGateSignal(target.data.operation, signals);

      if (signal === CircuitState.FLOATING) {
        console.warn(`Node ${target.id} has floating signal.`);
        return;
      }

      const prevSignal = states[target.id] ?? CircuitState.LOW;
      if (
        prevSignal === signal &&
        Object.prototype.hasOwnProperty.call(states, target.id)
      ) {
        console.log(`No change in signal for ${target.id}`);
        return;
      }

      states[target.id] = signal;
      queue.push(target);
    });
  }

  return states;
}

export function isPathToActiveOutput(
  edge: Edge,
  nodes: CircuitNode[],
  edges: Edge[],
  circuit: Record<string, number>
) {
  if (circuit[edge.target] !== CircuitState.HIGH) {
    console.error(`Edge target ${edge.target} is not HIGH in circuit state.`);
    return false;
  }

  const visited = new Set<string>();
  const stack = [edge.source];

  while (stack.length) {
    const nodeId = stack.pop()!;
    if (isOutputNode(nodeId, nodes) && circuit[nodeId] === CircuitState.HIGH) {
      return true;
    }

    if (!visited.has(nodeId)) {
      visited.add(nodeId);

      const current = nodes.find((n) => n.id === nodeId);
      if (current) {
        const edgesOut = getOutgoers(current, nodes, edges);
        stack.push(...edgesOut.map((e) => e.id));
      }
    }
  }

  return false;
}

export function applyNodeStates(
  nodes: CircuitNode[],
  circuit: Record<string, number>
) {
  // React Flow expects nodes to be immutable
  return nodes.map((node) => ({
    ...node,
    data: {
      ...node.data,
      state: circuit[node.id] ?? node.data.state ?? CircuitState.LOW,
    },
  }));
}

export function applyEdgeStates(
  nodes: CircuitNode[],
  edges: Edge[],
  circuit: Record<string, number>
) {
  return edges.map((e) => {
    const connected = isPathToActiveOutput(e, nodes, edges, circuit);
    const newStyle = connected ? { stroke: "green" } : {};

    if (isEqual(e.style, newStyle)) {
      return e;
    }
    return {
      ...e,
      style: newStyle,
    };
  });
}

export function haveNodeStatesChanged(
  original: CircuitNode[],
  updated: CircuitNode[]
): boolean {
  // return original.some((node, i) => node.data.state !== updated[i].data.state);
  return original.some(
    (node, i) => !isEqual(node.data.state, updated[i].data.state)
  );
}

export function haveEdgeStylesChanged(
  original: Edge[],
  updated: Edge[]
): boolean {
  return original.some((edge, i) => !isEqual(edge.style, updated[i].style));
}

export function updateCircuit(nodes: CircuitNode[], edges: Edge[]) {
  try {
    const circuit = simulateCircuit(nodes, edges);
    const updatedNodes = applyNodeStates(nodes, circuit);
    const updatedEdges = applyEdgeStates(updatedNodes, edges, circuit);
    const nodesChanged = haveNodeStatesChanged(nodes, updatedNodes);
    const edgesChanged = haveEdgeStylesChanged(edges, updatedEdges);

    if (!nodesChanged && !edgesChanged) {
      return undefined;
    }

    return {
      ...(nodesChanged && { nodes: updatedNodes }),
      ...(edgesChanged && { edges: updatedEdges }),
    };
  } catch (e) {
    console.error("Couldn't process circuit", e);
    return undefined;
  }
}
