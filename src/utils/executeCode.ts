import Snippet from "../types/Snippet";
import { languageCodes } from "./languageCodes";

export default async function executeCode(snippet: Snippet) {
  try {
    const res = await fetch(
      "https://judge0-ce.p.rapidapi.com/submissions/?base64_encoded=true&wait=true",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-RapidAPI-Key":
            "99e3648241mshfb79b6fb9b41156p11abebjsne3388a69c835",
          "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
          // "useQueryString": true
        },
        body: JSON.stringify({
          language_id: languageCodes[snippet.language],
          source_code: btoa(snippet?.prompt),
          stdin: "SnVkZ2Uw",
        }),
      }
    );
    const data = res.json();
    return data;
  } catch (err) {
    console.log(err);
  }
}
