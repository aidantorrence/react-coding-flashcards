import Snippet from "../types/Snippet";

const getRandomSnippet = (arr: Snippet[]) => {
  return arr[Math.floor(Math.random() * (arr.length))];
};

export default getRandomSnippet;