import { type InputNode as InputNodeType } from "@/types/types";
import { NodeProps, Position } from "@xyflow/react";
import { NodeContainer } from "./Container";
import { memo } from "react";
import { GateMetadata } from "@/types/enums";
import { OutputHandle } from "../handles/OutputHandle";

function InputNode({ id, data }: NodeProps<InputNodeType>) {
  const meta = GateMetadata[data.operation];

  console.log("InputNode data:", id);
  return (
    <NodeContainer>
      <div className="w-12 h-12" data-testid={`input-${id}`}>
        <img
          data-testid="input_img"
          src={`/svgs/${data.operation}.svg`}
          alt="input-node"
          className="flex-1 w-full h-full object-cover"
        />
      </div>

      {Array.from({ length: meta.outputs }).map((_, i) => (
        <OutputHandle
          key={`handle-${i}-${id}`}
          position={Position.Right}
          id={`handle-${i}-${id}`}
        />
      ))}
    </NodeContainer>
  );
}

export default memo(InputNode);
