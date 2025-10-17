import { CircuitState, Operation } from "@/types/enums";
import { CircuitNode } from "@/types/types";
import { Edge } from "@xyflow/react";

export const nodeMap = (nodes: CircuitNode[]) =>
  Object.fromEntries(nodes.map((n) => [n.id, n]));

export function buildAdjacency(edges: Edge[]) {
  const outMap: Record<string, string[]> = {};
  const inMap: Record<string, string[]> = {};
  for (const e of edges) {
    (outMap[e.source] ||= []).push(e.target);
    (inMap[e.target] ||= []).push(e.source);
  }
  return { outMap, inMap };
}

export function isPathToActiveOutput(
  edge: Edge,
  nodes: CircuitNode[],
  edges: Edge[],
  circuit: Record<string, CircuitState>
): boolean {
  const nodeById = nodeMap(nodes);
  const visited = new Set<string>();
  const stack = [edge.source];

  // Build adjacency map only once
  const outMap: Record<string, string[]> = {};
  for (const e of edges) {
    if (!outMap[e.source]) outMap[e.source] = [];
    outMap[e.source].push(e.target);
  }

  while (stack.length) {
    const nodeId = stack.pop()!;
    const node = nodeById[nodeId];
    if (!node) continue;

    if (
      node.data.operation === Operation.Output &&
      circuit[nodeId] === CircuitState.HIGH
    ) {
      return true;
    }

    if (!visited.has(nodeId)) {
      visited.add(nodeId);
      const targets = outMap[nodeId] ?? [];
      stack.push(...targets);
    }
  }

  return false;
}
