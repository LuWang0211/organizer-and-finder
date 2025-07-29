import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/utils/tailwind"

const iconVariants = cva(
  [
    "relative inline-flex items-center justify-center rounded-full border-border transition-all duration-200",
    "shadow-[0_2px_6px_0_rgba(0,0,0,0.1)_inset,2px_-2px_6px_0_color-mix(in_oklch,hsl(var(--card-bg)),black_8%)_inset]",
    "hover:scale-[1.05]"
  ],
  {
    variants: {
      variant: {
        default: [
          "bg-gradient-to-bl from-[color-mix(in_oklch,hsl(var(--card-bg)),white_80%)] via-card-bg to-card-bg",
          "hover:shadow-[0_4px_8px_0_rgba(0,0,0,0.15)_inset,3px_-3px_8px_0_color-mix(in_oklch,hsl(var(--card-bg)),black_12%)_inset]"
        ],
        primary: [
          "bg-gradient-to-bl from-[color-mix(in_oklch,hsl(var(--primary-accent)),white_80%)] via-primary-accent to-primary-accent text-white",
          "shadow-[-2px_2px_1px_0.5px_hsl(var(--highlight)/60%)_inset,2px_-2px_1px_0.5px_color-mix(in_oklch,hsl(var(--primary-accent)),black_25%)_inset]",
          "hover:shadow-[-3px_3px_2px_1px_hsl(var(--highlight)/70%)_inset,3px_-3px_2px_1px_color-mix(in_oklch,hsl(var(--primary-accent)),black_30%)_inset]"
        ],
        secondary: [
          "bg-gradient-to-bl from-[color-mix(in_oklch,theme(colors.cyan.300),white_80%)] via-cyan-300 to-cyan-300",
          "text-cyan-600",
          "shadow-[0_2px_6px_0_rgba(0,0,0,0.1)_inset,2px_-2px_6px_0_color-mix(in_oklch,theme(colors.cyan.300),black_15%)_inset]",
          "hover:shadow-[0_4px_8px_0_rgba(0,0,0,0.2)_inset,3px_-3px_8px_0_color-mix(in_oklch,theme(colors.cyan.300),black_20%)_inset]"
        ],
        orange: [
          "bg-gradient-to-bl from-[color-mix(in_oklch,theme(colors.orange.300),white_80%)] via-orange-300 to-orange-300",
          "text-orange-600",
          "shadow-[0_2px_6px_0_rgba(0,0,0,0.1)_inset,2px_-2px_6px_0_color-mix(in_oklch,theme(colors.orange.300),black_15%)_inset]",
          "hover:shadow-[0_4px_8px_0_rgba(0,0,0,0.2)_inset,3px_-3px_8px_0_color-mix(in_oklch,theme(colors.orange.300),black_20%)_inset]"
        ]
      },
      size: {
        tiny: "w-6 h-6",
        sm: "w-10 h-10",
        default: "w-[64px] h-[64px]",
        lg: "w-[88px] h-[88px]"
      },
      border: {
        default: "",
        none: "border-0"
      }
    },
    compoundVariants: [
      {
        size: "tiny",
        border: "default",
        class: "border-2"
      },
      {
        size: ["sm", "default", "lg"],
        border: "default",
        class: "border-4"
      }
    ],
    defaultVariants: {
      variant: "default",
      size: "default",
      border: "default"
    }
  }
)

const iconSizeConfig = {
  tiny: { iconSize: 14, strokeWidth: 1.5 },
  sm: { iconSize: 20, strokeWidth: 2 },
  default: { iconSize: 36, strokeWidth: 2.5 },
  lg: { iconSize: 50, strokeWidth: 3 }
}

export interface IconProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof iconVariants> {
  children?: React.ReactNode
}

const Icon = React.forwardRef<HTMLDivElement, IconProps>(
  ({ className, variant, size = "default", border, children, ...props }, ref) => {
    const config = iconSizeConfig[size ?? "default"]
    
    // Clone children and add size/stroke props if it's a React element
    const iconChildren = React.isValidElement(children) 
      ? React.cloneElement(children as React.ReactElement, {
          size: config.iconSize,
          strokeWidth: config.strokeWidth
        })
      : children

    return (
      <div className="relative group">
        {/* Floating shadow */}
        <div className="absolute inset-0 -z-10 bg-shadow/60 rounded-full blur-[4px] translate-y-1.5 scale-x-105 origin-bottom group-hover:translate-y-2 group-hover:scale-x-110 group-hover:blur-[6px] group-hover:opacity-80 transition-all duration-200 ease-out" />
        {/* Main Icon */}
        <div
          ref={ref}
          className={cn(iconVariants({ variant, size, border }), className)}
          {...props}
        >
          {iconChildren}
        </div>
      </div>
    )
  }
)

Icon.displayName = "Icon"

export { Icon, iconVariants }