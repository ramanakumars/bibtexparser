import { createContext } from "react";
import { Entry } from "../parser/parser";

export const bibContext = createContext<Entries>({
    entries: [],
    setEntries: () => {},
});

export interface Entries {
    entries: Entry[];
    setEntries: React.Dispatch<React.SetStateAction<Entry[]>>;
}

