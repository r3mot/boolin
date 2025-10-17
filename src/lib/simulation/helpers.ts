import { Operation } from "@/types/enums";
import { CircuitNode } from "@/types/types";

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
