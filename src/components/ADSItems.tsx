import React, { useEffect, useState } from "react";
import "../css/ads.css";

export interface BibEntry {
    title: string;
    bibcode: string;
    year: number;
    authors: string[];
}

interface ADSItemsProp {
    items: BibEntry[];
    addItems: (items: BibEntry[]) => void;
}

const ADSItems: React.FC<ADSItemsProp> = ({ items, addItems }) => {
    const [selectedItems, setSelectedItems] = useState<number[]>([]);

    const selectItem = (index: number) => {
        setSelectedItems((prev_state) => [...prev_state, index]);
    };

    const deSelectItem = (index: number) => {
        setSelectedItems((prev_state) =>
            prev_state.filter((ind) => ind != index),
        );
    };

    const selectAll = () => {
        setSelectedItems(items.map((_, index) => index));
    };

    return (
        <>
            <div className="ads-items">
                <span className="ads-item ads-header">
                    <span className="ads-check">
                        <input
                            type="checkbox"
                            onChange={(e) =>
                                e.target.checked
                                    ? selectAll()
                                    : setSelectedItems([])
                            }
                        />
                    </span>
                    <span className="ads-authors">Authors</span>
                    <span className="ads-title">Title</span>
                    <span className="ads-year">Year</span>
                </span>
                {items.map((item, index) => (
                    <span key={item.bibcode} className="ads-item">
                        <span className="ads-check">
                            <input
                                type="checkbox"
                                checked={selectedItems.indexOf(index) != -1}
                                onChange={(e) =>
                                    e.target.checked
                                        ? selectItem(index)
                                        : deSelectItem(index)
                                }
                            />
                        </span>
                        <span className="ads-authors">
                            {item.authors.map((author, index) => {
                                if (index < 3) {
                                    return <span>{author};</span>;
                                } else if (index == 3) {
                                    return <span>{author}...</span>;
                                } else {
                                    return null;
                                }
                            })}
                        </span>
                        <span className="ads-title">{item.title}</span>
                        <span className="ads-year">{item.year}</span>
                    </span>
                ))}
            </div>
            {selectedItems.length > 0 && (
                <span
                    className="ads-add"
                    onClick={() =>
                        addItems(selectedItems.map((ind) => items[ind]))
                    }
                >
                    <button>Add</button>
                </span>
            )}
        </>
    );
};

export default ADSItems;
