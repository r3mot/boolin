import { type OutputNode as OutputNodeType } from "@/types/types";
import { NodeProps, Position } from "@xyflow/react";
import { memo, useEffect, useState } from "react";
import { NodeContainer } from "./Container";
import { CircuitState } from "@/types/enums";
import { OutputHandle } from "../handles/OutputHandle";

function OutputNode({ id, data }: NodeProps<OutputNodeType>) {
  const [value, setValue] = useState(data.state);

  const imagePath =
    value === CircuitState.HIGH
      ? "/svgs/output-high.svg"
      : "/svgs/output-low.svg";

  useEffect(() => {
    setValue(data.state);
  }, [data.state]);

  return (
    <NodeContainer>
      <div className="w-12 h-12">
        <img
          src={imagePath}
          alt="output-node"
          className="flex-1 w-full h-full object-cover"
        />
      </div>
      <OutputHandle limit={1} position={Position.Left} id={`handle-${id}`} />
    </NodeContainer>
  );
}

export default memo(OutputNode);
