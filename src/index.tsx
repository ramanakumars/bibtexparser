import React, { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import BibInput from './components/BibInput';
import TemplateInput from './components/TemplateInput';
import Output from './components/Output';
import { bibContext } from './contexts/bibContext';
import { Entry } from './parser/parser';
import { tempContext } from './contexts/tempContext';
import { Template } from './parser/template';
import './css/main.css';
import ErrorDisplay from './components/Error';


const App: React.FC = () => {
    const [entries, setEntries] = useState<Entry[]>([]);
    const [templates, setTemplates] = useState<Template[]>([]);
    
    return (
        <article id='main' className='center-frame'>
            <ErrorDisplay>
                <bibContext.Provider value={{ entries: entries, setEntries: setEntries }}>
                    <BibInput />
                </bibContext.Provider>
                <tempContext.Provider value={{ templates: templates, setTemplates: setTemplates }}>
                    <TemplateInput />
                </tempContext.Provider>
                <bibContext.Provider value={{ entries: entries, setEntries: setEntries }}>
                    <tempContext.Provider value={{ templates: templates, setTemplates: setTemplates }}>
                        <Output />
                    </tempContext.Provider>
                </bibContext.Provider>
                <HelpText />
            </ErrorDisplay>
        </article>

    )
}

const HelpText: React.FC = () => {
    return (
        <section id='template-helper' className='template-helper main-container'>
            <h1>Template tags</h1>
            <p className="template-tag-desc">
                <span className="template-tag"><code>$auths[x]</code></span>
                <span className='template-desc'>
                    Short author list.
                    Replace <code>x</code> with a number to specify number of authors to list, or use
                    <code>a</code> to print all the authors.
                    e.g., <code>$auths2</code> will give <code>AuthorA, A and AuthorB, B</code> for two authors,
                    and <code>AuthorA, A et al.</code> for more than two authors. <code>$authsa</code> will print
                    all the authors with first names initialed.
                </span>
            </p>

            <p className="template-tag-desc">
                <span className="template-tag"><code>$authf</code></span>
                <span className='template-desc'>
                    Full author list.
                    This will print all the authors in <code>Firstname Initial Lastname</code> format.
                    Cannot be used with <code>$auths[x]</code> above. If first name is not found, the
                    first initial is printed instead.
                </span>
            </p>

            <p style={{ 'display': 'block', 'width': '100%', 'textAlign': 'center' }} className='template-tag-desc'>
                <b>You must have either <code>$auths[x]</code> or <code>$authf</code> in your template.</b>
            </p>

            <p className="template-tag-desc">
                <span className="template-tag"><code>$doi</code></span>
                <span className='template-desc'>
                    The DOI value. e.g., <code>10.1103/PhysRev.73.803</code>
                </span>
            </p>

            <p className="template-tag-desc">
                <span className="template-tag"><code>$doiurl</code></span>
                <span className='template-desc'>
                    The full DOI URL. e.g., <code>https://doi.org/10.1103/PhysRev.73.803</code>
                </span>
            </p>

            <p className="template-tag-desc">
                <span className="template-tag"><code>$[variable]</code></span>
                <span className='template-desc'>
                    Any other keyword entry in bibtex (e.g., <code>$year</code> for the year,
                    <code>$title</code> for the title.) Years will be formatted in full 4-digit
                    integer format and titles will retain any TeX formatting.
                </span>
            </p>

            <p className="template-tag-desc">
                <span className="template-tag"><code>\\</code>,<code>$</code> and text</span>
                <span className='template-desc'>
                    Use <code>\</code> to escape <code>{'{}'}</code> and <code>$$</code> to output <code>$</code>.
                    Any other text will be printed as is. e.g., use <code>\\item</code> to print a LaTeX <code>\\item</code> tag, or
                    <code>\{'{'}\bf \{'}'}</code> to enter a bold text.
                </span>
            </p>

            <p className="template-tag-desc">
                <span className="template-tag"><code>{'{'}optional{'}'}</code></span>
                <span className='template-desc'>
                    Enclose optional groups within a <code>{'{'}{'}'}</code>. If these keywords do not exist
                    in the bibtex entry, they will be skipped in the output. e.g., conference abstracts
                    do no usually have a publisher or page number, so you can use <code>{'{'}$journal $pages{'}'}</code>
                    to skip these entries for abstracts, but retain them for journal articles. The code
                    will error out when not finding specific tags.
                </span>
            </p>
        </section>
    )
}

const rootElement = document.getElementById('root');
const root = createRoot(rootElement!);
root.render(
    <StrictMode>
        <App />
    </StrictMode>
)
