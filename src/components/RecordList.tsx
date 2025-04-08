import React, { useContext } from "react";
import Record from "../parser/Record";
import RecordCard from "./RecordCard";
import { bibContext } from "../contexts/bibContext";

const RecordList: React.FC = () => {
    const { records } = useContext(bibContext);

    return (
        <div className="record-list">
            <div className="record record-header">
                <div className="record-contents">
                    <span className="checkbox half-width">
                        <input type="checkbox" />
                    </span>
                    <span className="title double-width">Title</span>
                    <span className="subtitle single-width">Type</span>
                    <span className="subtitle single-width">Entry Name</span>
                    <span className="subtitle single-width">Year</span>
                    <span className="subtitle double-width">Authors</span>
                    <span className="half-width"></span>
                </div>
            </div>
            {records.map((record: Record, index: number) => (
                <RecordCard record={record} key={index} />
            ))}
        </div>
    );
};

export default RecordList;
