import React, { useState } from "react";
import Editable from "./Editable";
import "../css/edit.css";

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
            <>
                <div
                    className="edit-form-background"
                    onClick={() => setEditable(false)}
                ></div>
                <div className="edit-form">
                    <Editable
                        value={text}
                        setValue={_setText}
                        className={className}
                    />
                    <button onClick={() => setText(text)}>Update!</button>
                </div>
            </>
        );
    } else {
        return null;
    }
};

export default EditForm;
