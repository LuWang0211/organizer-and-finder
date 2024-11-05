import { cn } from "@/utils/tailwind";

interface ItemsListProps {
    containerName?: string;
    items?: { id: number; name: string; quantity: number; inotherobject: Boolean, otherobjectid: number}[];
    className?: string;
    loading: boolean;
}

export default function ItemsList({ className, containerName, items = [], loading }: ItemsListProps) {
    if (loading) return <div>Loading items...</div>;

    return <div className={cn(" bg-gray-500 opacity-40", className)}>
        

        {/* Container Name as Header */}
        {containerName ? (
            <div className="text-center text-2xl font-bold mb-4 text-white-400">
                {containerName} is now selected
            </div>
        ) : (
            <div className="text-center text-2xl font-bold mb-4 text-white-400">No Container is selected</div>
        )}

        <div className="text-center text-gray-500">
            <table className="w-full bg-white shadow-lg rounded-lg">
                <thead className="bg-gray-800 text-white">
                    <tr>
                        <th className="py-2 px-4">ID</th>
                        <th className="py-2 px-4">Name</th>
                        <th className="py-2 px-4">Quantity</th>
                        <th className="py-2 px-4">inotherobject</th>
                        <th className="py-2 px-4">otherobjectid</th>
                    </tr>
                </thead>

                <tbody>
                    {items.length > 0 ? (
                        items.map(item => (
                            <tr key={item.id} className="hover:bg-tan-50 cursor-pointer">
                                <td className="py-2 px-4 text-center">{item.id}</td>
                                <td className="py-2 px-4 text-center">{item.name}</td>
                                <td className="py-2 px-4 text-center">{item.quantity}</td>
                                <td className="py-2 px-4 text-center">{item.inotherobject.toString()}</td>
                                <td className="py-2 px-4 text-center">{item.otherobjectid}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={5} className="py-4 text-center text-gray-500">No item found for this container.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    </div>;
}