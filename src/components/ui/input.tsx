import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-12 w-full rounded-[var(--radius-lg)] bg-bg-subtle px-4 text-base text-fg placeholder:text-fg-subtle",
        "shadow-[inset_0_0_0_1px_var(--color-border)] outline-none",
        "focus-visible:shadow-[inset_0_0_0_2px_var(--color-accent)]",
        className,
      )}
      {...props}
    />
  );
}
