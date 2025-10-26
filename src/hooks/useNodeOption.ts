import { useCallback } from "react";
import { useCircuitStore } from "@/state/stores/circuit.store";
import { CircuitNode } from "@/types/types";
import { useShallow } from "zustand/react/shallow";
import { Operation } from "@/types/enums";

export function useNodeOption() {
  const { generateId, replaceNode, removeNode, nodes, edges } = useCircuitStore(
    useShallow((s) => ({
      generateId: s.getNextId,
      removeNode: s.removeNode,
      replaceNode: s.replaceNode,
      nodes: s.nodes,
      edges: s.edges,
    }))
  );

  const getNodeRole = useCallback(
    (type: Operation): "input" | "output" | "gate" | "source" => {
      if (type === Operation.ConstantHigh || type === Operation.ConstantLow)
        return "input";
      if (type === Operation.Output) return "output";
      if (type === Operation.Source) return "source";
      return "gate";
    },
    []
  );

  const replace = useCallback(
    (nodeId: string, next: Partial<CircuitNode>) => {
      const target = nodes.find((n) => n.id === nodeId);
      if (!target) return;

      const newNode: CircuitNode = {
        ...target,
        ...next,
        id: `${generateId()}`,
        data: {
          ...target.data,
          ...next.data,
          operation: next.data?.operation ?? target.data.operation,
        },
        position: target.position,
      };

      const updatedEdges = edges.filter(
        (e) => e.source !== nodeId && e.target !== nodeId
      );

      replaceNode(nodeId, newNode, updatedEdges);
    },
    [nodes, edges, generateId, replaceNode]
  );

  const handleSwapNode = useCallback(
    (newOperation: Operation, id: string) => {
      const node = nodes.find((n) => n.id === id);
      if (!node) return;

      const updatedNode: Partial<CircuitNode> = {
        type: getNodeRole(newOperation),
        data: {
          ...node.data,
          operation: newOperation,
        },
      };

      replace(id, {
        ...updatedNode,
        id: `${generateId()}`,
        position: node.position,
      });
    },
    [nodes, generateId, getNodeRole, replace]
  );

  const handleDeleteNode = useCallback(
    (id: string) => {
      const node = nodes.find((n) => n.id === id);
      if (node) removeNode(node);
    },
    [nodes, removeNode]
  );

  return { replace, handleSwapNode, handleDeleteNode };
}
