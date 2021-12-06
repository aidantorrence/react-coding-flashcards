import AceEditor from "react-ace";
import Snippet from "../types/Snippet";

interface Props {
    solutionHeight: string;
    solutionToggle: boolean;
    snippet: Snippet;
    setSnippet: (snippet: Snippet) => void;
    setSolutionToggle: (value: boolean) => void;
    setSolutionHeight: (value: string) => void;
}

export function Solution({ setSnippet, solutionHeight, setSolutionHeight, snippet }: Props) {


    function handleSolutionHeight() {
        setSolutionHeight(!solutionHeight ? "250px" : "");
      }

    return <div
        className="solution-container"
        style={{ width: "80vh", height: solutionHeight }}
    >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
            <button style={{ padding: "5px" }} onClick={handleSolutionHeight}>
                Solution
            </button>
        </div>

        {solutionHeight && (
            <AceEditor
                mode={snippet?.language}
                theme="dracula"
                height="90%"
                width="100%"
                value={snippet?.solution}
                showPrintMargin={false}
                name="UNIQUE_ID_OF_DIV"
                onChange={(value) => setSnippet({ ...snippet, solution: value })}
                editorProps={{ $blockScrolling: true }} />
        )}
    </div>;
}
