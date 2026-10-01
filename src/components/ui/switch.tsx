import * as SwitchPrimitive from "@radix-ui/react-switch";
import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

export function Switch({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      className={cn(
        "relative h-8 w-14 shrink-0 rounded-full bg-bg-subtle shadow-[inset_0_0_0_1px_var(--color-border)]",
        "data-[state=checked]:bg-accent",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        className={cn(
          "block size-6 translate-x-1 rounded-full bg-bg-elevated shadow-sm transition-transform duration-[var(--motion-fast)] ease-[var(--ease-out)]",
          "data-[state=checked]:translate-x-7 data-[state=checked]:bg-accent-fg",
        )}
      />
    </SwitchPrimitive.Root>
  );
}
