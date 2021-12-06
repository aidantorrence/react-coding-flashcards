import Snippet from "../types/Snippet"

interface Props {
    category: string;
    setSnippet: (snippet: Snippet) => void;
    snippets: Snippet[];
    snippet: Snippet;
}

export default function SnipCategories({ setSnippet, snippets, snippet }: Props) {

    const snipCategories:Set<string> = new Set()
    for (let snippet of snippets) {
        snipCategories.add(snippet.category)
    }
    return <>
    <label htmlFor="category"></label>
    <select value={snippet?.category} onChange={e => setSnippet({ ...snippet, category: e.target.value })} style={{padding: '5px', width: '147px'}} name="category" id="category">
    <option value="Choose an option">Choose</option>
    {Array.from(snipCategories).map(snippet => <option key={snippet} value={snippet} >{snippet}</option>)}
    </select>
    </>
}