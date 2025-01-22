import { useDragAndDrop } from "@/hooks/useDragAndDrop";
import { shallowSelector } from "@/state/stores/circuit.shared";
import { useCircuitStore } from "@/state/stores/circuit.store";
import {
  Background,
  DefaultEdgeOptions,
  FitViewOptions,
  ReactFlow,
  useReactFlow,
} from "@xyflow/react";
import React, { useCallback, useRef } from "react";
import { useShallow } from "zustand/shallow";

const fitViewOptions: FitViewOptions = {
  padding: 0.2,
};

const defaultEdgeOptions: DefaultEdgeOptions = {
  animated: true,
  data: {},
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
