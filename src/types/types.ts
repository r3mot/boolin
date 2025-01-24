import { type Node } from "@xyflow/react";
import { CircuitState, NodeType, Operation } from "./enums";

export type CircuitNodeInternals = {
  operation: Operation;
  state: CircuitState;
  originalState: CircuitState;
};

export type InputNode = Node<CircuitNodeInternals, NodeType.Input>;
export type OutputNode = Node<CircuitNodeInternals, NodeType.Output>;
export type GateNode = Node<CircuitNodeInternals, NodeType.Gate>;
export type CircuitNode = InputNode | OutputNode | GateNode;

export type DraggableNodeValue = CircuitNodeInternals & { type: NodeType };
export type DraggableNode = {
  name: string;
  node: DraggableNodeValue;
};

export type OnDragNodeStart = (
  e: React.DragEvent<HTMLDivElement>,
  value: DraggableNodeValue
) => void;
