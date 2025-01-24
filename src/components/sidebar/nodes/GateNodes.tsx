import { CircuitState, NodeType, Operation } from "@/types/enums";
import type { DraggableNodeType } from "@/types/types";
import { useDragAndDrop } from "@/hooks/useDragAndDrop";
import { DraggableNode } from "./DraggableNode";

const gateNodes: DraggableNodeType[] = [
  {
    name: "And",
    node: {
      type: NodeType.Gate,
      operation: Operation.And,
      state: CircuitState.LOW,
      originalState: CircuitState.LOW,
    },
  },
  {
    name: "Nand",
    node: {
      type: NodeType.Gate,
      operation: Operation.Nand,
      state: CircuitState.LOW,
      originalState: CircuitState.LOW,
    },
  },
  {
    name: "Or",
    node: {
      type: NodeType.Gate,
      operation: Operation.Or,
      state: CircuitState.LOW,
      originalState: CircuitState.LOW,
    },
  },
  {
    name: "Nor",
    node: {
      type: NodeType.Gate,
      operation: Operation.Nor,
      state: CircuitState.LOW,
      originalState: CircuitState.LOW,
    },
  },
  {
    name: "Xor",
    node: {
      type: NodeType.Gate,
      operation: Operation.Xor,
      state: CircuitState.LOW,
      originalState: CircuitState.LOW,
    },
  },
  {
    name: "Not",
    node: {
      type: NodeType.Gate,
      operation: Operation.Not,
      state: CircuitState.LOW,
      originalState: CircuitState.LOW,
    },
  },
];

export function GateNodes() {
  const { onDragStart } = useDragAndDrop();

  return (
    <div className="grid grid-cols-2 gap-4">
      {gateNodes.map((item) => (
        <DraggableNode key={item.name} item={item} onDragStart={onDragStart} />
      ))}
    </div>
  );
}
