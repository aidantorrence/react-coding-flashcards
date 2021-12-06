import { useState } from "react";
import Snippet from "../types/Snippet";

function SnipSidebar({
  snippet,
  snippets,
  setSnippet,
}: {
  snippet: Snippet;
  snippets: Snippet[];
  setSnippet: (snippet: Snippet) => void;
}) {
  const [sidebarCategory, setSidebarCategory] = useState(snippet?.category);

  const snipCategories: Set<string> = new Set();
  snippets?.forEach((snip) => snipCategories.add(snip.category));

  return (
    <div className="sidenav">
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
          ?.filter((snip) =>
            sidebarCategory
              ? snip.category === sidebarCategory
              : snip.category === snippet?.category
          )
          .map((snip) => (
            <li onClick={() => setSnippet(snip)} key={snip._id}>
              {snip.title}
            </li>
          ))}
      </ol>
    </div>
  );
}

export default SnipSidebar;
