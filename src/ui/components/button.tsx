import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/utils/tailwind"

// Base button styles
const buttonBaseStyles = [
  "relative z-10 inline-flex items-center justify-center font-bold overflow-visible",
  "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-outline focus-visible:ring-offset-2",
  "transition-all duration-200 ease-out active:translate-y-0.5",
  "border-4 border-border rounded-full"
]

// Button variants using cva
const buttonVariants = cva(buttonBaseStyles, {
  variants: {
    variant: {
      primary: [
        "bg-primary-accent text-white",
        "[text-shadow:0.5px_0.5px_0_rgba(0,0,0,0.3),-0.5px_0.5px_0_rgba(0,0,0,0.3),0.5px_-0.5px_0_rgba(0,0,0,0.2),-0.5px_-0.5px_0_rgba(0,0,0,0.2)]",
        "shadow-[-3px_3px_2px_1px_hsl(var(--highlight)/70%)_inset,3px_-3px_2px_1px_color-mix(in_oklch,hsl(var(--primary-accent)),black_30%)_inset]",
        "hover:scale-[1.02] hover:shadow-[-3px_3px_2px_1px_hsl(var(--highlight)/70%)_inset,3px_-3px_2px_1px_color-mix(in_oklch,hsl(var(--primary-accent)),black_30%)_inset]",
        "active:shadow-inner active:shadow-black/10",
        "disabled:bg-primary-accent/70 disabled:text-white/60 disabled:cursor-not-allowed",
        "disabled:shadow-[-2px_2px_1px_0px_hsl(var(--highlight)/25%)_inset,2px_-2px_1px_0px_color-mix(in_oklch,hsl(var(--primary-accent)),black_50%)_inset] disabled:hover:scale-100 disabled:active:translate-y-0 disabled:saturate-50"
      ],
      secondary: [
        "bg-secondary text-text-main",
        "shadow-[3px_-3px_2px_1px_color-mix(in_oklch,hsl(var(--secondary)),black_30%)_inset]",
        "hover:scale-[1.02] hover:shadow-[3px_-3px_2px_1px_color-mix(in_oklch,hsl(var(--secondary)),black_30%)_inset]",
        "disabled:bg-gray-400 disabled:text-gray-700 disabled:cursor-not-allowed",
        "disabled:shadow-[2px_-2px_1px_0px_color-mix(in_oklch,hsl(var(--secondary)),black_60%)_inset] disabled:hover:scale-100 disabled:active:translate-y-0"
      ],
      outline: [
        "bg-transparent text-white/90 border-2 border-current",
        "[text-shadow:0.5px_0.5px_0_rgba(255,255,255,0.8)]",
        "hover:bg-background/10",
        "shadow-[3px_-3px_2px_1px_color-mix(in_oklch,hsl(var(--secondary)),black_30%)_inset]",
        "hover:scale-[1.02] hover:shadow-[3px_-3px_2px_1px_color-mix(in_oklch,hsl(var(--secondary)),black_30%)_inset]",
        "disabled:text-gray-500 disabled:border-gray-500 disabled:cursor-not-allowed disabled:opacity-50",
        "disabled:bg-transparent disabled:shadow-none disabled:hover:scale-100 disabled:hover:bg-transparent disabled:active:translate-y-0",
        "disabled:hover:shadow-none"
      ],
      ghost: [
        "font-medium",
        "bg-transparent text-white/50 border-transparent border-2",
        "hover:bg-background/10 hover:scale-[1.02] hover:border-white/20 hover:text-white/90",
        "disabled:text-white/40 disabled:cursor-not-allowed disabled:opacity-40",
        "disabled:hover:bg-transparent disabled:hover:scale-100 disabled:hover:border-transparent disabled:active:translate-y-0"
      ]
    },
    size: {
      default: "px-8 py-3 text-xl",
      sm: "px-6 py-2 text-lg",
      lg: "px-10 py-4 text-2xl",
      icon: "p-3"
    }
  },
  defaultVariants: {
    variant: "primary",
    size: "default"
  }
})

// Shadow variants using cva
const shadowVariants = cva(
  [
    "z-0 rounded-full blur-xs translate-y-1.5 scale-x-105 origin-bottom pointer-events-none",
    "group-hover/button:translate-y-2 group-hover/button:scale-x-110 group-hover/button:blur-[6px] group-hover/button:opacity-80",
    "group-disabled/button:opacity-20 group-disabled/button:translate-y-0.5 group-disabled/button:scale-x-100 group-disabled/button:blur-none",
    "transition-all duration-200 ease-out"
  ],
  {
    variants: {
      variant: {
        primary: "bg-shadow/90",
        secondary: "bg-shadow/50",
        outline: "bg-foreground/10",
        ghost: "bg-foreground/5"
      }
    },
    defaultVariants: {
      variant: "primary"
    }
  }
)


export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size, asChild = false, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    return (
      <div className={cn("relative group/button", disabled && "group-disabled/button")} style={{ display: 'inline-block' }}>
        {/* Button with highlight and border */}
        <Comp
          ref={ref}
          disabled={disabled}
          className={cn(
            buttonVariants({ variant, size }),
            "relative z-10 block",
            className
          )}
          {...props}
        >
          {children}
        </Comp>
        
        {/* Floating shadow */}
        <div 
          className={cn(
            shadowVariants({ variant }),
            "absolute top-0 left-0 right-0 bottom-0"
          )}
        />
      </div>
    )
  }
)

Button.displayName = "Button"

export { Button, buttonVariants }
