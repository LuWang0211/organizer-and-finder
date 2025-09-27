import { Bubble } from "@/ui/components/bubble";
import { cn } from "@/utils/tailwind";
import Link from 'next/link'
import { Icon } from '@/ui/components/icon'
interface ItemsListProps {
    items?: { id: number; name: string; quantity: number | null; inotherobject: boolean | null; otherobjectid: number | null, iconKey?: string | null }[];
    className?: string;
    locationId?: string;
}

export default function ItemsList({ className, items = [], locationId }: ItemsListProps) {
  const hasItems = items.length > 0;

  if (!hasItems) {
    return (
      <div className={cn("pointer-events-auto", className)}>
        <div className="grid grid-cols-3 gap-4 px-5 py-3">
            <Link className="pointer-events-auto" href={`/add_item${locationId ? `?locationId=${encodeURIComponent(locationId)}` : ''}`}>
              <Bubble
                variant="default"
                size="sm"
                className="flex items-center justify-center !bg-orange-400/20 !border-orange-300/50 cursor-pointer"
              >
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2">
                     <Icon variant="default" size="tiny" iconKey="file-plus-2" />
                    <h3 className="font-semibold text-gray-800 text-lg">Create the first item</h3>
                  </div>
                  <p className="text-base text-gray-600">No items found for this location.</p>
                </div>
              </Bubble>
            </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("px-5 py-3", className)}>
      <div className="grid grid-cols-3 gap-4 pointer-events-auto">
        {items.map((item) => {
          return (
          <Bubble
            key={item.id}
            variant="default"
            size="sm"
            className="min-w-[220px] !bg-pink-400/20 !border-pink-300/50"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <Icon variant="default" size="tiny" iconKey={item.iconKey as any || 'file-question-mark'} />
                  <h3 className="font-semibold text-gray-800 text-lg mb-1 truncate">{item.name}</h3>
                </div>
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
        )})}

        {/* Add Item link as the last grid item */}
        <Link className="pointer-events-auto" href={`/add_item${locationId ? `?locationId=${encodeURIComponent(locationId)}` : ''}`}>
          <Bubble
            variant="default"
            size="sm"
            className="min-w-[220px] !bg-orange-400/20 !border-orange-300/50 cursor-pointer"
          >
            <div className="text-center">
              <div className="flex items-center justify-center gap-2">
                <Icon variant="default" size="tiny" iconKey="file-plus-2" />
                <h3 className="font-semibold text-gray-800 text-lg">Add Item</h3>
              </div>
              <p className="text-base text-gray-600">Create a new item</p>
            </div>
          </Bubble>
        </Link>
      </div>
    </div>
  );
}


