"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Card } from "@/ui/components/Card";
import { CardArrow } from "@/ui/components/CardArrow";
import { SearchBar } from "@/ui/components/SearchBar";

type SearchKind = "default" | "compact";

type PopupState = {
  kind: "success" | "error";
  message: string;
  searchKind: SearchKind;
} | null;

function SearchHintTooltip({ popup }: { popup: PopupState }) {
  if (!popup) return null;

  return (
    <output
      className="absolute left-1/2 top-0 z-20 -translate-x-1/2 -translate-y-full pointer-events-none"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="relative group tooltip-card-content">
        <Card
          variant={popup.kind === "success" ? "default" : "primary"}
          noInnerShadow
          shadowIntensity="weakened"
          className="p-4 peer border-3 card-content w-auto min-w-[220px] max-w-sm"
        >
          <div className="flex flex-col gap-1">
            <p
              className={
                popup.kind === "success"
                  ? "font-bold leading-tight text-foreground"
                  : "font-bold leading-tight text-white"
              }
            >
              {popup.kind === "success" ? "Search Ready" : "Search Needed"}
            </p>
            <p
              className={
                popup.kind === "success"
                  ? "leading-tight text-foreground-secondary"
                  : "leading-tight text-white/80"
              }
            >
              {popup.message}
            </p>
          </div>
        </Card>
        <CardArrow
          className="absolute left-1/2 top-full z-20 -translate-x-1/2 -translate-y-[10px]"
          fillColor={
            popup.kind === "success"
              ? "var(--color-card-default)"
              : "var(--color-primary-accent)"
          }
        />
      </div>
    </output>
  );
}

export default function SearchBarShowcaseClient() {
  const [popup, setPopup] = useState<PopupState>(null);
  const popupTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const defaultSearchId = useId();
  const compactSearchId = useId();

  useEffect(() => {
    return () => {
      if (popupTimerRef.current) {
        clearTimeout(popupTimerRef.current);
      }
    };
  }, []);

  const showPopup = (nextPopup: PopupState) => {
    setPopup(nextPopup);
    if (popupTimerRef.current) {
      clearTimeout(popupTimerRef.current);
    }
    popupTimerRef.current = setTimeout(() => {
      setPopup(null);
      popupTimerRef.current = null;
    }, 2200);
  };

  const handleSearch = (
    searchKind: SearchKind,
    label: string,
    value: string,
  ) => {
    const trimmed = value.trim();

    if (!trimmed) {
      showPopup({
        kind: "error",
        message: `${label}: please type something first.`,
        searchKind,
      });
      return;
    }

    showPopup({
      kind: "success",
      message: `Fake search for "${trimmed}" is ready.`,
      searchKind,
    });
  };

  return (
    <div className="w-full max-w-4xl flex flex-col items-center gap-10">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold">Search Bar</h1>
        <p className="text-sm text-foreground/70 max-w-xl">
          This is a UI showcase only. Clicking search shows a fake popup instead
          of running a real query.
        </p>
      </div>

      <section className="w-full flex flex-col items-center gap-10">
        <div className="relative flex flex-col gap-4 items-center w-full">
          <label
            htmlFor={defaultSearchId}
            className="text-lg font-semibold text-foreground/80"
          >
            Default
          </label>
          <div className="relative">
            <SearchHintTooltip
              popup={popup?.searchKind === "default" ? popup : null}
            />
            <SearchBar
              id={defaultSearchId}
              placeholder="Default search bar..."
              onSearch={(value) =>
                handleSearch("default", "Default search", value)
              }
            />
          </div>
        </div>

        <div className="relative flex flex-col gap-4 items-center w-full">
          <label
            htmlFor={compactSearchId}
            className="text-lg font-semibold text-foreground/80"
          >
            Compact
          </label>
          <div className="relative">
            <SearchHintTooltip
              popup={popup?.searchKind === "compact" ? popup : null}
            />
            <SearchBar
              id={compactSearchId}
              variant="compact"
              placeholder="Compact search bar..."
              onSearch={(value) =>
                handleSearch("compact", "Compact search", value)
              }
            />
          </div>
        </div>
      </section>
    </div>
  );
}
