import Snippet from "../types/Snippet";

interface SnipFilterProps {
  filteredCategory: string;
  setFilteredCategory: (category: string) => void;
  snippets: Snippet[];
}

export default function SnipFilter({
  filteredCategory,
  setFilteredCategory,
  snippets,
}: SnipFilterProps) {
  const snipCategories: Set<string> = new Set();
  snippets?.forEach(snip => snipCategories.add(snip.category));

  return (
    <>
      <label htmlFor="filteredCategory"></label>
      <select
        value={filteredCategory}
        onChange={(e) => setFilteredCategory(e.target.value)
      }
        style={{ padding: "5px" }}
        name="filteredCategory"
        id="filteredCategory"
      >
        <option value="All">All</option>
        {Array.from(snipCategories).map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
    </>
  );
}
