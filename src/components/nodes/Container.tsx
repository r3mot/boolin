import { cn } from "@/lib/utils";

interface ContainerProps {
  className?: string;
  children: React.ReactNode;
}

export function NodeContainer({ className, children }: ContainerProps) {
  return (
    <div
      className={cn(
        "relative px-8 py-4 rounded-md bg-background dark:bg-neutral-100 shadow-sm border-muted-foreground border group",
        className
      )}
    >
      {children}
    </div>
  );
}
