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
    name: "Or",
    node: {
      type: NodeType.Gate,
      operation: Operation.Or,
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
  {
    name: "Nand",
    node: {
      type: NodeType.Gate,
      operation: Operation.Nand,
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

function DraggableItem({ item, onDragStart }: DraggableItemProps) {
  const { name, node } = item;

  const renderImage = () => {
    if (node.operation === Operation.Output) {
      return (
        <img
          src={`/svgs/${node.state === CircuitState.HIGH ? "output-high.svg" : "output-low.svg"}`}
          alt={name}
          className="w-12 h-12 object-contain"
          draggable={false}
        />
      );
    }

    return (
      <img
        src={`/svgs/${node.operation}.svg`}
        alt={name}
        className="w-12 h-12 object-contain"
        draggable={false}
      />
    );
  };

  return (
    <div
      className={cn(
        "p-4 text-center bg-white dark:bg-neutral-100 flex items-center justify-center",
        "flex-col gap-2 border rounded-md shadow-sm cursor-move",
        "hover:shadow-md hover:border-primary/50 transition-all duration-200 ease-in-out"
      )}
      onDragStart={(e) => onDragStart(e, { ...node })}
      draggable
    >
      <span className="sr-only">{name}</span>
      {renderImage()}
      <span className="text-xs font-medium text-neutral-600 dark:text-neutral-950">
        {name}
      </span>
    </div>
  );
}

interface DragGroupProps {
  title: string;
  items: DraggableNode[];
  value: string;
  onDragStart: DragStart;
}

function DraggableGroup({ title, items, value, onDragStart }: DragGroupProps) {
  return (
    <AccordionItem value={value} className="border-b">
      <AccordionTrigger className="hover:no-underline hover:bg-neutral-100 dark:hover:bg-neutral-800 px-4">
        <span className="text-sm font-semibold">{title}</span>
      </AccordionTrigger>
      <AccordionContent>
        <div className="grid grid-cols-2 gap-4 p-4">
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

export function Sidebar() {
  const { setValue } = useDragAndDrop();

  const onDragStart: DragStart = (e, value) => {
    e.dataTransfer.effectAllowed = "move";
    setValue(value);
  };

  return (
    <aside className="w-64 border-r">
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
    </aside>
  );
}
