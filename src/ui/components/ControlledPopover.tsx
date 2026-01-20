"use client";

import * as React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/ui/components/Popover";

import { cn } from "@/utils/tailwind";

export interface ControlledPopoverRef {
  show: (message: string, duration?: number) => void;
}

interface ControlledPopoverProps
  extends Pick<
    React.ComponentProps<typeof PopoverContent>,
    "side" | "align" | "sideOffset" | "variant"
  > {
  children: React.ReactElement;
  className?: string;
}

export const ControlledPopover = React.forwardRef<
  ControlledPopoverRef,
  ControlledPopoverProps
>(
  (
    {
      children,
      side = "top",
      align = "center",
      sideOffset = 4,
      variant = "default",
      className,
    },
    ref,
  ) => {
    const [open, setOpen] = React.useState(false);
    const [message, setMessage] = React.useState("");

    React.useImperativeHandle(
      ref,
      () => ({
        show: (msg: string, duration = 1600) => {
          setTimeout(() => {
            setMessage(msg);
            setOpen(true);
            setTimeout(() => {
              setOpen(false);
            }, duration);
          }, 0);
        },
      }),
      [],
    );

    return (
      <Popover open={open}>
        <PopoverTrigger asChild>{children}</PopoverTrigger>
        <PopoverContent
          side={side}
          align={align}
          sideOffset={sideOffset}
          variant={variant}
          className={cn("w-auto", className)}
          onPointerDownOutside={(e) => e.preventDefault()}
          onFocusOutside={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
        >
          {message}
        </PopoverContent>
      </Popover>
    );
  },
);

ControlledPopover.displayName = "ControlledPopover";
