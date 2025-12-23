"use client";
import React, { useId, useState } from "react";
import { Button } from "@/ui/components/Button";
import FeedbackOverlay, {
  type OverlayStatus,
} from "@/ui/components/FeedbackOverlay/FeedbackOverlay";

export default function OverlayShowcaseClient() {
  const [status, setStatus] = useState<OverlayStatus>(null);
  const [msg, setMsg] = useState<string>("Validation failed: Name is required");
  const [successMsg, setSuccessMsg] = useState<string>("Added successfully!");
  const successMessageId = useId();
  const errorMessageId = useId();

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 p-6">
      <h1 className="text-2xl font-extrabold">Overlay Showcase</h1>
      <div className="flex gap-3 items-center">
        <Button
          className="w-60 whitespace-nowrap"
          variant="primary"
          onClick={() => setStatus("success")}
        >
          Play Success
        </Button>
        <Button
          className="w-60 whitespace-nowrap"
          variant="secondary"
          onClick={() => setStatus("error")}
        >
          Play Error
        </Button>
      </div>
      <div className="flex items-center gap-2 w-full max-w-3xl">
        <label htmlFor={successMessageId} className="min-w-16 text-right">
          Success Message
        </label>
        <input
          id={successMessageId}
          className="flex-1 p-3 rounded-xl border-4 border-border bg-card text-text-main outline-none"
          value={successMsg}
          onChange={(e) => setSuccessMsg(e.target.value)}
        />
      </div>
      <div className="flex items-center gap-9 w-full max-w-3xl">
        <label htmlFor={errorMessageId} className="min-w-16 text-right">
          Error Message
        </label>
        <input
          id={errorMessageId}
          className="flex-1 p-3 rounded-xl border-4 border-border bg-card text-text-main outline-none"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
        />
      </div>
      <FeedbackOverlay
        status={status}
        message={status === "error" ? msg : undefined}
        successMessage={successMsg}
        onDone={() => setStatus(null)}
        durationMs={status === "success" ? 1400 : 2000}
      />
    </div>
  );
}
