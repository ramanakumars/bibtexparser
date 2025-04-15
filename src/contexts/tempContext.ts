import { createContext } from "react";
import { Template } from "../parser/template";


export const tempContext = createContext<Templates>({ templates: [], setTemplates: () => {} });


export interface Templates {
    templates: Template[];
    setTemplates: React.Dispatch<React.SetStateAction<Template[]>>;
}