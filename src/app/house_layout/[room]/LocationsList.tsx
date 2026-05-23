import Link from "next/link";
import type { LocationType } from "@/services/locationService";
import { Bubble } from "@/ui/components/Bubble";
import { Icon } from "@/ui/components/Icon";
import Tooltip from "@/ui/components/Tooltip";
import { cn } from "@/utils/tailwind";

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
        {items.slice(0, 4).map((item) => {
          return (
            <div
              key={item.id}
              className="flex items-start gap-2 text-base leading-snug text-gray-800"
            >
              <span className="min-w-0 flex-1 break-words">{item.name}</span>
              {item.quantity && (
                <span className="ml-auto inline-flex min-w-6 flex-shrink-0 items-center justify-center whitespace-nowrap rounded bg-gray-200/60 px-1.5 text-base tabular-nums leading-none text-right">
                  {item.quantity}
                </span>
              )}
            </div>
          );
        })}
        {items.length > 4 && (
          <p className="text-base text-gray-600 italic">
            +{items.length - 4} more
          </p>
        )}
      </div>
    );
  }
  return <p className="text-base text-gray-600 italic">No items</p>;
}

interface LocationsListProps {
  roomId: string;
  locations: Array<LocationType>;
  className?: string;
  loading: boolean;
}

export default function LocationsList({
  className,
  locations,
  roomId,
}: LocationsListProps) {
  const hasLocations = Boolean(locations && locations.length > 0);

  if (!hasLocations) {
    return (
      <div className={cn("pointer-events-auto", className)}>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4 px-5 py-3 sm:grid-cols-[repeat(auto-fill,minmax(240px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(260px,1fr))]">
          <Link
            className="pointer-events-auto"
            href={`/add_location?roomId=${encodeURIComponent(roomId)}`}
          >
            <Bubble
              variant="highlight"
              size="sm"
              className="flex items-center justify-center cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Icon
                  variant="default"
                  size="sm"
                  iconKey="plus"
                  className="border-2!"
                />
                <div className="flex flex-col text-left">
                  <h3 className="font-semibold text-gray-800 text-lg">
                    Create the first Location
                  </h3>
                  <p className="text-base text-gray-600">
                    No locations found in this room.
                  </p>
                </div>
              </div>
            </Bubble>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("px-5 py-3", className)}>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4 pointer-events-auto sm:grid-cols-[repeat(auto-fill,minmax(240px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(260px,1fr))]">
        {locations.map((location) => {
          return (
            <Tooltip
              key={location.id}
              position="bottom"
              variant="bubble"
              content={
                <div className="min-w-[220px] max-w-[360px] whitespace-normal break-words">
                  <ItemsPreview
                    items={location.items as LocationItem[] | undefined}
                  />
                </div>
              }
              className="block"
            >
              <Link
                className="text-gray-900 wrap-anywhere"
                href={`/house_layout/${roomId}/${location.id.replace(`${roomId}_`, "")}`}
              >
                <Bubble
                  variant="secondary"
                  size="sm"
                  className="min-w-[220px] cursor-pointer hover:scale-105 transition-transform duration-200"
                >
                  <div className="flex items-center gap-2">
                    <Icon
                      variant="default"
                      size="sm"
                      iconKey={location.iconKey || "map-pin"}
                      className="border-2!"
                    />
                    <div className="flex flex-col text-left min-w-0">
                      <h3 className="font-semibold text-gray-800 text-lg truncate">
                        {location.name}
                      </h3>
                      <p className="text-base text-gray-600">
                        {location.items?.length || 0} items
                      </p>
                    </div>
                  </div>
                </Bubble>
              </Link>
            </Tooltip>
          );
        })}

        {/* Add Location link as the last grid item */}
        <div className="relative block group">
          <Link
            className="block text-gray-900 wrap-anywhere"
            href={`/add_location?roomId=${encodeURIComponent(roomId)}`}
          >
            <Bubble variant="highlight" size="sm" className="cursor-pointer">
              <div className="flex items-center gap-2">
                <Icon
                  variant="default"
                  size="sm"
                  iconKey="plus"
                  className="border-2!"
                />
                <div className="flex flex-col text-left">
                  <h3 className="font-semibold text-gray-800 text-lg">
                    Add Location
                  </h3>
                  <p className="text-base text-gray-600">
                    Create a new location
                  </p>
                </div>
              </div>
            </Bubble>
          </Link>
        </div>
      </div>
    </div>
  );
}
