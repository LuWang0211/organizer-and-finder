import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/utils/tailwind"
import type { IconKey } from "@/ui/icon-presets"
import { ICON_COMPONENTS } from "@/ui/icon-presets"

const iconVariants = cva(
  [
    "relative inline-flex items-center justify-center rounded-full border-border transition-all duration-200",
    "shadow-[0_2px_6px_0_rgba(0,0,0,0.1)_inset,2px_-2px_6px_0_color-mix(in_oklch,hsl(var(--card)),black_8%)_inset]",
    "hover:scale-[1.05] will-change-transform"
  ],
  {
    variants: {
      variant: {
        default: [
          "bg-linear-to-bl from-[color-mix(in_oklch,hsl(var(--card)),white_80%)] via-card to-card",
          "hover:shadow-[0_4px_8px_0_rgba(0,0,0,0.15)_inset,3px_-3px_8px_0_color-mix(in_oklch,hsl(var(--card)),black_12%)_inset]"
        ],
        primary: [
          "bg-linear-to-bl from-[color-mix(in_oklch,hsl(var(--primary-accent)),white_80%)] via-primary-accent to-primary-accent text-white",
          "shadow-[-2px_2px_1px_0.5px_hsl(var(--highlight)/60%)_inset,2px_-2px_1px_0.5px_color-mix(in_oklch,hsl(var(--primary-accent)),black_25%)_inset]",
          "hover:shadow-[-3px_3px_2px_1px_hsl(var(--highlight)/70%)_inset,3px_-3px_2px_1px_color-mix(in_oklch,hsl(var(--primary-accent)),black_30%)_inset]"
        ],
        secondary: [
          "bg-linear-to-bl from-[color-mix(in_oklch,var(--color-cyan-300),white_80%)] via-cyan-300 to-cyan-300",
          "text-cyan-600",
          "shadow-[0_2px_6px_0_rgba(0,0,0,0.1)_inset,2px_-2px_6px_0_color-mix(in_oklch,var(--color-cyan-300),black_15%)_inset]",
          "hover:shadow-[0_4px_8px_0_rgba(0,0,0,0.2)_inset,3px_-3px_8px_0_color-mix(in_oklch,var(--color-cyan-300),black_20%)_inset]"
        ],
        orange: [
          "bg-linear-to-bl from-[color-mix(in_oklch,var(--color-orange-300),white_80%)] via-orange-300 to-orange-300",
          "text-orange-600",
          "shadow-[0_2px_6px_0_rgba(0,0,0,0.1)_inset,2px_-2px_6px_0_color-mix(in_oklch,var(--color-orange-300),black_15%)_inset]",
          "hover:shadow-[0_4px_8px_0_rgba(0,0,0,0.2)_inset,3px_-3px_8px_0_color-mix(in_oklch,var(--color-orange-300),black_20%)_inset]"
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
  iconKey?: IconKey
}

const Icon = React.forwardRef<HTMLDivElement, IconProps>(
  ({ className, variant, size = "default", border, iconKey, ...props }, ref) => {
    const config = iconSizeConfig[size ?? "default"]

    // Resolve icon from iconKey (if provided)
    const IconComponent = iconKey ? ICON_COMPONENTS[iconKey] : null
    const iconElement = IconComponent ? (
      <IconComponent size={config.iconSize} strokeWidth={config.strokeWidth} />
    ) : null

    return (
      <div className="relative group">
        {/* Floating shadow */}
        <div className="absolute inset-0 -z-10 bg-shadow/60 rounded-full blur-xs translate-y-1.5 scale-x-105 origin-bottom group-hover:translate-y-2 group-hover:scale-x-110 group-hover:blur-[6px] group-hover:opacity-80 transition-all duration-200 ease-out" />
        {/* Main Icon */}
        <div
          ref={ref}
          className={cn(iconVariants({ variant, size, border }), className)}
          {...props}
        >
          {iconElement}
        </div>
      </div>
    )
  }
)

Icon.displayName = "Icon"

export { Icon, iconVariants }
