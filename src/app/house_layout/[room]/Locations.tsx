import { cn } from "@/utils/tailwind";
import { Bubble } from "@/ui/components/bubble";
import LinkWithReport from "./LinkWithReport";

interface LocationsListProps {
    roomId: string;
    locations: { 
        id: string;
        name: string;
        items: { 
          id: number;
          name: string;
          quantity: number | null;
          inotherobject: boolean | null;
          otherobjectid: number | null;
        }[];
      }[]; 
    className?: string;
    loading: boolean;
}

export default function LocationsList( { className, locations, roomId }: LocationsListProps) {
    return (
        <div className={cn("rounded-2xl p-6", className)}>
            {locations && locations.length > 0 ? (
                <div className="flex flex-wrap gap-4 justify-start">
                    {locations.map((location) => (
                        <div
                            key={location.id}
                            className="relative group"
                        >
                            <Bubble 
                                variant="secondary" 
                                size="sm"
                                className="cursor-pointer min-w-[150px] hover:scale-105 transition-transform duration-200"
                            >
                                <div className="text-center">
                                    <h3 className="font-semibold text-gray-800 text-lg mb-1">
                                        {location.name}
                                    </h3>
                                    <p className="text-base text-gray-600">
                                        {location.items?.length || 0} items
                                    </p>
                                    <div className="mt-2">
                                        <LinkWithReport 
                                            roomId={roomId} 
                                            locationId={location.id}  
                                            locationName={location.name} 
                                        />
                                    </div>
                                </div>
                            </Bubble>

                            {/* CSS-only tooltip - positioned to the bottom */}
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                                <Bubble variant="primary" size="sm" className="inline-block w-auto min-w-[260px] max-w-[640px] whitespace-normal break-words">
                                    <div className="text-white flex">
                                        {/* Left side - Location info */}
                                        <div className="w-1/2 pr-2 min-w-0">
                                            <h4 className="font-bold text-lg mb-1 break-words leading-snug">{location.name}</h4>
                                            <p className="text-base text-white/90 break-words leading-snug">
                                                ID: {location.id}
                                            </p>
                                            <p className="text-base text-white/90 break-words leading-snug">
                                                Total: {location.items?.length || 0} items
                                            </p>
                                        </div>
                                        
                                        {/* Right side - Items list */}
                                        <div className="w-1/2 pl-2 border-l border-white/20 min-w-0">
                                            <p className="font-medium text-base mb-1">Items:</p>
                                            {location.items && location.items.length > 0 ? (
                                                <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
                                                    {location.items.slice(0, 4).map((item, index) => (
                                                        <div key={index} className="grid grid-cols-[1fr_auto] items-start gap-x-2 gap-y-1 text-base leading-snug">
                                                            <span className="min-w-0 break-words">{item.name}</span>
                                                            {item.quantity && (
                                                                <span className="justify-self-end bg-white/20 px-1 rounded text-base whitespace-nowrap flex-shrink-0">
                                                                    {item.quantity}
                                                                </span>
                                                            )}
                                                        </div>
                                                    ))}
                                                    {location.items.length > 4 && (
                                                        <p className="text-base text-white/70 italic">
                                                            +{location.items.length - 4} more
                                                        </p>
                                                    )}
                                                </div>
                                            ) : (
                                                <p className="text-base text-white/70 italic">No items</p>
                                            )}
                                        </div>
                                    </div>
                                </Bubble>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-8">
                    <Bubble variant="default" className="inline-block">
                        <p className="text-gray-600 text-lg">No locations found for this room.</p>
                    </Bubble>
                </div>
            )}
        </div>
    );
}
