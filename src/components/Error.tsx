import React, { useState } from "react";
import { errorContext } from "../contexts/errorContext";
import '../css/error.css';

interface ErrorDisplayProps {
    children: React.ReactNode;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ children }) => {
    const [error, setError] = useState<string>("");

    return (
        <errorContext.Provider value={{ error: error, setError: setError }}>
            { error !== "" && 
                <>
                    <div className='error-background' onClick={() => setError("")}>&nbsp;</div>
                    <div className='error-container'>
                        { error }
                    </div>
                </>
            }
            { children }
        </errorContext.Provider>
    )
}

export default ErrorDisplay;
