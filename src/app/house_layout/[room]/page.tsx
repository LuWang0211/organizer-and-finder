import Containers from "./Containers";
import Items from "./Items";

export default function Page( { params: { room } }: { params: { room: string } }) {
    return <>
        <Containers roomName={ room } />
        <Items />
    </>;
}