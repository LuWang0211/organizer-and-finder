import { cn } from "@/utils/tailwind";
import { Bubble } from "@/ui/components/bubble";
import Tooltip from "@/ui/components/tooltip";
import LinkWithReport from "./LinkWithReport";
import Link from 'next/link'
import { Icon } from '@/ui/components/icon'

type LocationItem = {
  id: number;
  name: string;
  quantity: number | null;
  iconKey?: string | null;
};

function ItemsPreview({ items }: { items?: LocationItem[] }) {
  if (items && items.length > 0) {
    return (
      <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
        {items.slice(0, 4).map((item, index) => {
          return (
          <div key={index} className="grid grid-cols-[auto_1fr_auto] items-center gap-x-2 gap-y-1 text-base leading-snug">
            <span className="min-w-0 break-words">{item.name}</span>
            {item.quantity && (
              <span className="justify-self-end bg-white/20 px-1 rounded text-base whitespace-nowrap flex-shrink-0">{item.quantity}</span>
            )}
          </div>
        )})}
        {items.length > 4 && (
          <p className="text-base text-white/70 italic">+{items.length - 4} more</p>
        )}
      </div>
    );
  }
  return <p className="text-base text-white/70 italic">No items</p>;
}

interface LocationsListProps {
    roomId: string;
    locations: { 
        id: string;
        name: string;
        iconKey?: string | null;
        items: { 
          id: number;
          name: string;
          quantity: number | null;
          inotherobject: boolean | null;
          otherobjectid: number | null;
          iconKey?: string | null;
        }[];
      }[]; 
    className?: string;
    loading: boolean;
}

export default function LocationsList({ className, locations, roomId }: LocationsListProps) {
  const hasLocations = Boolean(locations && locations.length > 0);

  if (!hasLocations) {
    return (
      <div className={cn("pointer-events-auto", className)}>
        <div className="grid grid-cols-3 gap-4 px-5 py-3">
            <Link className="pointer-events-auto" href={`/add_location?roomId=${encodeURIComponent(roomId)}`}>
              <Bubble
                variant="default"
                size="sm"
                className="flex items-center justify-center cursor-pointer !bg-orange-400/20 !border-orange-300/50 "
              >
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Icon variant="secondary" size="tiny" iconKey="plus" />
                    <h3 className="font-semibold text-gray-800 text-lg">Create the first Location</h3>
                  </div>
                  <p className="text-base text-gray-600">No locations found in this room.</p>
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
        {locations.map((location) => {
          return (
          <Tooltip
            key={location.id}
            position="bottom"
            arrow
            arrowClassName="bg-[color-mix(in_oklch,hsl(var(--primary-accent)),transparent_65%)] border border-[color-mix(in_oklch,hsl(var(--primary-accent)),transparent_30%)]"
            content={
              <Bubble
                variant="primary"
                size="sm"
                className="inline-block w-auto min-w-[260px] max-w-[640px] whitespace-normal break-words"
              >
                <div className="text-white flex">
                  {/* Left side - Location info */}
                  <div className="w-1/2 pr-2 min-w-0">
                    <p className="text-base text-white/90 break-words leading-snug">ID: {location.id}</p>
                    <p className="text-base text-white/90 break-words leading-snug">Total: {location.items?.length || 0} items</p>
                  </div>
                  {/* Right side - Items list */}
                  <div className="w-1/2 pl-2 border-l border-white/20 min-w-0">
                    <p className="font-medium text-base mb-1">Items:</p>
                    <ItemsPreview items={location.items as LocationItem[] | undefined} />
                  </div>
                </div>
              </Bubble>
            }
          >
            <LinkWithReport roomId={roomId} locationId={location.id} locationName={location.name}>
              <Bubble
                variant="secondary"
                size="sm"
                className="cursor-pointer min-w-[150px] hover:scale-105 transition-transform duration-200"
              >
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Icon variant="secondary" size="tiny" iconKey={location.iconKey as any || 'map-pin'} />
                    <h3 className="font-semibold text-gray-800 text-lg mb-1">{location.name}</h3>
                  </div>
                  <p className="text-base text-gray-600">{location.items?.length || 0} items</p>
                </div>
              </Bubble>
            </LinkWithReport>
          </Tooltip>
        )})}

        {/* Add Location link as the last grid item */}
        <div className="relative inline-block group">
          <Link className="py-3 px-5 text-gray-900 wrap-anywhere min-w-[150px]" href={`/add_location?roomId=${encodeURIComponent(roomId)}`}>
            <Bubble
              variant="secondary"
              size="sm"
              className="cursor-pointer min-w-[150px] !bg-orange-400/20 !border-orange-300/50 "
            >
              <div className="text-center">
                <div className="flex items-center justify-center gap-2">
                  <Icon variant="secondary" size="tiny" iconKey="plus" />
                  <h3 className="font-semibold text-gray-800 text-lg mb-1">Add Location</h3>
                </div>
                <p className="text-base text-gray-600">Create a new location</p>
              </div>
            </Bubble>
          </Link>
        </div>
      </div>
    </div>
  );
}



