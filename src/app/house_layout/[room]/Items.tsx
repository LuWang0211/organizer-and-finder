import { cn } from "@/utils/tailwind";

interface ItemsListProps {
    className?: string;
}

export default function ItemsList({ className }: ItemsListProps) {
    return <div className={cn(" bg-blue-500 opacity-60", className)} />;
}