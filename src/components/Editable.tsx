import React, { useEffect, useState } from "react";
import { sanitize_latex } from "../parser/parser";

interface EditableProps {
    value: string;
    setValue: (text: string) => void;
    className: string;
};

const Editable: React.FC<EditableProps> = ({ value, setValue, className }) => {
    const [isEditable, setEditable] = useState(false);
    
    return (
        <>
        { !isEditable ? (
                <span onClick={() => setEditable(true)} className={className}>{value}</span>
            )
            :
            (
                <input type='text' onChange={(e) => setValue(sanitize_latex(e.target.value))} onBlur={() => setEditable(false)} onKeyDownCapture={(e) => e.key === "Enter"  && setEditable(false)} className={className} autoFocus value={value} />
            )
        }
        </>
    )
};

export default Editable;