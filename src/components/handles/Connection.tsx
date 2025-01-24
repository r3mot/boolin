import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  useReactFlow,
} from "@xyflow/react";
import { useCallback } from "react";
import { Button } from "../ui/button";
import { useConnectionPath } from "@/hooks/useConnectionPath";
import { usePreferenceStore } from "@/state/stores/preference.store";
import { useShallow } from "zustand/shallow";
import { connectionSelector } from "@/state/stores/preference.shared";

export function Connection(props: EdgeProps) {
  const { deleteElements } = useReactFlow();

  const [edgePath, labelX, labelY] = useConnectionPath(props);
  const { strokeWidth } = usePreferenceStore(useShallow(connectionSelector));

  const handleDelete = useCallback(() => {
    deleteElements({ edges: [{ id: props.id }] });
  }, [deleteElements, props]);

  return (
    <>
      <BaseEdge
        id={props.id}
        path={edgePath}
        style={{
          ...props.style,
          strokeWidth,
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
            onClick={handleDelete}
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
