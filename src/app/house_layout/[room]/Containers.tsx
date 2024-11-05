import { cn } from "@/utils/tailwind";
interface ContainersListProps {
    roomName?: string;
    // containers?: { id: number; name: string; items: string[] }[];
    containers?: { id: number; name: string; items: { id: number; name: string; quantity: number; inotherobject: boolean; otherobjectid: number }[] }[];
    className?: string;
    onSelectContainer: (containerId: number, containerName: string) => void; 
}

export default function ContainersList( { className, roomName, containers = [], onSelectContainer }: ContainersListProps) {

    return <div className={cn(" bg-purple-100 opacity-60", className)} >

        {/* Room Name as Header */}
        {roomName ? (
            <div className="text-center text-2xl font-bold mb-4 text-pink-600">
                {decodeURI(roomName)} is now selected
            </div>
        ) : (
            <div className="text-center text-lg text-gray-600 mb-4">No room is selected</div>
        )}


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
                    {containers.length > 0 ? ( // Now containers will default to an empty array
                        containers.map((container) => (
                            <tr
                                key={container.id}
                                className="hover:bg-pink-100 cursor-pointer transition duration-200"
                                onClick={() => onSelectContainer(container.id, container.name)}
                            >
                                <td className="py-2 px-4 border-b border-pink-300 text-gray-900">{container.id}</td>
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
                        // <div className="text-center text-pink-800">No containers found for this room.</div> // Fallback message when there are no containers
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