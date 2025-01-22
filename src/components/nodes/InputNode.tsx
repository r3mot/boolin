import { type InputNode as InputNodeType } from "@/types/types";
import { NodeProps, Position } from "@xyflow/react";
import { NodeContainer } from "./Container";
import { InputHandle } from "../handles/InputHandle";
import { memo } from "react";

function InputNode({ id, data }: NodeProps<InputNodeType>) {
  return (
    <NodeContainer>
      <div className="w-12 h-12">
        <img
          src={`/svgs/${data.operation}.svg`}
          alt="source-node"
          className="flex-1 w-full h-full object-cover"
        />
      </div>
      <InputHandle position={Position.Right} id={`handle-${id}`} />
    </NodeContainer>
  );
}

export default memo(InputNode);
