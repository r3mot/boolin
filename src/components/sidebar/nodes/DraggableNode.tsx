import { memo, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import type { DraggableNodeType, OnDragNodeStart } from "@/types/types";
import { CircuitState, Operation } from "@/types/enums";

interface DraggableItemProps {
  item: DraggableNodeType;
  onDragStart: OnDragNodeStart;
}

export const DraggableNode = memo(function ({
  item,
  onDragStart,
}: DraggableItemProps) {
  const { name, node } = item;

  const renderImage = useCallback(() => {
    const size =
      node.operation === Operation.Output
        ? 38
        : node.operation === Operation.ConstantHigh ||
            node.operation === Operation.ConstantLow
          ? 38
          : 48;

    let src;
    if (node.operation === Operation.Output) {
      src = `/svgs/${node.state === CircuitState.HIGH ? "output-high.svg" : "output-low.svg"}`;
    } else {
      src = `/svgs/${node.operation}.svg`;
    }

    return (
      <div className="h-9 w-full flex items-center justify-center">
        <img
          src={src || "/placeholder.svg"}
          alt={name}
          className={cn("object-contain")}
          style={{ width: size, height: size }}
          draggable={false}
          width={size}
          height={size}
        />
      </div>
    );
  }, [name, node.operation, node.state]);

  return (
    <div className="space-y-1">
      <Label className="text-xs font-normal">{name}</Label>
      <div
        className={cn(
          "p-4 text-center bg-muted flex items-center justify-center",
          "flex-col gap-2 rounded-md cursor-move",
          "hover:bg-muted/80 hover:shadow-sm transition-all duration-200 ease-in-out"
        )}
        onDragStart={(e) => onDragStart(e, node)}
        draggable
        role="button"
        aria-label={`Draggable item: ${name}`}
      >
        <span className="sr-only">{name}</span>
        {renderImage()}
      </div>
    </div>
  );
});
