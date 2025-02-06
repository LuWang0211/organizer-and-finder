import { getSession } from "./auth";
import { PreLoginHelper } from "./app/login/RedirectHelper";

interface AuthProtectedComponentProps { 
    children: React.ReactNode 
}


export default async function AuthProtectedComponent(
    { children }: AuthProtectedComponentProps)
{
    const session = await getSession();

    if (!session) {
        return <PreLoginHelper />
    }

    return <>{children}</>;
}