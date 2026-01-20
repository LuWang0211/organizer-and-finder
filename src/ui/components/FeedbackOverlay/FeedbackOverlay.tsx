"use client";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Card, CardDescription } from "@/ui/components/Card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/ui/components/Dialog";
import { feedbackGameManager } from "./feedbackGame";

export type OverlayStatus = "success" | "error";

export interface FeedbackOverlayRef {
  open: (options?: { message?: string }) => Promise<void>;
  playAnimation: (
    status: OverlayStatus,
    options?: { durationMs?: number },
  ) => Promise<void>;
  close: () => void;
}

export type FeedbackOverlayProps = NonNullable<unknown>;

const DEFAULT_WIDTH_PX = 560;
const DEFAULT_HEIGHT_PX = 240;
const DEFAULT_DURATION_MS = 2400;

const FeedbackOverlay = forwardRef<FeedbackOverlayRef, FeedbackOverlayProps>(
  (_, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const [status, setStatus] = useState<OverlayStatus | null>(null);
    const [message, setMessage] = useState<string | undefined>(undefined);

    const [containerEl, setContainerEl] = useState<HTMLDivElement | null>(null);

    // Create a single promise that handles the game initialization
    const resolveInitRef = useRef<() => void>(null);
    const initPromise = React.useMemo(
      () =>
        new Promise<void>((resolve) => {
          resolveInitRef.current = resolve;
        }),
      [],
    );

    const close = React.useCallback(() => {
      setIsOpen(false);
      setStatus(null);
      setMessage(undefined);
    }, []);

    const open = React.useCallback(
      async (options?: { message?: string }) => {
        setMessage(options?.message);
        setIsOpen(true);
        // Wait for the game to be fully initialized before returning
        await initPromise;
      },
      [initPromise],
    );

    const playAnimation = React.useCallback(
      async (newStatus: OverlayStatus, options?: { durationMs?: number }) => {
        setStatus(newStatus);
        const duration = options?.durationMs ?? DEFAULT_DURATION_MS;
        await feedbackGameManager.playAnimation(newStatus, duration);
      },
      [],
    );

    useImperativeHandle(
      ref,
      () => ({
        open,
        playAnimation,
        close,
      }),
      [open, playAnimation, close],
    );

    // Initialize game as soon as the container is ready
    useEffect(() => {
      if (!containerEl) return;

      let cancelled = false;

      (async () => {
        await feedbackGameManager.initialize(
          containerEl,
          DEFAULT_WIDTH_PX,
          DEFAULT_HEIGHT_PX,
        );
        if (!cancelled) {
          resolveInitRef.current?.();
        }
      })();

      return () => {
        cancelled = true;
      };
    }, [containerEl]);

    const displayMessage = message;

    return (
      <Dialog open={isOpen} modal={true}>
        <DialogContent
          className="max-w-none w-auto p-0 border-none bg-transparent shadow-none [&>button]:hidden"
          overlayClassName="bg-transparent"
          onPointerDownOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <DialogTitle className="sr-only">Feedback</DialogTitle>
          <DialogDescription className="sr-only">
            Status: {status}
          </DialogDescription>
          <div
            className="relative max-w-[90vw]"
            style={{ width: DEFAULT_WIDTH_PX }}
          >
            <Card
              className="w-full p-0 overflow-hidden"
              style={{ height: DEFAULT_HEIGHT_PX }}
            >
              <div ref={setContainerEl} className="w-full h-full relative">
                <div className="absolute inset-x-0 bottom-2 flex justify-center pointer-events-none">
                  <CardDescription className="text-[20px] font-extrabold text-text-main">
                    {displayMessage}
                  </CardDescription>
                </div>
              </div>
            </Card>
          </div>
        </DialogContent>
      </Dialog>
    );
  },
);

FeedbackOverlay.displayName = "FeedbackOverlay";

export default FeedbackOverlay;
