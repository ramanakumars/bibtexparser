import { createContext } from "react";
import Record from "../parser/Record";

export const bibContext = createContext<Records>({ records: [], setRecords: () => {} });

export interface Records {
    records: Record[];
    setRecords: React.Dispatch<React.SetStateAction<Record[]>>;
}