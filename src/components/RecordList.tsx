import React, { useContext, useEffect, useState } from "react";
import RecordCard from "./RecordCard";
import { Entry } from "../parser/Record";
import { bibContext } from "../contexts/bibContext";
import { RiDeleteBin5Line } from "react-icons/ri";

const RecordList: React.FC = () => {
    const { entries, setEntries } = useContext(bibContext);
    const [selectedEntries, setSelectedEntries] = useState<number[]>([]);

    const deleteSelected = () => {
        setEntries((_entries) =>
            _entries.filter((_, ind) => selectedEntries.indexOf(ind) == -1)
        );
    };

    useEffect(() => {
        setSelectedEntries([]);
    }, [entries]);

    const selectAll = () => {
        setSelectedEntries(entries.map((_, index) => index));
    };

    return (
        <div className="record-list">
            <div className="record record-header">
                <div className="record-contents">
                    <span className="checkbox half-width">
                        <input
                            type="checkbox"
                            onChange={(e) =>
                                e.target.checked
                                    ? selectAll()
                                    : setSelectedEntries([])
                            }
                        />
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
            {entries.map((entry: Entry, index: number) => (
                <RecordCard
                    entry={entry}
                    updateEntry={(new_entry) => setEntries((_records: Entry[]) =>
                        _records.map((rec: Entry, i: number) => {
                            if(i == index) {
                                return {...rec, ...new_entry};
                            } else {
                                return rec;
                            }
                        })
                    )}
                    key={index}
                    isChecked={selectedEntries.indexOf(index) != -1}
                    onSelect={() =>
                        setSelectedEntries((prev_state) => [
                            ...prev_state,
                            index,
                        ])
                    }
                    onDeselect={() =>
                        setSelectedEntries((prev_state) =>
                            prev_state.filter((ind) => ind != index)
                        )
                    }
                />
            ))}
        </div>
    );
};

export default RecordList;
