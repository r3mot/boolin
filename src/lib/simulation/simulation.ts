import { CircuitState, Operation } from "@/types/enums";
import { CircuitNode } from "@/types/types";
import { Edge } from "@xyflow/react";
import { computeGateSignal } from "./logic";

export const MAX_INPUTS: Record<Operation, number> = {
  [Operation.ConstantHigh]: 0,
  [Operation.ConstantLow]: 0,
  [Operation.Output]: 1,
  [Operation.And]: 2,
  [Operation.Or]: 2,
  [Operation.Not]: 1,
  [Operation.Nand]: 2,
  [Operation.Xor]: 2,
  [Operation.Nor]: 2,
};

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
