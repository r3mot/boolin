import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const switchVariants = cva(
  "peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      size: {
        sm: "h-4 w-7",
        default: "h-5 w-9",
        lg: "h-7 w-12",
      },
      variant: {
        default:
          "data-[state=checked]:bg-foreground data-[state=unchecked]:bg-gray-400 dark:data-[state=unchecked]:bg-gray-500",
        glow: "data-[state=checked]:bg-green-500 data-[state=checked]:shadow-lg data-[state=checked]:shadow-green-500/50 data-[state=unchecked]:bg-gray-400 dark:data-[state=unchecked]:bg-gray-600",
      },
    },
    defaultVariants: {
      size: "default",
      variant: "default",
    },
  }
);

const thumbVariants = cva(
  "flex items-center justify-center bg-background rounded-full shadow-lg ring-0 transition-transform font-medium text-xs pointer-events-none",
  {
    variants: {
      size: {
        sm: "h-3 w-3 data-[state=checked]:translate-x-[14px] data-[state=unchecked]:translate-x-[2px]",
        default:
          "h-4 w-4 data-[state=checked]:translate-x-[16px] data-[state=unchecked]:translate-x-[2px]",
        lg: "h-5 w-5 data-[state=checked]:translate-x-[22px] data-[state=unchecked]:translate-x-[2px]",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

export interface SwitchProps
  extends React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>,
    VariantProps<typeof switchVariants> {
  label?: string | number;
}

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  SwitchProps
>(({ className, size, variant, label, ...props }, ref) => {
  return (
    <SwitchPrimitives.Root
      ref={ref}
      className={cn(switchVariants({ size, variant }), className)}
      {...props}
    >
      <SwitchPrimitives.Thumb className={thumbVariants({ size })}>
        {label}
      </SwitchPrimitives.Thumb>
    </SwitchPrimitives.Root>
  );
});

Switch.displayName = "Switch";

export { Switch };
