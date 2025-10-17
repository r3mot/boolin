import { type Node } from "@xyflow/react";
import { CircuitState, NodeType, Operation } from "./enums";

export type CircuitNodeInternals = {
  operation: Operation;
  state: CircuitState;
  originalState: CircuitState;
};

export type InputNode = Node<CircuitNodeInternals, typeof NodeType.Input>;
export type OutputNode = Node<CircuitNodeInternals, typeof NodeType.Output>;
export type GateNode = Node<CircuitNodeInternals, typeof NodeType.Gate>;
export type CircuitNode = InputNode | OutputNode | GateNode;

export type DraggableNodeValue = CircuitNodeInternals & { type: NodeType };
export type DraggableNodeType = {
  name: string;
  node: DraggableNodeValue;
};

export type OnDragNodeStart = (
  e: React.DragEvent<HTMLDivElement>,
  value: DraggableNodeValue
) => void;
