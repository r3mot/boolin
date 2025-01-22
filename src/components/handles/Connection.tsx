import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getBezierPath,
  useReactFlow,
} from "@xyflow/react";
import { useCallback } from "react";
import { Button } from "../ui/button";

export function Connection(props: EdgeProps) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX: props.sourceX,
    sourceY: props.sourceY,
    sourcePosition: props.sourcePosition,
    targetX: props.targetX,
    targetY: props.targetY,
    targetPosition: props.targetPosition,
  });

  const { deleteElements } = useReactFlow();

  const onClick = useCallback(() => {
    deleteElements({ edges: [{ id: props.id }] });
  }, [deleteElements, props.id]);

  return (
    <>
      <BaseEdge id={props.id} path={edgePath} style={props.style} />
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
