import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none border-none cursor-pointer",
  {
    variants: {
      variant: {
        primary:
          "bg-[var(--diary-text)] text-[var(--diary-bg)] hover:bg-[var(--diary-text)]/90",
        secondary:
          "bg-[var(--diary-muted)] text-[var(--diary-card)] hover:bg-[var(--diary-muted)]/90",
        tertiary:
          "bg-[var(--diary-bg)] text-[var(--diary-text)] border border-[var(--diary-border)] hover:bg-[var(--diary-border)]",
        destructive:
          "bg-red-600 text-white hover:bg-red-700",
        outline:
          "border border-[var(--diary-border)] bg-transparent text-[var(--diary-text)] hover:bg-[var(--diary-border)]",
        ghost:
          "hover:bg-[var(--diary-border)] text-[var(--diary-text)]",
        link: "text-[var(--diary-text)] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 px-3 py-1.5 text-xs",
        lg: "h-11 px-6 py-3",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
