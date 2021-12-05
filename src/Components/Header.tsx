import SnipFilter from "./SnipFilter";
import Prompt from "./Prompt";
import Snippet from "../types/Snippet";

interface Props {
    snippet: Snippet;
    filteredCategory: string;
    setFilteredCategory: (category: string) => void;
    snippets: Snippet[];
    editorHeight: string;
    setSnippet: (snippet: Snippet) => void;
}

export function Header({ snippet, filteredCategory, setFilteredCategory, snippets, editorHeight, setSnippet }: Props) {
    return <div className="code-editor-container">
        <div className="code-editor-header">
            <div className="code-editor-title">
                <h1 style={{ fontSize: "22px" }}>{snippet?.title}</h1>
            </div>
            <div style={{ display: "flex", alignItems: "flex-end" }}>
                <div>
                    <label htmlFor="languages"></label>
                    <select
                        defaultValue="hello"
                        value={snippet?.language}
                        style={{ padding: "5px" }}
                        name="languages"
                        id="languages"
                    >
                        <option value="python">Python</option>
                        <option value="javascript">Javascript</option>
                    </select>
                </div>
                <div>
                    <SnipFilter
                        filteredCategory={filteredCategory}
                        setFilteredCategory={setFilteredCategory}
                        snippets={snippets} />
                        
                </div>
            </div>
        </div>
        <Prompt
            editorHeight={editorHeight}
            snippet={snippet}
            setSnippet={setSnippet} />
    </div>;
}
