import { useCircuitStore } from "@/state/stores/circuit.store";
import { CircuitState, GateMetadata } from "@/types/enums";
import { NodeProps, Position } from "@xyflow/react";
import { memo, useCallback } from "react";
import { NodeContainer } from "./shared/NodeContainer";
import { OutputHandle } from "../handles/OutputHandle";
import { type SourceNode } from "@/types/types";
import { Switch } from "../ui/switch";

function InputSourceNode({ id, data }: NodeProps<SourceNode>) {
  const meta = GateMetadata[data.operation];
  const setNodes = useCircuitStore((s) => s.setNodes);
  const nodes = useCircuitStore((s) => s.nodes);

  const handleToggle = useCallback(
    (checked: boolean) => {
      const newNodes = nodes.map((node) =>
        node.id === id
          ? {
              ...node,
              data: {
                ...node.data,
                state: checked ? CircuitState.HIGH : CircuitState.LOW,
              },
            }
          : node
      );
      setNodes(newNodes);
    },
    [id, nodes, setNodes]
  );

  return (
    <NodeContainer id={id} operation={data.operation}>
      <div
        className="flex items-center justify-center w-12 h-12"
        data-testid={`toggle-${id}`}
      >
        <Switch
          onCheckedChange={handleToggle}
          label={data.state}
          size="lg"
          variant="glow"
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

export default memo(InputSourceNode);
