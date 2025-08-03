import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/utils/tailwind"

const cardVariants = cva(
  [
    "rounded-3xl border-4 border-border text-text-main overflow-hidden transition-all duration-200",
    "hover:scale-[1.02]"
  ],
  {
    variants: {
      variant: {
        default: [
          "bg-card",
          "shadow-[0_2px_8px_0_hsl(var(--shadow)/20%)_inset,2px_-2px_8px_0_color-mix(in_oklch,hsl(var(--card)),black_10%)_inset]",
          "hover:shadow-[0_4px_12px_0_hsl(var(--shadow)/30%)_inset,3px_-3px_12px_0_color-mix(in_oklch,hsl(var(--card)),black_15%)_inset]"
        ],
        secondary: [
          "bg-cyan-300",
          "shadow-[0_2px_8px_0_rgba(0,0,0,0.15)_inset,2px_-2px_8px_0_color-mix(in_oklch,var(--color-cyan-300),black_15%)_inset]",
          "hover:shadow-[0_4px_12px_0_rgba(0,0,0,0.25)_inset,3px_-3px_12px_0_color-mix(in_oklch,var(--color-cyan-300),black_20%)_inset]"
        ],
        primary: [
          "bg-primary-accent text-white",
          "shadow-[-3px_3px_2px_1px_hsl(var(--highlight)/70%)_inset,3px_-3px_2px_1px_color-mix(in_oklch,hsl(var(--primary-accent)),black_30%)_inset]",
          "hover:shadow-[-3px_3px_2px_1px_hsl(var(--highlight)/70%)_inset,3px_-3px_2px_1px_color-mix(in_oklch,hsl(var(--primary-accent)),black_30%)_inset]"
        ]
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
)

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, ...props }, ref) => (
    <div className="relative group">
      {/* Floating shadow */}
      <div className="absolute inset-0 -z-10 bg-shadow/60 rounded-3xl blur-[6px] translate-y-2 scale-x-110 origin-bottom group-hover:translate-y-3 group-hover:scale-x-115 group-hover:blur-[10px] group-hover:opacity-80 transition-all duration-200 ease-out" />
      {/* Main Card */}
      <div
        ref={ref}
        className={cn(cardVariants({ variant }), className)}
        {...props}
      />
    </div>
  )
)
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-2 p-6", className) }
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "text-2xl font-extrabold leading-none tracking-tight",
      "[text-shadow:0.5px_0.5px_0_rgba(0,0,0,0.3),-0.5px_0.5px_0_rgba(0,0,0,0.3),0.5px_-0.5px_0_rgba(0,0,0,0.2),-0.5px_-0.5px_0_rgba(0,0,0,0.2)]",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-base font-medium", className) }
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
