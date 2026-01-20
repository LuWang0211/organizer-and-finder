"use client";
import React, { useEffect, useRef, useState } from "react";
import { Card, CardDescription } from "@/ui/components/Card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/ui/components/Dialog";
import { feedbackGameManager } from "./feedbackGame";

export type OverlayStatus = "success" | "error" | null;

export interface FeedbackOverlayProps {
  status: OverlayStatus;
  message?: string;
  onDone: () => void;
  durationMs?: number;
  successMessage?: string;
  widthPx?: number;
  heightPx?: number;
}

export default function FeedbackOverlay({
  status,
  message,
  onDone,
  durationMs = 2400,
  successMessage,
  widthPx = 560,
  heightPx = 240,
}: FeedbackOverlayProps) {
  const [containerEl, setContainerEl] = useState<HTMLDivElement | null>(null);
  const [isGameReady, setIsGameReady] = useState(false);

  // Initialize game when container is ready and overlay is shown
  useEffect(() => {
    if (!containerEl || !status) return;

    let cancelled = false;

    (async () => {
      // Initialize the singleton game instance (or resize if already exists)
      await feedbackGameManager.initialize(containerEl, widthPx, heightPx);

      if (!cancelled) {
        setIsGameReady(true);
      }
    })();

    return () => {
      cancelled = true;
      setIsGameReady(false);
    };
  }, [status, widthPx, heightPx, containerEl]);

  // Play animation when game is ready and status changes
  useEffect(() => {
    if (!status || !isGameReady) return;

    feedbackGameManager.playAnimation(status, durationMs, onDone);
  }, [status, isGameReady, durationMs, onDone]);

  const displayMessage =
    status === "success"
      ? (successMessage ?? "Added successfully!")
      : message || "Something went wrong";

  return (
    <Dialog
      open={!!status}
      onOpenChange={(open) => !open && onDone()}
      modal={true}
    >
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
        <div className="relative max-w-[90vw]" style={{ width: widthPx }}>
          <Card
            className="w-full p-0 overflow-hidden"
            style={{ height: heightPx }}
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
}
