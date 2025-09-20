import React from "react";

interface EditableProps {
    value: string;
    setValue: (text: string) => void;
    className: string;
}

const Editable: React.FC<EditableProps> = ({ value, setValue, className }) => {
    const updateValue = (e: any) => {
        setValue(e.target.textContent ? e.target.textContent : "");
    };
    return (
        <span
            contentEditable="true"
            suppressContentEditableWarning={true}
            className={className}
            onBlur={(e) => updateValue(e)}
            onKeyDownCapture={(e) => e.key === "Enter" && updateValue(e)}
            autoFocus
        >
            {value}
        </span>
    );
};

export default Editable;
