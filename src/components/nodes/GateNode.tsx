import { type GateNode as GateNodeType } from "@/types/types";
import { NodeProps, Position } from "@xyflow/react";
import { NodeContainer } from "./Container";
import { GateMetadata } from "@/types/enums";
import { OutputHandle } from "../handles/OutputHandle";
import { InputHandle } from "../handles/InputHandle";
import { memo } from "react";

function GateNode({ id, data }: NodeProps<GateNodeType>) {
  const meta = GateMetadata[data.operation];
  return (
    <NodeContainer>
      <img
        src={`/svgs/${data.operation}.svg`}
        alt="gate-node"
        className="flex-1 w-full h-full object-cover"
      />

      {/* left-side inputs */}
      {Array.from({ length: meta.inputs }).map((_, i) => (
        <InputHandle
          key={`in-${i}`}
          position={Position.Left}
          id={`target-${i + 1}-${id}`}
          style={{
            top: `${(100 / (meta.inputs + 1)) * (i + 1)}%`,
          }}
        />
      ))}

      {/* right-side outputs */}
      {Array.from({ length: meta.outputs }).map((_, i) => (
        <OutputHandle
          key={`out-${i}`}
          position={Position.Right}
          id={`handle-${i + 1}-${id}`}
          style={{
            top: `${(100 / (meta.outputs + 1)) * (i + 1)}%`,
          }}
        />
      ))}
    </NodeContainer>
  );
}

export default memo(GateNode);
