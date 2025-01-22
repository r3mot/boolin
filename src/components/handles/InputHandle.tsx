import { cn } from "@/lib/utils";
import { Handle, HandleProps } from "@xyflow/react";

interface InputHandleProps
  extends Pick<HandleProps, "id" | "style" | "position"> {
  className?: string;
}

export function InputHandle({ className, ...props }: InputHandleProps) {
  return (
    <Handle {...props} type="source" className={cn("handle", className)} />
  );
}
