import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  useReactFlow,
} from "@xyflow/react";
import { useCallback } from "react";
import { Button } from "../ui/button";
import { useConnectionPath } from "@/hooks/useConnectionPath";

export function Connection(props: EdgeProps) {
  const [edgePath, labelX, labelY] = useConnectionPath(props);
  const { deleteElements } = useReactFlow();

  const onClick = useCallback(() => {
    deleteElements({ edges: [{ id: props.id }] });
  }, [deleteElements, props.id]);

  return (
    <>
      <BaseEdge
        id={props.id}
        path={edgePath}
        style={{
          ...props.style,
          strokeWidth: 2,
        }}
      />
      <EdgeLabelRenderer>
        <div
          className="absolute pointer-events-auto origin-center w-6 h-6 rounded-full flex items-center justify-center"
          style={{
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
          }}
        >
          <Button
            onClick={onClick}
            className="rounded-full"
            variant="x"
            size="xs"
          >
            ×
          </Button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
