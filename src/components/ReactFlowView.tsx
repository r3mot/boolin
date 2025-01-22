import { useDragAndDrop } from "@/hooks/useDragAndDrop";
import { shallowSelector } from "@/state/stores/circuit.shared";
import { useCircuitStore } from "@/state/stores/circuit.store";
import {
  Background,
  DefaultEdgeOptions,
  EdgeTypes,
  FitViewOptions,
  NodeTypes,
  ReactFlow,
  useReactFlow,
} from "@xyflow/react";
import React, { useCallback, useRef } from "react";
import { useShallow } from "zustand/shallow";
import InputNode from "./nodes/InputNode";
import OutputNode from "./nodes/OutputNode";
import GateNode from "./nodes/GateNode";
import { Connection } from "./handles/Connection";

const fitViewOptions: FitViewOptions = {
  padding: 0.2,
};

const defaultEdgeOptions: DefaultEdgeOptions = {
  animated: true,
  data: {},
};

const nodeTypes: NodeTypes = {
  input: InputNode,
  output: OutputNode,
  gate: GateNode,
};

const edgeTypes: EdgeTypes = {
  connection: Connection,
};
export function ReactFlowView() {
  const viewRef = useRef<HTMLDivElement>(null);

  const {
    nodes,
    edges,
    getNextId,
    onConnect,
    onNodesChange,
    onNodesDelete,
    onEdgesChange,
    onEdgesDelete,
    setRfInstance,
    concatNode,
  } = useCircuitStore(useShallow(shallowSelector));

  const { screenToFlowPosition } = useReactFlow();
  const { value } = useDragAndDrop();

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();

      if (!value) return;

      const position = screenToFlowPosition({
        x: e.clientX,
        y: e.clientY,
      });

      concatNode({
        id: String(getNextId()),
        type: value.type,
        position,
        data: {
          operation: value.operation,
          state: value.state,
        },
      });
    },
    [concatNode, getNextId, screenToFlowPosition, value]
  );

  return (
    <div ref={viewRef}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onNodesChange={onNodesChange}
        onNodesDelete={onNodesDelete}
        onEdgesChange={onEdgesChange}
        onEdgesDelete={onEdgesDelete}
        onConnect={onConnect}
        onInit={setRfInstance}
        fitViewOptions={fitViewOptions}
        defaultEdgeOptions={defaultEdgeOptions}
      >
        <Background />
      </ReactFlow>
    </div>
  );
}
