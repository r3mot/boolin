import { DragAndDropContext } from "@/state/contexts/DragAndDropContext";
import { OnDragNodeStart } from "@/types/types";

import { useContext } from "react";

export function useDragAndDrop() {
  const dndContext = useContext(DragAndDropContext);

  if (!dndContext) {
    throw new Error("useDragAndDrop must be used within a DragAndDropProvider");
  }

  const onDragStart: OnDragNodeStart = (e, value) => {
    e.dataTransfer.effectAllowed = "move";
    dndContext.setValue(value);
  };

  return {
    ...dndContext,
    onDragStart,
  };
}
