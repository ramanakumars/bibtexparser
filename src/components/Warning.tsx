import React, { useState } from "react";
import "../css/error.css";
import { WarningIcon } from "./Icons";

interface WarningDisplayProps {
    warnings: string[];
}

const WarningDisplay: React.FC<WarningDisplayProps> = ({ warnings }) => {
    const [showWarning, setWarningVisibility] = useState<boolean>(false);

    if (warnings.length > 0) {
        return (
            <>
                <div
                    className="warning"
                    onClick={() => setWarningVisibility(true)}
                >
                    <WarningIcon /> {warnings.length} warnings
                </div>
                {showWarning && (
                    <>
                        <div
                            className="warning-background"
                            onClick={() => setWarningVisibility(false)}
                        ></div>
                        <div className="warning-container">
                            {warnings.map((warning, index) => (
                                <span key={`warning_${index}`}>{warning}</span>
                            ))}
                        </div>
                    </>
                )}
            </>
        );
    } else {
        return null;
    }
};

export default WarningDisplay;
