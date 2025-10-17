import { CircuitState, Operation } from "@/types/enums";
import { type CircuitNode } from "@/types/types";
import { Edge, getOutgoers } from "@xyflow/react";
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
  // [Operation.Xnor]: 2,
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

export function computeGateSignal(
  op: Operation,
  inputs: CircuitState[]
): CircuitState {
  if (inputs.length < MAX_INPUTS[op]) return CircuitState.FLOATING;

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
    case Operation.Nor:
      return Logic.nor(inputs);
    case Operation.Xor:
      return Logic.xor(inputs);
    default:
      return CircuitState.FLOATING;
  }
}

export function simulateCircuit(
  nodes: CircuitNode[],
  edges: Edge[]
): Record<string, CircuitState> {
  const states: Record<string, CircuitState> = {};

  const outMap: Record<string, string[]> = {};
  const inMap: Record<string, string[]> = {};

  for (const edge of edges) {
    if (!outMap[edge.source]) outMap[edge.source] = [];
    if (!inMap[edge.target]) inMap[edge.target] = [];
    outMap[edge.source].push(edge.target);
    inMap[edge.target].push(edge.source);
  }

  const queue: string[] = [];

  for (const node of nodes) {
    if (
      node.data.operation === Operation.ConstantHigh ||
      node.data.operation === Operation.ConstantLow
    ) {
      states[node.id] =
        node.data.operation === Operation.ConstantHigh
          ? CircuitState.HIGH
          : CircuitState.LOW;
      queue.push(node.id);
    }
  }

  // signal propagation
  while (queue.length > 0) {
    const currentId = queue.shift()!;
    const currentSignal = states[currentId];

    if (currentSignal === CircuitState.FLOATING) continue;

    const targets = outMap[currentId] ?? [];
    for (const targetId of targets) {
      const targetNode = nodes.find((n) => n.id === targetId);
      if (!targetNode) continue;

      const sourceIds = inMap[targetId] ?? [];
      const inputSignals = sourceIds.map(
        (id) => states[id] ?? CircuitState.FLOATING
      );

      // skip gates that don't have all inputs connected
      if (inputSignals.length < MAX_INPUTS[targetNode.data.operation]) continue;

      const result = computeGateSignal(targetNode.data.operation, inputSignals);
      if (result === CircuitState.FLOATING) continue;

      if (states[targetId] !== result) {
        states[targetId] = result;
        queue.push(targetId);
      }
    }
  }

  return states;
}

export function isPathToActiveOutput(
  edge: Edge,
  nodes: CircuitNode[],
  edges: Edge[],
  circuit: Record<string, number>
) {
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
  circuit: Record<string, CircuitState>
): CircuitNode[] {
  // React Flow expects nodes to be immutable
  return nodes.map((node) => {
    if (node.data.originalState === undefined) {
      console.warn(`Node ${node.id} is missing originalState`);
    }

    // restore original state if not in circuit
    const updated = circuit[node.id] ?? node.data.originalState;

    return {
      ...node,
      data: {
        ...node.data,
        state: updated,
      },
    };
  });
}

export function applyEdgeStates(
  nodes: CircuitNode[],
  edges: Edge[],
  circuit: Record<string, CircuitState>
): Edge[] {
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
