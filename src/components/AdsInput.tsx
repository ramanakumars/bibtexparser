import React, { useEffect, useState } from "react";
import "../css/ads.css";
import ADSItems, { BibEntry } from "./ADSItems";

interface ADSInputProps {
    onChange: (value: string) => void;
    isVisible: boolean;
}


const AdsInput: React.FC<ADSInputProps> = ({ onChange, isVisible }) => {
    const [accessToken, setAccessToken] = useState<string>('');
    const [query, setQuery] = useState<string>('');
    const [bibitems, setBibitems] = useState<BibEntry[]>([]);

    const getQuery = () => {
        console.log(query);
    }

    const inputValue = accessToken === '' ? "Please fill the access token first" : query;

    if(isVisible) {
        return (
            <>        
                <div className='ads-background' onClick={() => onChange('')}>
                    &nbsp;
                </div>
                <div className='ads-container'>
                    <div className="access-token">
                        <label htmlFor="accessToken">Token: </label>
                        <input type="text" defaultValue={accessToken} onChange={(e) => setAccessToken(e.target.value)} className={'ads-input'}/>
                    </div>
                    <div className="ads-query">
                        <label htmlFor="query">Query: </label>
                        <input type="text" disabled={accessToken === ''} defaultValue={inputValue} onChange={(e) => setQuery(e.target.value)} className={'ads-input'} />
                        <button disabled={accessToken === ''} onClick={getQuery}>Submit!</button>
                    </div>
                    <ADSItems items={bibitems} />
                </div>
            </>
        );
    } else {
        return null;
    }
}

export default AdsInput;
