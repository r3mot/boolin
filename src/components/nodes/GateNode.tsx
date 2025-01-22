import { type GateNode as GateNodeType } from "@/types/types";
import { NodeProps, Position } from "@xyflow/react";
import { NodeContainer } from "./Container";
import { Operation } from "@/types/enums";
import { OutputHandle } from "../handles/OutputHandle";
import { InputHandle } from "../handles/InputHandle";
import { memo } from "react";

function GateNode({ id, data }: NodeProps<GateNodeType>) {
  return (
    <NodeContainer>
      <img
        src={`/svgs/${data.operation}.svg`}
        alt="gate-node"
        className="flex-1 w-full h-full object-cover"
      />

      {data.operation === Operation.Not ? (
        <OutputHandle limit={1} id={`handle-${id}`} position={Position.Left} />
      ) : (
        <div>
          <OutputHandle
            limit={1}
            id={`target-1-${id}`}
            position={Position.Left}
            style={{
              top: "25%",
            }}
          />
          <OutputHandle
            limit={1}
            id={`target-2-${id}`}
            position={Position.Left}
            style={{
              top: "75%",
            }}
          />
        </div>
      )}
      <InputHandle position={Position.Right} id={`handle-${id}`} />
    </NodeContainer>
  );
}

export default memo(GateNode);
