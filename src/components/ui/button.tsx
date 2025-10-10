import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  // GEO THEME: Sharp, flat, high-contrast base styles
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-bold uppercase tracking-wide transition-colors duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none border-1 border-black shadow-none focus:ring-2 focus:ring-black focus:ring-offset-2",
  {
    variants: {
      variant: {
        // GEO THEME: Black button with white text (primary geometric style)
        default: "bg-black text-white hover:bg-white hover:text-black",
        // GEO THEME: White button with black text (secondary geometric style)
        secondary: "bg-white text-black hover:bg-black hover:text-white",
        // GEO THEME: Outline button (transparent with geometric border)
        outline:
          "bg-transparent text-black border-1 border-black hover:bg-black hover:text-white",
        // Keep other variants for compatibility
        destructive: "bg-black text-white hover:bg-white hover:text-black",
        ghost:
          "bg-transparent text-black border-1 border-transparent hover:border-black hover:bg-black hover:text-white",
        link: "text-black underline-offset-4 hover:underline border-none",
      },
      size: {
        // GEO THEME: Touch-friendly sizes (minimum 44px height for mobile)
        default: "h-12 px-6 py-3",
        sm: "h-11 px-4 py-2 text-sm", // Changed from h-10 to h-11 (44px minimum)
        lg: "h-14 px-8 py-4 text-lg",
        icon: "size-12",
      },
    },
    defaultVariants: {
      variant: "default",
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
