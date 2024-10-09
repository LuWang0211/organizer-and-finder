import { cn } from "@/utils/tailwind";

interface ContainersListProps {
    roomName?: string;
    className?: string;
}

export default function ContainersList( { className, roomName }: ContainersListProps) {
    return <div className={cn(" bg-green-500 opacity-60", className)} >
        { roomName && <div>{decodeURI(roomName)} is now selected</div> }
        { !roomName && <div>No room is selected</div> }
    </div>;
}