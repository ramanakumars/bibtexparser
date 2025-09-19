import React from "react";

interface EditableProps {
    value: string;
    setValue: (text: string) => void;
    className: string;
}

const Editable: React.FC<EditableProps> = ({ value, setValue, className }) => {
    return (
        <span
            contentEditable="true"
            suppressContentEditableWarning={true}
            className={className}
            onBlur={(e) => {
                const target = e.target as HTMLElement;
                setValue(target.textContent ? target.textContent : "");
            }}
            autoFocus
        >
            {value}
        </span>
    );
};

export default Editable;
