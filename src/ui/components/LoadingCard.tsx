import { cn } from "@/utils/tailwind";
import { Card, CardContent } from "./Card";

type LoadingCardProps = {
  label?: string;
  className?: string;
};

export default function LoadingCard({
  label = "Loading…",
  className,
}: LoadingCardProps) {
  return (
    <div
      className={cn(
        "w-full h-full flex items-center justify-center p-6",
        className,
      )}
    >
      <Card>
        <CardContent className="px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="h-6 w-6 md:h-8 md:w-8 shrink-0 border-4 border-pink-300 border-t-transparent rounded-full animate-spin " />
            <div className="text-base md:text-lg font-bold">{label}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
