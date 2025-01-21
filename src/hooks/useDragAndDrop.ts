import { DragAndDropContext } from "@/state/contexts/DragAndDropContext";

import { useContext } from "react";

export function useDragAndDrop() {
  const dndContext = useContext(DragAndDropContext);

  if (!dndContext) {
    throw new Error("useDragAndDrop must be used within a DragAndDropProvider");
  }

  return dndContext;
}
