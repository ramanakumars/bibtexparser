import React from "react";

interface PopupContainerProps {
    onClick: (e: any) => void;
    children: React.ReactNode;
}

const PopupContainer: React.FC<PopupContainerProps> = ({
    onClick,
    children,
}) => {
    return (
        <>
            <div className="upload-background" onClick={onClick}>
                &nbsp;
            </div>
            <div className="upload-container">{children}</div>
        </>
    );
};

export default PopupContainer;
