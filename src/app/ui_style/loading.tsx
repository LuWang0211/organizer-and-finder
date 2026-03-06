import { LoadingState } from "@/ui/components/LoadingState";

export default function Loading() {
  return (
    <div className="flex-1 flex items-center justify-center h-full">
      <LoadingState />
    </div>
  );
}
