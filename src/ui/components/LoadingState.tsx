export function LoadingState({ className }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center py-8 ${className ?? ""}`}>
      <div className="animate-spin w-8 h-8 border-4 border-cyan-400 border-t-transparent rounded-full" />
    </div>
  );
}
