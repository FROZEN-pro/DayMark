import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-medium select-none transition-[transform,background-color,color,opacity] duration-[var(--motion-quick)] ease-[var(--ease-out)] disabled:pointer-events-none disabled:opacity-40 active:not-disabled:scale-[0.96] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
  {
    variants: {
      variant: {
        primary: "bg-accent text-accent-fg",
        secondary: "bg-bg-subtle text-fg",
        ghost: "bg-transparent text-fg",
        outline: "bg-bg-elevated text-fg shadow-[var(--shadow-border)]",
        danger: "bg-danger text-danger-fg",
      },
      size: {
        sm: "h-10 px-3 text-sm rounded-[var(--radius-md)]",
        md: "h-12 px-4 text-base rounded-[var(--radius-lg)]",
        lg: "h-14 px-5 text-lg rounded-[var(--radius-xl)]",
        icon: "size-12 rounded-[var(--radius-lg)]",
        pill: "h-11 px-4 text-sm rounded-full",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export function Button({
  className,
  variant,
  size,
  asChild,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />
  );
}
