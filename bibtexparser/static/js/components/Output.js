import React from "react";

export default function Output(props) {
    return (
        <section id="output" className="main-container">
            <h1>Output: </h1>
            <>
                {
                    !props.error ?
                        <div id="parse-output-container">
                            <code id="output-text">
                                {props.text}
                            </code>
                        </div>
                        :
                        <div id="error-output-container">
                            <code id="error-output-text">
                                {props.text}
                            </code>
                        </div>
                }
            </>
        </section>
    )
}