import AceEditor from "react-ace";
import Snippet from "../types/Snippet";

interface Props {
    editorHeight: string;
    snippet: Snippet;
    setSnippet: (snippet: Snippet) => void;
}

export default function Prompt({ editorHeight, snippet, setSnippet }: Props) {
    return <div className="code-editor-prompt" style={{ width: "80vh", height: editorHeight }}>
        <AceEditor
            mode={snippet?.language}
            theme="dracula"
            height="100%"
            width="100%"
            value={snippet?.prompt}
            onChange={(value) => setSnippet({ ...snippet, prompt: value })}
            showPrintMargin={false}
            name="UNIQUE_ID_OF_DIV"
            editorProps={{ $blockScrolling: true }}
            />
    </div>;
}
