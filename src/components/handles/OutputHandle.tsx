import { cn } from "@/lib/utils";
import { Handle, HandleProps, useNodeConnections } from "@xyflow/react";

interface OutputHandleProps
  extends Pick<HandleProps, "id" | "style" | "position"> {
  className?: string;
  limit?: number;
  id: string;
}

export function OutputHandle({
  className,
  limit = 1,
  id,
  ...props
}: OutputHandleProps) {
  const connections = useNodeConnections({
    handleType: "target",
    handleId: id,
  });

  return (
    <Handle
      {...props}
      type="target"
      className={cn("handle", className)}
      id={id}
      isConnectable={connections.length < limit}
    />
  );
}
