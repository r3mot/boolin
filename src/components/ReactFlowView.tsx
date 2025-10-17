import { useDragAndDrop } from "@/hooks/useDragAndDrop";
import { shallowSelector } from "@/state/stores/circuit.shared";
import { useCircuitStore } from "@/state/stores/circuit.store";
import {
  Background,
  BackgroundVariant,
  DefaultEdgeOptions,
  EdgeTypes,
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
import { usePreferenceStore } from "@/state/stores/preference.store";
import { NodeInfoPanel } from "./panels/NodeInfoPanel";

const nodeTypes: NodeTypes = {
  input: InputNode,
  output: OutputNode,
  gate: GateNode,
};

const edgeTypes: EdgeTypes = {
  connection: Connection,
};

const defaultEdgeOptions: DefaultEdgeOptions = {
  data: {},
};

export function ReactFlowView() {
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

  // not shallow so we can re-render on changes
  const backgroundStyle = usePreferenceStore((state) => state.background);
  const animatedEdges = usePreferenceStore((state) => state.animatedEdges);
  const snapToGrid = usePreferenceStore((state) => state.snapToGrid);

  // dnd stuff
  const { screenToFlowPosition } = useReactFlow();
  const { value } = useDragAndDrop();

  // needed for dnd
  const viewRef = useRef<HTMLDivElement>(null);

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
          originalState: value.state,
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
        snapToGrid={snapToGrid}
        fitViewOptions={{ padding: 0.2 }}
        defaultEdgeOptions={{
          // TODO: find something less sus
          // refer to src/hooks/useFlowAnimation.ts
          ...defaultEdgeOptions,
          animated: animatedEdges,
        }}
        className="burger"
        connectionLineStyle={{ strokeWidth: 4 }}
      >
        <Background variant={backgroundStyle as BackgroundVariant} />
        <NodeInfoPanel position="top-right" />
      </ReactFlow>
    </div>
  );
}
