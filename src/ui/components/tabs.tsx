"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/utils/tailwind"

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-14 items-stretch justify-center rounded-full border-4 border-border bg-card-bg p-0 gap-0",
      "shadow-[0_2px_6px_0_rgba(0,0,0,0.1)_inset,2px_-2px_6px_0_color-mix(in_oklch,hsl(var(--card-bg)),black_8%)_inset]",
      className
    )}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap px-6 py-3 text-base font-extrabold transition-all duration-200 flex-1 h-full",
      "text-text-main/70 hover:text-text-main hover:bg-card-bg/50 rounded-full",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-outline focus-visible:ring-offset-2",
      "disabled:pointer-events-none disabled:opacity-60",
      "data-[state=active]:bg-primary-accent data-[state=active]:text-white data-[state=active]:rounded-full",
      "data-[state=active]:shadow-[-2px_2px_1px_0.5px_hsl(var(--highlight)/60%)_inset,2px_-2px_1px_0.5px_color-mix(in_oklch,hsl(var(--primary-accent)),black_25%)_inset]",
      "data-[state=active]:[text-shadow:0.5px_0.5px_0_rgba(0,0,0,0.3),-0.5px_0.5px_0_rgba(0,0,0,0.3),0.5px_-0.5px_0_rgba(0,0,0,0.2),-0.5px_-0.5px_0_rgba(0,0,0,0.2)]",
      className
    )}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-6 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-outline focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
