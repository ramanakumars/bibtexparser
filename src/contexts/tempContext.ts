import { createContext } from "react";


export const tempContext = createContext<Templates>({ templates: [], setTemplates: () => {} });

export interface Template {
    name: string;
}

export interface Templates {
    templates: Template[];
    setTemplates: React.Dispatch<React.SetStateAction<Template[]>>;
}