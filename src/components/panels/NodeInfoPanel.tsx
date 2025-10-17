"use client";

import { useState, useCallback } from "react";

import {
  useNodes,
  Panel,
  ViewportPortal,
  useReactFlow,
  type PanelPosition,
  type XYPosition,
} from "@xyflow/react";
import type { CircuitNodeInternals } from "@/types/types";
import { Switch } from "../ui/switch";

export const NodeStateViewer = () => {
  const { getInternalNode } = useReactFlow();
  const nodes = useNodes();

  return (
    <ViewportPortal>
      <div className="text-secondary-foreground">
        {nodes.map((node) => {
          const internalNode = getInternalNode(node.id);
          if (!internalNode) {
            return null;
          }

          const absPosition = internalNode?.internals.positionAbsolute;

          return (
            <NodeStateInfo
              key={node.id}
              id={node.id}
              absPosition={absPosition}
              data={node.data as CircuitNodeInternals}
            />
          );
        })}
      </div>
    </ViewportPortal>
  );
};

type NodeStateInfoProps = {
  id: string;
  absPosition: XYPosition;
  data: CircuitNodeInternals;
};

const NodeStateInfo = ({ id, absPosition, data }: NodeStateInfoProps) => {
  const fixedWidth = 250;
  const fixedHeight = 120;

  const absoluteTransform = `translate(${absPosition.x}px, ${
    absPosition.y + fixedHeight - 40
  }px)`;

  const dataWithId = { id, ...data };

  return (
    <div
      style={{
        position: "absolute",
        transform: absoluteTransform,
        width: fixedWidth,
        height: fixedHeight,
      }}
      className="text-xs"
    >
      <pre className=" mt-4 whitespace-pre-wrap break-words bg-neutral-900 text-green-300 font-mono text-xs p-3 rounded-lg">
        {JSON.stringify(dataWithId, null, 2)}
      </pre>
    </div>
  );
};

export const NodeInfoPanel = ({ position }: { position: PanelPosition }) => {
  const [active, setActive] = useState(false);

  const toggle = useCallback(() => {
    setActive((prev) => !prev);
  }, []);

  return (
    <Panel position={position} className="rounded border bg-card p-1 shadow-sm">
      <div className="p-2 bg-card text-card-foreground">
        <div className="flex items-center justify-center gap-4">
          <strong className="text-sm">Node State Viewer</strong>
          <Switch checked={active} onCheckedChange={toggle} />
        </div>

        {active && <NodeStateViewer />}
      </div>
    </Panel>
  );
};
