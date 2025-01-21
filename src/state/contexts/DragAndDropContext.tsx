import { DraggableNodeValue } from "@/types/types";
import { createContext, useState } from "react";

interface DnDContextProps {
  value: DraggableNodeValue;
  setValue: (value: DraggableNodeValue) => void;
}

export const DragAndDropContext = createContext<DnDContextProps>(
  {} as DnDContextProps
);

export function DragAndDropProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [value, setValue] = useState<DraggableNodeValue>(
    {} as DraggableNodeValue
  );

  return (
    <DragAndDropContext.Provider value={{ value, setValue }}>
      {children}
    </DragAndDropContext.Provider>
  );
}
