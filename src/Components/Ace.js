import React, { useState, useEffect } from "react";
import AceEditor from "react-ace";
import Loader from "./Loader";
import { useQuery } from "react-query";
import axios from "axios";

import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-dracula";
import SnipSidebar from "./SnipSidebar";
import SnipFilter from "./SnipFilter";
import executeCode from "../queries/executeCode";
import CodeOutput from "./CodeOutput";
import { getSnippets } from "../queries/getSnippets.ts";
import { Prompt } from "./Prompt";

async function createSnippet(
  title,
  prompt,
  language,
  category,
  difficulty,
  solution
) {
  axios
    .post("http://localhost:8080/", {
      title,
      prompt,
      language,
      category,
      difficulty,
      solution,
    })
    .then((data) => console.log(data))
    .catch((e) => console.log(e));
}

async function updateSnippet(
  id,
  title,
  prompt,
  language,
  category,
  difficulty,
  solution
) {
  axios
    .put("http://localhost:8080/", {
      id,
      title,
      prompt,
      language,
      category,
      difficulty,
      solution,
    })
    .then((data) => console.log(data))
    .catch((e) => console.log(e));
}

async function deleteSnippet(id) {
  axios
    .delete("http://localhost:8080/", { data: { id } })
    .then((data) => console.log(data))
    .catch((e) => console.log(e));
}

function Ace() {
  const [snippet, setSnippet] = useState({});
  const [codeSnippets, setCodeSnippets] = useState(
    JSON.parse(localStorage.getItem("examples")) || []
  );
  const [value, setValue] = useState("");
  const [outputString, setOutputString] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [solutionToggle, setSolutionToggle] = useState(false);
  const [solutionHeight, setSolutionHeight] = useState("");
  const [editorHeight, setEditorHeight] = useState("450px");
  const [filteredSnippets, setFilteredSnippets] = useState(codeSnippets);
  const [filteredCategory, setFilteredCategory] = useState("All");

  useEffect(() => {
    document.addEventListener("keydown", handleCmndEnter);
    return () => document.removeEventListener("keydown", handleCmndEnter);
  }, []);

  const {
    status,
    data: snippets,
    error,
  } = useQuery("getSnippets", getSnippets(setSnippet));

  const {
    refetch,
    status: executionStatus,
    data: outputData,
  } = useQuery("executeCode", () => executeCode(snippet), {
    refetchOnWindowFocus: false,
    enabled: false,
  });

  function handleRandomSnip() {
    const randomSnippet =
      filteredSnippets[Math.floor(Math.random() * filteredSnippets.length)];
    // console.log(localStorage.getItem('examples'))
    // console.log(randomSnippet)
    setValue(randomSnippet.prompt);
    setSolutionToggle(false);
    setSolutionHeight("");
    setEditorHeight("450px");
  }

  function handleConsoleClick() {
    refetch();
    console.log(outputData);
  }

  function handleCmndEnter(e) {
    if (e.keyCode === 13 && e.metaKey && value.length !== 0) {
      setIsLoading(true);
    }
  }

  function handleSolutionHeight() {
    setSolutionToggle(!solutionToggle);
    setSolutionHeight(!solutionHeight ? "250px" : "");
  }

  //   function handleSnipSave() {
  //     if ((!categoryInput && !category) || !difficulty || !value) {
  //       return;
  //     }
  //     createSnippet(
  //       value,
  //       language,
  //       categoryInput || category,
  //       difficulty,
  //       solution
  //     );
  //     getSnippets().then((data) => {
  //       setCodeSnippets((prev) => data || prev);
  //       setFilteredSnippets((prev) => data || prev);
  //       console.log("yessman", codeSnippets);
  //     });
  //   }

  function handleNewSnip() {
    setValue("");
    setEditorHeight("250px");
  }
  function handleDeleteSnip() {
    setValue("");
    setEditorHeight("250px");
  }

  function handleExpandClick() {
    const expandedHeight = (
      parseInt(editorHeight.replace("px", "")) + 250
    ).toString();
    setEditorHeight(`${expandedHeight}px`);
  }

  console.log(
    "react-query test snippets fetch",
    snippets,
    "react-query error",
    error
  );

  if (status === "error") return <>Error: {error.message}</>;
  if (status === "loading") return <div>Loading</div>;

  return (
    <>
      <SnipSidebar snippet={snippet} snippets={snippets} />

      <div className="buttons">
        <button onClick={handleNewSnip}>New</button>
        <button onClick={handleRandomSnip}>Generate</button>
        <button onClick={"handleSnipSave"}>Save</button>
        <button onClick={handleDeleteSnip}>Delete</button>
      </div>
      {/* Header */}
      <div className="code-editor-container">
        <div className="code-editor-header">
          <div className="code-editor-title">
            <h1 style={{ fontSize: "22px" }}>{snippet?.title}</h1>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end" }}>
            <div>
              <label htmlFor="languages"></label>
              <select
                defaultValue="hello"
                value={snippet?.language}
                style={{ padding: "5px" }}
                name="languages"
                id="languages"
              >
                <option value="python">Python</option>
                <option value="javascript">Javascript</option>
              </select>
            </div>
            <div>
              <SnipFilter
                filteredCategory={filteredCategory}
                setFilteredCategory={setFilteredCategory}
                snippets={snippets}
              />
            </div>
          </div>
        </div>
        <Prompt
          editorHeight={editorHeight}
          snippet={snippet}
          setSnippet={setSnippet}
        />
      </div>
      <div>
        {/* buttons */}
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <button className="button" onClick={handleConsoleClick}>
              Run
            </button>
            <button className="button" onClick={handleExpandClick}>
              Expand
            </button>
          </div>
          <div>
            <button className="button" onClick={handleRandomSnip}>
              Solved
            </button>
            <button className="button" onClick={handleRandomSnip}>
              Failed
            </button>
          </div>
        </div>
          <CodeOutput status={executionStatus} data={outputData} />
        <div
          className="solution-container"
          style={{ width: "80vh", height: solutionHeight }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <button style={{ padding: "5px" }} onClick={handleSolutionHeight}>
              Solution
            </button>
          </div>

          {solutionToggle && (
            <AceEditor
              mode={snippet?.language}
              theme="dracula"
              height="90%"
              width="100%"
              value={snippet?.solution}
              showPrintMargin={false}
              name="UNIQUE_ID_OF_DIV"
              editorProps={{ $blockScrolling: true }}
            />
          )}
        </div>
        <div style={{ display: "flex" }}>
          <h2
            style={{
              display: "flex",
              fontSize: "16px",
              paddingTop: "20px",
              paddingBottom: "10px",
              fontWeight: "normal",
              marginRight: "20px",
            }}
          >
            Category: {snippet?.category}
          </h2>
        </div>
        <div
          style={{
            flexDirection: "row",
            fontSize: "16px",
            paddingTop: "15px",
            paddingBottom: "10px",
            fontWeight: "normal",
          }}
        >
          <label htmlFor="difficulty">Difficulty: </label>
          <select
            value={snippet?.difficulty}
            style={{ padding: "5px", width: "147px" }}
            name="difficulty"
            id="difficulty"
          >
            <option value="Choose an option">Choose an option</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
      </div>
    </>
  );
}

export default Ace;
