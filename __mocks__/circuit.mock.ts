import { CircuitNodeInternals } from "@/types/types";
import { CircuitState, NodeType, Operation } from "../src/types/enums";
import { Edge } from "@xyflow/react";

export const enum MockNodeId {
  LowNodeId = "node1",
  HighNodeId = "node2",
  OutputNodeId = "node3",
  AndGateId = "node4",
  OrGateId = "node5",
  NotGateId = "node6",
  NandGateId = "node7",
  MalformedNodeId = "node8",
  SourceNodeId = "node9",
}

export const mockNodes = {
  low: {
    id: MockNodeId.LowNodeId,
    type: NodeType.Input,
    data: {
      operation: Operation.ConstantLow,
      state: CircuitState.LOW,
      originalState: CircuitState.LOW,
    },
    position: { x: 0, y: 0 },
  },
  high: {
    id: MockNodeId.HighNodeId,
    type: NodeType.Input,
    data: {
      operation: Operation.ConstantHigh,
      state: CircuitState.HIGH,
      originalState: CircuitState.HIGH,
    },
    position: { x: 50, y: 0 },
  },
  source: {
    id: MockNodeId.SourceNodeId,
    type: NodeType.Source,
    data: {
      operation: Operation.Source,
      state: CircuitState.LOW,
      originalState: CircuitState.LOW,
    },
    position: { x: 100, y: 0 },
  },
  output: {
    id: MockNodeId.OutputNodeId,
    type: NodeType.Output,
    data: {
      operation: Operation.Output,
      state: CircuitState.LOW,
      originalState: CircuitState.LOW,
    },
    position: { x: 100, y: 0 },
  },
  and: {
    id: MockNodeId.AndGateId,
    type: NodeType.Gate,
    data: {
      operation: Operation.And,
      state: CircuitState.LOW,
      originalState: CircuitState.LOW,
    },
    position: { x: 150, y: 0 },
  },
  or: {
    id: MockNodeId.OrGateId,
    type: NodeType.Gate,
    data: {
      operation: Operation.Or,
      state: CircuitState.LOW,
      originalState: CircuitState.LOW,
    },
    position: { x: 200, y: 0 },
  },
  not: {
    id: MockNodeId.NotGateId,
    type: NodeType.Gate,
    data: {
      operation: Operation.Not,
      state: CircuitState.LOW,
      originalState: CircuitState.LOW,
    },
    position: { x: 250, y: 0 },
  },
  nand: {
    id: MockNodeId.NandGateId,
    type: NodeType.Gate,
    data: {
      operation: Operation.Nand,
      state: CircuitState.LOW,
      originalState: CircuitState.LOW,
    },
    position: { x: 300, y: 0 },
  },
  malformed: {
    id: MockNodeId.MalformedNodeId,
    type: NodeType.Gate,
    data: {} as CircuitNodeInternals,
    position: { x: 350, y: 0 },
  },
};

export const mockEdge = (source: MockNodeId, target: MockNodeId): Edge => ({
  id: `${source}-${target}`,
  source,
  target,
  type: "default",
});
