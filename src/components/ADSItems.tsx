import React from "react";
import "../css/ads.css";

export interface BibEntry {
    title: string;
    bibcode: string;
    year: number;
    authors: string[];
}

interface ADSItemsProp {
    items: BibEntry[];
}

const ADSItems: React.FC<ADSItemsProp> = ({ items }) => {
    return (
        <div className="ads-items">

        </div>
    )
}

export default ADSItems;
