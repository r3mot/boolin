import { CircuitNode } from "@/types/types";
import { Edge } from "@xyflow/react";
import { simulateCircuit } from "./simulation";
import { CircuitState } from "@/types/enums";
import { isPathToActiveOutput } from "./graph";
import isEqual from "lodash.isequal";

export function updateCircuit(nodes: CircuitNode[], edges: Edge[]) {
  try {
    const circuit = simulateCircuit(nodes, edges);
    const updatedNodes = applyNodeStates(nodes, circuit);
    const updatedEdges = applyEdgeStates(updatedNodes, edges, circuit);

    const nodesChanged = haveNodeStatesChanged(nodes, updatedNodes);
    const edgesChanged = haveEdgeStylesChanged(edges, updatedEdges);

    if (!nodesChanged && !edgesChanged) return undefined;

    return {
      ...(nodesChanged && { nodes: updatedNodes }),
      ...(edgesChanged && { edges: updatedEdges }),
    };
  } catch (err) {
    console.error("Circuit simulation error:", err);
    return undefined;
  }
}

export function haveEdgeStylesChanged(
  original: Edge[],
  updated: Edge[]
): boolean {
  return original.some((edge, i) => !isEqual(edge.style, updated[i].style));
}

export function applyNodeStates(
  nodes: CircuitNode[],
  circuit: Record<string, CircuitState>
): CircuitNode[] {
  return nodes.map((node) => ({
    ...node,
    data: {
      ...node.data,
      state: circuit[node.id] ?? node.data.originalState,
    },
  }));
}

export function applyEdgeStates(
  nodes: CircuitNode[],
  edges: Edge[],
  circuit: Record<string, CircuitState>
): Edge[] {
  return edges.map((e) => {
    const connected = isPathToActiveOutput(e, nodes, edges, circuit);
    const style = connected ? { stroke: "green" } : {};
    return isEqual(e.style, style) ? e : { ...e, style };
  });
}

export function haveNodeStatesChanged(
  original: CircuitNode[],
  updated: CircuitNode[]
): boolean {
  return original.some(
    (node, i) => !isEqual(node.data.state, updated[i].data.state)
  );
}
