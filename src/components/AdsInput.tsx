import React, { useContext, useState } from "react";
import "../css/ads.css";
import ADSItems, { BibEntry } from "./ADSItems";
import { errorContext } from "../contexts/errorContext";
import { HelpIcon } from "./Icons";

interface ADSInputProps {
    onChange: (value: string) => void;
    isVisible: boolean;
}

interface ADSBibItem {
    bibcode: string;
    author: string[];
    title: string[];
    year: string;
}

const ADSurl = "https://api.adsabs.harvard.edu/v1/search/query?";
const ADSurl_export = "https://api.adsabs.harvard.edu/v1/export/bibtex?";

const AdsInput: React.FC<ADSInputProps> = ({ onChange, isVisible }) => {
    const [accessToken, setAccessToken] = useState<string>("");
    const [query, setQuery] = useState<string>("");
    const [bibitems, setBibitems] = useState<BibEntry[]>([]);
    const { setError } = useContext(errorContext);

    const getQuery = () => {
        const _query =
            ADSurl +
            new URLSearchParams({
                q: query,
                fl: "bibcode,author,title,year",
                rows: "10",
            });
        fetch(_query, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.response) {
                    setBibitems(
                        data.response.docs.map(
                            (bibitem: ADSBibItem): BibEntry => ({
                                title: bibitem.title[0],
                                bibcode: bibitem.bibcode,
                                authors: bibitem.author,
                                year: Number(bibitem.year),
                            })
                        )
                    );
                } else if (data.error) {
                    throw { message: data.error.msg };
                } else {
                    throw { message: data.message };
                }
            })
            .catch((error: any) => {
                setError(error.message);
            });
    };

    const getBitexFromEntries = (items: BibEntry[]) => {
        const bibcodes = items.map((item) => item.bibcode);
        fetch(ADSurl_export, {
            method: "POST",
            body: JSON.stringify({
                bibcode: bibcodes,
            }),
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })
            .then((response) => response.json())
            .then((data) => onChange(data.export))
            .catch((error: any) => setError(error.message));
    };

    if (isVisible) {
        return (
            <>
                <div className="ads-background" onClick={() => onChange("")}>
                    &nbsp;
                </div>
                <div className="ads-container">
                    <div className="access-token">
                        <label htmlFor="accessToken">Token: </label>
                        <input
                            type="text"
                            defaultValue={accessToken}
                            onChange={(e) => setAccessToken(e.target.value)}
                            className={"ads-input"}
                        />
                        <a href="https://github.com/adsabs/adsabs-dev-api/blob/master/README.md#access" target="_blank" rel="noreferrer"><HelpIcon /></a>
                    </div>
                    <div className="ads-query">
                        <label htmlFor="query">Query: </label>
                        <input
                            type="text"
                            disabled={accessToken === ""}
                            value={
                                accessToken === ""
                                    ? "Please fill the access token first"
                                    : query
                            }
                            onChange={(e) => setQuery(e.target.value)}
                            className={"ads-input"}
                        />
                        <button
                            disabled={accessToken === ""}
                            onClick={getQuery}
                        >
                            Submit!
                        </button>
                    </div>
                    <ADSItems items={bibitems} addItems={getBitexFromEntries} />
                </div>
            </>
        );
    } else {
        return null;
    }
};

export default AdsInput;
