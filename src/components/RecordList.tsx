import React, { useContext, useEffect, useState } from "react";
import Record from "../parser/Record";
import RecordCard from "./RecordCard";
import { bibContext } from "../contexts/bibContext";
import { RiDeleteBin5Line } from "react-icons/ri";

const RecordList: React.FC = () => {
    const { records, setRecords } = useContext(bibContext);
    const [selectedRecords, setSelectedRecords] = useState<number[]>([]);

    const deleteSelected = () => {
        setRecords((_records) => _records.filter((_, ind) => selectedRecords.indexOf(ind) == -1));
    };

    useEffect(() => {
        setSelectedRecords([]);
    }, [records]);

    const selectAll = () => {
        setSelectedRecords(records.map((_, index) => (index)));
    }

    return (
        <div className="record-list">
            <div className="record record-header">
                <div className="record-contents">
                    <span className="checkbox half-width">
                        <input type="checkbox" onChange={(e) => e.target.checked ? selectAll() : setSelectedRecords([])}/>
                    </span>
                    <span className="title double-width">Title</span>
                    <span className="single-width">Type</span>
                    <span className="single-width">Entry Name</span>
                    <span className="half-width">Year</span>
                    <span className="double-width">Authors</span>
                    <span className="half-width">
                        <a onClick={() => deleteSelected()}>
                            <RiDeleteBin5Line />
                        </a>
                    </span>
                </div>
            </div>
            {records.map((record: Record, index: number) => (
                <RecordCard
                    record={record}
                    key={index}
                    isChecked={selectedRecords.indexOf(index) != -1}
                    onSelect={() =>
                        setSelectedRecords((prev_state) => [
                            ...prev_state,
                            index,
                        ])
                    }
                    onDeselect={() =>
                        setSelectedRecords((prev_state) =>
                            prev_state.filter((ind) => ind != index)
                        )
                    }
                />
            ))}
        </div>
    );
};

export default RecordList;
