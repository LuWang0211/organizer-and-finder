import { Bubble } from "@/ui/components/bubble";

interface ItemsListProps {
    items?: { id: number; name: string; quantity: number | null; inotherobject: boolean | null; otherobjectid: number | null }[];
    className?: string;
    locationName?: string;
}

export default function ItemsList({ className, items = [], locationName = "" }: ItemsListProps) {
  const hasItems = items.length > 0;

  if (!hasItems) {
    return (
      <div className={className}>
        <div className="px-2 py-3">
          <div className="text-center py-8">
            <Bubble variant="default" className="inline-block">
              <p className="text-gray-600 text-lg">No item found for this location.</p>
            </Bubble>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="px-2 py-3">
        <div className="flex flex-wrap gap-4 justify-start pointer-events-auto">
          {items.map((item) => (
            <Bubble
              key={item.id}
              variant="default"
              size="sm"
              className="min-w-[220px] !bg-pink-400/20 !border-pink-300/50"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-800 text-lg mb-1 truncate">{item.name}</h3>
                  <div className="text-base text-gray-600 flex items-center gap-2">
                    <span className="opacity-70">ID: {item.id}</span>
                    {item.otherobjectid !== null && (
                      <span className="opacity-70">Ref: {item.otherobjectid}</span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  {item.quantity !== null && (
                    <span className="bg-white/60 text-gray-800 px-2 py-0.5 rounded text-base font-semibold">x{item.quantity}</span>
                  )}
                  {item.inotherobject && (
                    <span className="text-sm px-2 py-0.5 rounded-full bg-pink-500/20 text-gray-600 border border-pink-400/40">In another object</span>
                  )}
                </div>
              </div>
            </Bubble>
          ))}
        </div>
      </div>
    </div>
  );
}
