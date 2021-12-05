import React, { useState, useEffect } from "react";
import Loader from "./Loader";
import { useQuery } from "react-query";
import axios from "axios";
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-dracula";
import SnipSidebar from "./SnipSidebar";
import executeCode from "../queries/executeCode";
import CodeOutput from "./CodeOutput";
import getSnippets from "../queries/getSnippets";
import { Solution } from "./Solution";
import { Header } from "./Header";
import getRandomSnippet from "../utils/getRandomSnippet";

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
  const [solutionToggle, setSolutionToggle] = useState(false);
  const [solutionHeight, setSolutionHeight] = useState("");
  const [editorHeight, setEditorHeight] = useState("450px");
  const [filteredCategory, setFilteredCategory] = useState("All");

  // execute code on cmdEnter
  useEffect(() => {
    document.addEventListener("keydown", handleCmndEnter);
    return () => document.removeEventListener("keydown", handleCmndEnter);
  }, []);

  function handleCmndEnter(e) {
    if (e.keyCode === 13 && e.metaKey) {
      executeCodeRefetch();
    }
  }

  //fetch snippets
  const {
    status,
    isFetching,
    data: snippets,
    error,
    refetch: snippetsRefetch,
  } = useQuery("getSnippets", getSnippets, {
    refetchOnWindowFocus: false,
  });

  // send code snippet to api to execute
  const {
    refetch: executeCodeRefetch,
    status: executionStatus,
    data: outputData,
    isFetching: isCodeExecuting,
  } = useQuery("executeCode", () => executeCode(snippet), {
    refetchOnWindowFocus: false,
    enabled: false,
  });

  useEffect(() => {
    const filteredSnippets = snippets?.filter(
      (snip) => snip.category === filteredCategory || filteredCategory === "All"
    );
    setSnippet(getRandomSnippet(filteredSnippets || []));
    setSolutionToggle(false);
    setSolutionHeight("");
    setEditorHeight("450px");
  }, [snippets, filteredCategory, isFetching]);

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
    // setValue("");
    setEditorHeight("250px");
  }
  function handleDeleteSnip() {
    // setValue("");
    setEditorHeight("250px");
  }

  function handleExpandClick() {
    const expandedHeight = (
      parseInt(editorHeight.replace("px", "")) + 250
    ).toString();
    setEditorHeight(`${expandedHeight}px`);
  }

  if (status === "error") return <>Error: {error.message}</>;
  if (isFetching) return <div>Loading</div>;

  return (
    <>
      <SnipSidebar
        setSnippet={setSnippet}
        snippet={snippet}
        snippets={snippets}
      />

      <div className="buttons">
        <button onClick={handleNewSnip}>New</button>
        <button onClick={snippetsRefetch}>Generate</button>
        <button onClick={"handleSnipSave"}>Save</button>
        <button onClick={handleDeleteSnip}>Delete</button>
      </div>
      <Header
        snippet={snippet}
        filteredCategory={filteredCategory}
        setFilteredCategory={setFilteredCategory}
        snippets={snippets}
        editorHeight={editorHeight}
        setSnippet={setSnippet}
      />
      <div>
        {/* buttons */}
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <button className="button" onClick={executeCodeRefetch}>
              Run
            </button>
            <button className="button" onClick={handleExpandClick}>
              Expand
            </button>
          </div>
          <div>
            <button className="button" onClick={snippetsRefetch}>
              Solved
            </button>
            <button className="button" onClick={snippetsRefetch}>
              Failed
            </button>
          </div>
        </div>
        <CodeOutput
          status={executionStatus}
          data={outputData}
          isFetching={isCodeExecuting}
        />
        <Solution
          solutionHeight={solutionHeight}
          setSolutionHeight={setSolutionHeight}
          solutionToggle={solutionToggle}
          snippet={snippet}
          setSolutionToggle={setSolutionHeight}
        />
        <div>
          <h2 className="category">Category: {snippet?.category}</h2>
        </div>
        <div className="difficulty-container">
          <label htmlFor="difficulty">Difficulty: </label>
          <select
            value={snippet?.difficulty}
            style={{ padding: "5px" }}
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
