"use client";

import { redirect, usePathname, useRouter } from "next/navigation";
import { useMount } from "react-use";
import { useState, useEffect } from "react";

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
    
    // Hydration-safe pattern: Prevent server/client HTML mismatch
    // - redirectValue starts as null on both server and client
    // - isClient starts as false to match server render (no window access)
    const [redirectValue, setRedirectValue] = useState<string | null>(null);
    const [isClient, setIsClient] = useState(false);

    // On mount (client-side only), set isClient=true and load from localStorage
    // This ensures server renders null, then client updates after hydration
    useMount(() => {
        setIsClient(true);
        const stored = localStorage.getItem("redirect");
        setRedirectValue(stored);
    });

    // Handle redirect logic only after client hydration is complete
    useEffect(() => {
        if (isClient && isLogged && redirectValue) {
            localStorage.removeItem("redirect");
            router.push(redirectValue);
        }
    }, [isClient, isLogged, redirectValue, router]);

    // Return null during SSR to match initial client render
    // This prevents hydration mismatch errors
    if (!isClient) {
        return null;
    }

    // Only show redirect UI after client hydration when conditions are met
    if (isLogged && redirectValue) {
        return <div className="absolute top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-4 rounded-lg text-black">
                <h1 className="text-center">{`Redirecting to ${redirectValue}...`}</h1>
            </div>
        </div>;
    }
    
    return null;
}