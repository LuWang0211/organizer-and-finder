// src/app/house_layout/[room]/[container]/page.tsx
import Container from "./container";
export default async function ContainerPage({ params }: { params: { container: number } }) {
    // console.log("params in [container] page:", params);

    return (
        <Container containerId={params.container}/>
    );
}
