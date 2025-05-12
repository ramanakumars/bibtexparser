import { createContext } from "react";

export const errorContext = createContext<ErrorContext>({ error: "", setError: () => {} });

export interface ErrorContext {
    error: string;
    setError: (error: string) => void;
}

