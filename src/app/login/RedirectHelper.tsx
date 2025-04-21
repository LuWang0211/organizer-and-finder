"use client";

import { redirect, usePathname, useRouter } from "next/navigation";
import {  useMount } from "react-use";

interface RedirectHelperProps {
    isLogged: boolean;
}

/**
 * Remembers the current page URL before redirecting the user to the login page.
 * @returns {null}
 */
export function PreLoginHelper(): null {
    const currentPathname = usePathname();

    useMount(() => {
        window.localStorage.setItem("redirect", currentPathname);
        redirect("/login");
    });

    return null;
}

/* This component is used to redirect the user to the page they were trying to access before logging in.
 It works in conjunction with the "redirect" query parameter and the /login page.
 it is not supposed to be used in any other context.
 */
export default function RedirectHelper({ isLogged }: RedirectHelperProps) {
    const router = useRouter();

    const redirectValue = window.localStorage.getItem("redirect");

    useMount(() => {
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