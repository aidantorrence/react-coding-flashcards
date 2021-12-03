import Snippet from "../types/Snippet";
import { languageCodes } from "./languageCodes";

export default function executeCode(snippet: Snippet, setIsLoading: (isLoading: boolean) => void, setOutputString: (outputString: string) => void) {
  fetch(
    "https://judge0-ce.p.rapidapi.com/submissions/?base64_encoded=true&wait=true",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-RapidAPI-Key": "99e3648241mshfb79b6fb9b41156p11abebjsne3388a69c835",
        "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
        // "useQueryString": true
      },
      body: JSON.stringify({
        language_id: languageCodes[snippet.language],
        source_code: btoa(snippet?.prompt),
        stdin: "SnVkZ2Uw",
      }),
    }
  )
    .then((res) => res.json())
    .then((data) => {
      console.log('execute code test', data)
      if (data.stderr) {
        setOutputString(atob(data.stderr));
      } else if (data.stdout === null) {
        if (data.message) {
          setOutputString(atob(data.message));
        } else {
          setOutputString("");
        }
      } else {
        setOutputString(atob(data.stdout));
      }
    })
    .catch((e) => {
      console.log(e);
      setOutputString(e);
    })
    .finally(() => {
        setIsLoading(false);
        }
    );
}
