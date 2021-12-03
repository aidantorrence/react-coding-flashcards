import { useState } from "react";
import Snippet from "../types/Snippet";

function SnipSidebar({ snippet, snippets }: { snippet: Snippet; snippets: Snippet[] }) {
  const [sidebarCategory, setSidebarCategory] = useState(snippet?.category);
  const snipCategories: Set<string> = new Set();
  for (let snippet of snippets) {
    snipCategories.add(snippet.category);
  }
  return (
    <>
      <label htmlFor="category"></label>
      <select
        value={sidebarCategory}
        onChange={(e) => setSidebarCategory(e.target.value)}
        style={{ padding: "5px", width: "147px" }}
        name="category"
        id="category"
      >
        <option value="Choose an option">Choose...</option>
        {Array.from(snipCategories).map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
      <ol>
        {snippets
          .filter((snippet) => snippet.category === sidebarCategory)
          .map((snippet) => (
            <li key={snippet.id}>{snippet.title}</li>
          ))}
      </ol>
    </>
  );
}

export default SnipSidebar;
