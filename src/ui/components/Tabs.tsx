"use client";

import * as TabsPrimitive from "@radix-ui/react-tabs";
import { motion } from "motion/react";
import * as React from "react";

import { cn } from "@/utils/tailwind";

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => {
  // Track position and width of the sliding indicator
  const [indicatorStyle, setIndicatorStyle] = React.useState({
    left: 0,
    width: 0,
  });
  const listRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    // Calculate position and size of the active tab for the sliding indicator
    const updateIndicator = () => {
      if (!listRef.current) return;

      // Find the currently active tab button
      const activeButton = listRef.current.querySelector(
        '[data-state="active"]',
      ) as HTMLElement;
      if (activeButton) {
        // Get position relative to the tab list container
        const listRect = listRef.current.getBoundingClientRect();
        const buttonRect = activeButton.getBoundingClientRect();

        // Update indicator position to match active tab
        setIndicatorStyle({
          left: buttonRect.left - listRect.left,
          width: buttonRect.width,
        });
      }
    };

    // Initial position calculation
    updateIndicator();

    // Watch for changes in tab state (when user switches tabs)
    const observer = new MutationObserver(updateIndicator);
    if (listRef.current) {
      observer.observe(listRef.current, {
        attributes: true,
        attributeFilter: ["data-state"], // Only watch for data-state changes
        subtree: true, // Include child elements (the tab buttons)
      });
    }

    // Cleanup observer when component unmounts
    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative">
      {/* Main tab list container */}
      <TabsPrimitive.List
        ref={(node) => {
          listRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
        }}
        className={cn(
          "inline-flex h-14 items-stretch justify-center rounded-full border-4 border-border bg-card p-0 gap-0 relative",
          "shadow-[0_2px_6px_0_rgba(0,0,0,0.1)_inset,2px_-2px_6px_0_color-mix(in_oklch,hsl(var(--card)),black_8%)_inset]",
          className,
        )}
        {...props}
      />
      {/* Sliding indicator that follows the active tab */}
      <motion.div
        className="absolute rounded-full pointer-events-none z-20"
        style={{
          background: "hsl(var(--primary-accent))",
          outline: "3px solid hsl(var(--border))",
          boxShadow:
            "-2px 2px 1px 0.5px hsl(var(--highlight)/60%) inset, 2px -2px 1px 0.5px color-mix(in oklch, hsl(var(--primary-accent)), black 25%) inset",
          left: indicatorStyle.left,
          width: indicatorStyle.width,
          top: "4px", // Offset to stay within container borders
          height: "calc(100% - 8px)", // Reduced height to fit container
        }}
        animate={{
          left: indicatorStyle.left,
          width: indicatorStyle.width,
        }}
        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
      />
    </div>
  );
});
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap px-6 py-3 text-base font-extrabold transition-all duration-200 flex-1 h-full relative z-30",
      "text-text-main/70 hover:text-text-main rounded-full",
      "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-outline focus-visible:ring-offset-2",
      "disabled:pointer-events-none disabled:opacity-60",
      "data-[state=active]:text-white",
      "data-[state=active]:[text-shadow:0.5px_0.5px_0_rgba(0,0,0,0.3),-0.5px_0.5px_0_rgba(0,0,0,0.3),0.5px_-0.5px_0_rgba(0,0,0,0.2),-0.5px_-0.5px_0_rgba(0,0,0,0.2)]",
      className,
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-6 ring-offset-background focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-outline focus-visible:ring-offset-2",
      className,
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
