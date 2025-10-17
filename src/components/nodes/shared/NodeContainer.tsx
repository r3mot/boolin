import { cn } from "@/lib/utils";
import type { Operation } from "@/types/enums";
import type { HTMLAttributes, PropsWithChildren } from "react";
import { NodeContextMenu } from "./NodeContextMenu";

interface Props {
  id: string;
  operation: Operation;
}

export function NodeContainer({
  children,
  className,
  operation,
  id,
  ...props
}: PropsWithChildren<HTMLAttributes<HTMLDivElement> & Props>) {
  return (
    <div
      {...props}
      className={cn(
        "relative px-8 py-4 rounded-md bg-background dark:bg-neutral-100 shadow-sm border-muted-foreground border ",
        className
      )}
    >
      <NodeContextMenu id={id} operation={operation}>
        {children}
      </NodeContextMenu>
    </div>
  );
}
