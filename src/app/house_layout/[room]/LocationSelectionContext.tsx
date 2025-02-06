"use client";

import React from "react";

interface LocationSelectionContextValueType {
    SelectedLocation: string | null;
    setSelectedLocation: (location: string) => void;

}

export const LocationSelectionContext = React.createContext<LocationSelectionContextValueType>({
    SelectedLocation: null,
    setSelectedLocation: () => {},
});

export default function LocationSelectionContextProvider({ children }: { children: React.ReactNode }) {
    const [SelectedLocation, setSelectedLocation] = React.useState<string | null>(null);

    return <LocationSelectionContext.Provider value={{ SelectedLocation, setSelectedLocation }} >
        {children}
    </LocationSelectionContext.Provider>;
}