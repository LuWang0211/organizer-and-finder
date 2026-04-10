"use client";

import { cn } from "@/utils/tailwind";
import { Icon } from "../Icon";

export function IconPickerPager({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  const isFirstPage = currentPage === 0;
  const isLastPage = currentPage === totalPages - 1;

  return (
    <div
      className={cn("flex items-center justify-center gap-3", {
        hidden: totalPages <= 1,
      })}
    >
      <button
        type="button"
        onClick={() => onPageChange(Math.max(0, currentPage - 1))}
        disabled={isFirstPage}
        className={cn(
          "relative flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300",
          {
            "cursor-not-allowed": isFirstPage,
          },
        )}
      >
        <Icon
          iconKey="arrow-left"
          size="sm"
          variant={isFirstPage ? "default" : "highlight"}
        />
      </button>

      <div className="flex gap-2">
        {Array.from({ length: totalPages }).map((_, i) => {
          const isCurrentPage = i === currentPage;

          return (
            <button
              key={`page-${i + 1}`}
              type="button"
              onClick={() => onPageChange(i)}
              className={cn(
                "h-3 rounded-full transition-all duration-300 icon-grad-highlight",
                isCurrentPage
                  ? "w-8 border border-highlight"
                  : "w-3 hover:icon-grad-primary-accent cursor-pointer",
              )}
              aria-label={`Page ${i + 1}`}
            />
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => onPageChange(Math.min(totalPages - 1, currentPage + 1))}
        disabled={isLastPage}
        className={cn(
          "relative flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 group",
          {
            "cursor-not-allowed": isLastPage,
          },
        )}
      >
        <Icon
          iconKey="arrow-right"
          size="sm"
          variant={isLastPage ? "default" : "highlight"}
        />
      </button>
    </div>
  );
}
