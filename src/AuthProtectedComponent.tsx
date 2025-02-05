import { redirect } from "next/navigation";
import { getSession } from "./auth";

interface AuthProtectedComponentProps { 
    route: string;
    children: React.ReactNode 
}


export default async function AuthProtectedComponent(
    { route, children }: AuthProtectedComponentProps)
{
    const session = await getSession();

    if (!session) {
        redirect(`/login${route ? `?redirect=${route}` : ""}`);
    }

    return <>{children}</>;
}