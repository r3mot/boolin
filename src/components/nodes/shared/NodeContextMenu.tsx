import { Icon } from "@/components/Icon";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuPortal,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useNodeOption } from "@/hooks/useNodeOption";
import { GateMetadata, Operation } from "@/types/enums";
import { Trash, Cable, Cpu } from "lucide-react";
import { PropsWithChildren, useMemo } from "react";

interface NodeWrapperProps {
  id: string;
  operation: Operation;
}

export function NodeContextMenu({
  children,
  id,
  operation,
}: PropsWithChildren<NodeWrapperProps>) {
  const { handleDeleteNode, handleSwapNode } = useNodeOption();

  const { ioNodes, logicGates } = useMemo(() => {
    const ioNodeTypes = new Set<Operation>([
      "constant-high",
      "constant-low",
      "output",
    ] as const);

    const io: string[] = [];
    const logic: string[] = [];

    for (const key of Object.keys(GateMetadata)) {
      (ioNodeTypes.has(key as Operation) ? io : logic).push(key);
    }

    return { ioNodes: io, logicGates: logic };
  }, []);

  return (
    <ContextMenu>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>

      <ContextMenuContent className="w-52 backdrop-blur-sm border-border/50 shadow-xl">
        <div className="px-3 py-2 border-b border-border/50">
          <p className="text-sm font-medium text-muted-foreground">
            Actions: ({operation})
          </p>
        </div>

        <ContextMenuSub>
          <ContextMenuSubTrigger className="px-3 py-2 hover:bg-accent/50 transition-colors flex items-center">
            <Cable className="w-4 h-4 mr-2 text-blue-500" />
            <span className="font-medium">IO Nodes</span>
          </ContextMenuSubTrigger>
          <ContextMenuPortal>
            <ContextMenuSubContent className="ml-1 bg-background/95 backdrop-blur-sm border-border/50 shadow-xl">
              {ioNodes.map((key) => {
                const type = key as Operation;
                return (
                  <ContextMenuItem
                    key={type}
                    onClick={() => handleSwapNode(type, id)}
                    className="px-3 py-2 hover:bg-accent/50 transition-colors capitalize flex items-center gap-2"
                  >
                    <Icon name={type} className="w-4 h-4" />
                    <p>{type}</p>
                  </ContextMenuItem>
                );
              })}
            </ContextMenuSubContent>
          </ContextMenuPortal>
        </ContextMenuSub>

        <ContextMenuSeparator className="my-1" />

        <ContextMenuSub>
          <ContextMenuSubTrigger className="px-3 py-2 hover:bg-accent/50 transition-colors flex items-center">
            <Cpu className="w-4 h-4 mr-2 text-purple-500" />
            <span className="font-medium">Logic Gates</span>
          </ContextMenuSubTrigger>
          <ContextMenuPortal>
            <ContextMenuSubContent className="ml-1 bg-background/95 backdrop-blur-sm border-border/50 shadow-xl">
              {logicGates.map((key) => {
                const type = key as Operation;
                return (
                  <ContextMenuItem
                    key={type}
                    onClick={() => handleSwapNode(type, id)}
                    className="px-3 py-2 hover:bg-accent/50 transition-colors capitalize flex items-center gap-2"
                  >
                    <Icon name={type} className="w-4 h-4" />
                    <p>{type}</p>
                  </ContextMenuItem>
                );
              })}
            </ContextMenuSubContent>
          </ContextMenuPortal>
        </ContextMenuSub>

        <ContextMenuSeparator className="my-1" />

        <ContextMenuItem
          onClick={() => handleDeleteNode(id)}
          className="px-3 py-2 hover:bg-destructive/10 text-destructive transition-colors"
        >
          <div className="flex items-center justify-between w-full">
            <span className="font-medium">Delete Node</span>
            <Trash className="h-4 w-4" />
          </div>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
