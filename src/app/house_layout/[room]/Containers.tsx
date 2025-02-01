import { cn } from "@/utils/tailwind";
import LinkWithReport from "./LinkWithReport";

interface ContainersListProps {
    roomId: string;
    containers: { 
        id: number;
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

export default function ContainersList( { className, containers, roomId }: ContainersListProps) {
    // console.log("roomId in ContainersList:", roomId); 

    return <div className={cn(" bg-purple-100 opacity-60", className)} >
        <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse bg-white rounded-lg shadow-md text-left">
                <thead>
                    <tr className="bg-pink-200 text-pink-800 text-sm uppercase">
                        <th className="py-2 px-4 border-b border-pink-300">Container ID</th>
                        <th className="py-2 px-4 border-b border-pink-300">Container Name</th>
                        <th className="py-2 px-4 border-b border-pink-300">Items</th>
                    </tr>
                </thead>
                <tbody>
                    {containers && containers.length > 0 ? (
                        
                        containers.map((container) => (
                            <tr
                                key={container.id}
                                className="hover:bg-pink-100 cursor-pointer transition duration-200"
                            >
                                <td >
                                    <LinkWithReport roomId={roomId} containerId={container.id}  containerName={container.name} />
                                </td>
                                <td className="py-2 px-4 border-b border-pink-300 text-gray-900">{container.name}</td>
                                <td className="py-2 px-4 border-b border-pink-300 text-gray-900">
                                    <div className="text-xs text-gray-600">
                                    {container.items && container.items.length > 0 ? (
                                        <>
                                            {container.items.slice(0, 3).map((item, index) => (
                                                <span key={index}>
                                                    {item.name}
                                                    {index < 2 && index < container.items.length - 1 && ', '}
                                                </span>
                                            ))}
                                            {container.items.length > 3 && (
                                                <span className="text-gray-500"> + more</span>
                                            )}
                                        </>
                                    ) : (
                                        <span  className="text-xs text-gray-500">No items</span>
                                    )}
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={3} className="text-center py-4 text-pink-800">
                                No container found for this room.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    </div>;
}