import React, { useState } from "react";
import Editable from "./Editable";
import "../css/edit.css";
import PopupContainer from "./PopupContainer";

interface EditFormProps {
    input_text: string;
    setText: (text: string) => void;
    editable: boolean;
    setEditable: (editable: boolean) => void;
    className: string;
}

const EditForm: React.FC<EditFormProps> = ({
    input_text,
    setText,
    editable,
    setEditable,
    className,
}) => {
    const [text, _setText] = useState(input_text);

    if (editable) {
        return (
            <PopupContainer onClick={() => setEditable(false)}>
                <Editable
                    value={text}
                    setValue={_setText}
                    className={className}
                />
                <button onClick={() => setText(text)}>Update!</button>
            </PopupContainer>
        );
    } else {
        return null;
    }
};

export default EditForm;
