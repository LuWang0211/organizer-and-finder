"use client";

import React from "react";

interface ContainerSelectionContextValueType {
    selectedContainer: string | null;
    setSelectedContainer: (container: string) => void;

}

export const ContainerSelectionContext = React.createContext<ContainerSelectionContextValueType>({
    selectedContainer: null,
    setSelectedContainer: () => {},
});

export default function ContainerSelectionContextProvider({ children }: { children: React.ReactNode }) {
    const [selectedContainer, setSelectedContainer] = React.useState<string | null>(null);

    return <ContainerSelectionContext.Provider value={{ selectedContainer, setSelectedContainer }} >
        {children}
    </ContainerSelectionContext.Provider>;
}