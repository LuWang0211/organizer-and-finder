import { signIn, signOut, getSession, SessionType } from "@/auth"
import dynamic from "next/dynamic";

const RedirectHelper = dynamic(
    () => import('@/app/login/RedirectHelper'),
    { ssr: false }
  );

export async function CurrentLoginParty({session}: {session: SessionType}) {
    const { dbUser } = session;

    if (dbUser.accountProvider === "microsoft-entra-id") {
        return (
            <div className={"col-span-2 flex items-center justify-center"}>
                Logged in with Microsoft: {dbUser.email}
            </div>
        );
    }

    return null;
}

export default async function Login() {
    const session  = (await getSession());

    const isLogged = session && ("dbUser" in session) ;

    return (
        <div className=" w-full h-full flex items-center justify-center">
            <div className=" w-1/3 h-1/3 grid grid-cols-2 gap-2 [&_label]:flex [&_label]:items-center" 
                style={{ gridTemplateRows: "repeat(auto-fill, 40px)"}}>
                <h1 className="col-span-2 text-center">Login</h1>

                { !isLogged && <form className="col-span-2 flex justify-center" action={async () => {
                    "use server"
                    await signIn("microsoft-entra-id", {
                        redirectTo: "/login",
                    })
                }}>
                    <div className={"col-span-2 flex items-center justify-center"}>
                        <button className="col-span-2">Login with Microsoft</button>
                    </div>
                </form>}

                { isLogged && <CurrentLoginParty session={session!} />}

                {isLogged && <form className="col-span-2 flex justify-center" action={async () => {
                    "use server"
                    await signOut({
                        redirectTo: "/login",
                    })
                }}>
                    <button type="submit" className="col-span-2">Login out</button>
                </form>}
            </div>
            <RedirectHelper isLogged={isLogged ?? false} />
        </div>
    );
}