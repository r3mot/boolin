import { usePreferenceStore } from "@/state/stores/preference.store";
import {
  type EdgeProps,
  getBezierPath,
  getSmoothStepPath,
  getStraightPath,
} from "@xyflow/react";

export function useConnectionPath(props: EdgeProps) {
  const connection = usePreferenceStore((state) => state.connectionPath);

  const pathParams = {
    sourceX: props.sourceX,
    sourceY: props.sourceY,
    sourcePosition: props.sourcePosition,
    targetX: props.targetX,
    targetY: props.targetY,
    targetPosition: props.targetPosition,
  };

  switch (connection) {
    case "smoothstep":
      return getSmoothStepPath(pathParams);
    case "step":
      return getSmoothStepPath({ ...pathParams, borderRadius: 0 });
    case "straight":
      return getStraightPath(pathParams);
    default:
      return getBezierPath(pathParams);
  }
}
