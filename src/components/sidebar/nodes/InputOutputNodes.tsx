import { CircuitState, NodeType, Operation } from "@/types/enums";
import type { DraggableNodeType } from "@/types/types";
import { useDragAndDrop } from "@/hooks/useDragAndDrop";
import { DraggableNode } from "./DraggableNode";

const ioNodes: DraggableNodeType[] = [
  {
    name: "High Input",
    node: {
      type: NodeType.Input,
      operation: Operation.ConstantHigh,
      state: CircuitState.HIGH,
      originalState: CircuitState.HIGH,
    },
  },
  {
    name: "Low Input",
    node: {
      type: NodeType.Input,
      operation: Operation.ConstantLow,
      state: CircuitState.LOW,
      originalState: CircuitState.LOW,
    },
  },
  {
    name: "Output",
    node: {
      type: NodeType.Output,
      operation: Operation.Output,
      state: CircuitState.LOW,
      originalState: CircuitState.LOW,
    },
  },
];

export function InputOutputNodes() {
  const { onDragStart } = useDragAndDrop();

  return (
    <div className="grid grid-cols-2 gap-4">
      {ioNodes.map((item) => (
        <DraggableNode key={item.name} item={item} onDragStart={onDragStart} />
      ))}
    </div>
  );
}
