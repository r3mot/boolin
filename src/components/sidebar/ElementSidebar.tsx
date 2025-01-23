import { CircuitState, NodeType, Operation } from "@/types/enums";
import type { DraggableNode, DraggableNodeValue } from "@/types/types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useDragAndDrop } from "@/hooks/useDragAndDrop";
import { cn } from "@/lib/utils";
import { Label } from "../ui/label";
import { memo, useCallback } from "react";

const ioNodes: DraggableNode[] = [
  {
    name: "High Input",
    node: {
      type: NodeType.Input,
      operation: Operation.ConstantHigh,
      state: CircuitState.HIGH,
      originalState: CircuitState.HIGH,
    },
  },
  {
    name: "Low Input",
    node: {
      type: NodeType.Input,
      operation: Operation.ConstantLow,
      state: CircuitState.LOW,
      originalState: CircuitState.LOW,
    },
  },
  {
    name: "Output",
    node: {
      type: NodeType.Output,
      operation: Operation.Output,
      state: CircuitState.LOW,
      originalState: CircuitState.LOW,
    },
  },
];

const gateNodes: DraggableNode[] = [
  {
    name: "And",
    node: {
      type: NodeType.Gate,
      operation: Operation.And,
      state: CircuitState.LOW,
      originalState: CircuitState.LOW,
    },
  },
  {
    name: "Nand",
    node: {
      type: NodeType.Gate,
      operation: Operation.Nand,
      state: CircuitState.LOW,
      originalState: CircuitState.LOW,
    },
  },
  {
    name: "Or",
    node: {
      type: NodeType.Gate,
      operation: Operation.Or,
      state: CircuitState.LOW,
      originalState: CircuitState.LOW,
    },
  },
  {
    name: "Nor",
    node: {
      type: NodeType.Gate,
      operation: Operation.Nor,
      state: CircuitState.LOW,
      originalState: CircuitState.LOW,
    },
  },
  {
    name: "Xor",
    node: {
      type: NodeType.Gate,
      operation: Operation.Xor,
      state: CircuitState.LOW,
      originalState: CircuitState.LOW,
    },
  },
  {
    name: "Not",
    node: {
      type: NodeType.Gate,
      operation: Operation.Not,
      state: CircuitState.LOW,
      originalState: CircuitState.LOW,
    },
  },
];

type DragStart = (
  e: React.DragEvent<HTMLDivElement>,
  value: DraggableNodeValue
) => void;

interface DraggableItemProps {
  item: DraggableNode;
  onDragStart: DragStart;
}

const DraggableItem = memo(function DraggableItem({
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
      <img
        src={src}
        alt={name}
        className={cn("object-contain")}
        style={{ width: size, height: size }}
        draggable={false}
        width={size}
        height={size}
      />
    );
  }, [name, node.operation, node.state]);

  return (
    <div className="space-y-1">
      <Label className="text-xs font-base">{name}</Label>
      <div
        className={cn(
          "p-4 text-center bg-neutral-100 dark:bg-neutral-100 flex items-center justify-center",
          "flex-col gap-2 rounded-md cursor-move",
          "hover:shadow-md hover:border-primary/50 transition-all duration-200 ease-in-out"
        )}
        onDragStart={(e) => onDragStart(e, { ...node })}
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

interface DragGroupProps {
  title: string;
  items: DraggableNode[];
  value: string;
  onDragStart: DragStart;
}

function DraggableGroup({ title, items, value, onDragStart }: DragGroupProps) {
  return (
    <AccordionItem value={value} className="border-b overflow-x-hidden">
      <AccordionTrigger>
        <span className="text-sm font-semibold">{title}</span>
      </AccordionTrigger>
      <AccordionContent>
        <div className="grid grid-cols-2 gap-4">
          {items.map((item) => (
            <DraggableItem
              key={item.name}
              item={item}
              onDragStart={onDragStart}
            />
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

export function ElementSidebar() {
  const { setValue } = useDragAndDrop();

  const onDragStart: DragStart = (e, value) => {
    e.dataTransfer.effectAllowed = "move";
    setValue(value);
  };

  return (
    <div className="flex-grow overflow-auto">
      <Accordion type="multiple" defaultValue={["io", "gates"]}>
        <DraggableGroup
          title="IO Controls"
          value="io"
          items={ioNodes}
          onDragStart={onDragStart}
        />
        <DraggableGroup
          title="Logic Gates"
          value="gates"
          items={gateNodes}
          onDragStart={onDragStart}
        />
      </Accordion>
    </div>
  );
}
