import { type OutputNode as OutputNodeType } from "@/types/types";
import { NodeProps, Position } from "@xyflow/react";
import { memo, useEffect, useState } from "react";
import { NodeContainer } from "./Container";
import { CircuitState, GateMetadata } from "@/types/enums";
import { InputHandle } from "../handles/InputHandle";

function OutputNode({ id, data }: NodeProps<OutputNodeType>) {
  const meta = GateMetadata[data.operation];
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
      <div className="w-12 h-12" data-testid={`output-${id}`}>
        <img
          data-testid="output_img"
          src={imagePath}
          alt="output-node"
          className="flex-1 w-full h-full object-cover"
        />
      </div>

      {Array.from({ length: meta.inputs }).map((_, i) => (
        <InputHandle position={Position.Left} id={`target-${i}-${id}`} />
      ))}
    </NodeContainer>
  );
}

export default memo(OutputNode);
