import Snippet from "../types/Snippet";

interface SnipFilterProps {
  filteredCategory: string;
  setFilteredCategory: (category: string) => void;
  data: Snippet[];
}

export default function SnipFilter({
  filteredCategory,
  setFilteredCategory,
  data,
}: SnipFilterProps) {
  const snipCategories: Set<string> = new Set();
  for (let snippet of data) {
    snipCategories.add(snippet.category);
  }

  return (
    <>
      <label htmlFor="filteredCategory"></label>
      <select
        value={filteredCategory}
        onChange={(e) => setFilteredCategory(e.target.value)}
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
