import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/utils/tailwind"

// Base button styles
const buttonBaseStyles = [
  "relative z-10 inline-flex items-center justify-center font-bold overflow-visible",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-outline focus-visible:ring-offset-2",
  "transition-all duration-200 ease-out active:translate-y-0.5",
  "border-4 border-border rounded-full"
]

// Button variants using cva
const buttonVariants = cva(buttonBaseStyles, {
  variants: {
    variant: {
      primary: [
        "bg-primary-accent text-white",
        "shadow-[-3px_3px_2px_1px_hsl(var(--highlight)/70%)_inset,3px_-3px_2px_1px_color-mix(in_oklch,hsl(var(--primary-accent)),black_30%)_inset]",
        "hover:scale-[1.02] hover:shadow-[-3px_3px_2px_1px_hsl(var(--highlight)/70%)_inset,3px_-3px_2px_1px_color-mix(in_oklch,hsl(var(--primary-accent)),black_30%)_inset]",
        "active:shadow-inner active:shadow-black/10"
      ],
      secondary: [
        "bg-secondary text-text-main",
        "shadow-[3px_-3px_2px_1px_color-mix(in_oklch,hsl(var(--secondary)),black_30%)_inset]",
        "hover:scale-[1.02] hover:shadow-[3px_-3px_2px_1px_color-mix(in_oklch,hsl(var(--secondary)),black_30%)_inset]"
      ],
      outline: [
        "bg-transparent text-white/90 border-2 border-current",
        "hover:bg-background/10",
        "shadow-[3px_-3px_2px_1px_color-mix(in_oklch,hsl(var(--secondary)),black_30%)_inset]",
        "hover:scale-[1.02] hover:shadow-[3px_-3px_2px_1px_color-mix(in_oklch,hsl(var(--secondary)),black_30%)_inset]"
      ],
      ghost: [
        "font-medium",
        "bg-transparent text-white/50 border-transparent border-2",
        "hover:bg-background/10 hover:scale-[1.02] hover:border-white/20 hover:text-white/90 "
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
    "absolute inset-0 z-10 rounded-full blur-[4px] translate-y-1.5 scale-x-105 origin-bottom",
    "group-hover/button:translate-y-2 group-hover/button:scale-x-110 group-hover/button:blur-[6px] group-hover/button:opacity-80",
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

// Text variants using cva
const textVariants = cva(
  "relative z-20",
  {
    variants: {
      variant: {
        primary: [
          "text-white",
          "[text-shadow:0.5px_0.5px_0_rgba(0,0,0,0.3),-0.5px_0.5px_0_rgba(0,0,0,0.3),0.5px_-0.5px_0_rgba(0,0,0,0.2),-0.5px_-0.5px_0_rgba(0,0,0,0.2)]"
        ],
        secondary: [
          "text-text-main"
        ],
        outline: [
          "text-white/20",
          "[text-shadow:0.5px_0.5px_0_rgba(255,255,255,0.8)]"
        ],
        ghost: []
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
  ({ className, variant = 'primary', size, asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    return (
      <div className="relative inline-block group/button">
        {/* Floating shadow */}
        <div 
          className={cn(
            shadowVariants({ variant }),
            className
          )} 
        />
        
        {/* Button with highlight and border */}
        <Comp
          ref={ref}
          className={cn(
            buttonVariants({ variant, size }),
            "relative z-10"
          )}
          {...props}
        >
          <span className={cn(
            textVariants({ variant })
          )}>
            {children}
          </span>
        </Comp>
      </div>
    )
  }
)

Button.displayName = "Button"

export { Button, buttonVariants }
