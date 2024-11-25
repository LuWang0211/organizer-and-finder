"use client";

import { useRouter } from "next/navigation";
import {  useMount, useSearchParam } from "react-use";

interface RedirectHelperProps {
    isLogged: boolean;
}

/* This component is used to redirect the user to the page they were trying to access before logging in.
 It works in conjunction with the "redirect" query parameter and the /login page.
 it is not supposed to be used in any other context.
 */
export default function RedirectHelper({ isLogged }: RedirectHelperProps) {
    const redirect = useSearchParam("redirect");
    const router = useRouter();

    const redirectValue = window.localStorage.getItem("redirect");

    useMount(() => {
        if (!isLogged && redirect) {
            window.localStorage.setItem("redirect", redirect);
            return;
        }
        if (isLogged && redirectValue) {
            window.localStorage.removeItem("redirect");
            router.push(redirectValue);
        }
    });

    if (isLogged && redirectValue) {
        return <div className="absolute top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-4 rounded-lg text-black">
                <h1 className="text-center">{`Redirecting to ${redirectValue}...`}</h1>
            </div>
        </div>;
    }
    return null;
}