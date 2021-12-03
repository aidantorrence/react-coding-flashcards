import React, { useState, useEffect } from "react";
import AceEditor from "react-ace";
import Loader from "./Loader.js";
import useDidMountEffect from "../utils/useDidMountEffect.js";
import { useQuery } from "react-query";
import axios from "axios";

import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-dracula";
import getRandomSnippet from "../utils/getRandomSnippet.js";

async function getSnippets() {
  try {
    const res = await axios.get("http://localhost:8080/");
    return res.data;
  } catch (e) {
    console.log(e);
  }
}

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

const language_codes = { python: 71, javascript: 63 };

function Ace() {
const [snippet, setSnippet] = useState({});
  const [codeSnippets, setCodeSnippets] = useState(
    JSON.parse(localStorage.getItem("examples")) || []
  );
  const [value, setValue] = useState("");
  const [titleInput, setTitleInput] = useState("");
  const [outputString, setOutputString] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [solutionToggle, setSolutionToggle] = useState(false);
  const [solutionHeight, setSolutionHeight] = useState("");
  const [editorHeight, setEditorHeight] = useState("450px");
  const [categoryInput, setCategoryInput] = useState("");
  const [filteredSnippets, setFilteredSnippets] = useState(codeSnippets);
  const [filteredCategory, setFilteredCategory] = useState("Filter...");

  useEffect(() => {
    document.addEventListener("keydown", handleCmndEnter);
    return () => document.removeEventListener("keydown", handleCmndEnter);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      return;
    } else {
      fetch(
        "https://judge0-ce.p.rapidapi.com/submissions/?base64_encoded=true&wait=true",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-RapidAPI-Key":
              "99e3648241mshfb79b6fb9b41156p11abebjsne3388a69c835",
            "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
            useQueryString: true,
          },
          body: JSON.stringify({
            // language_id: language_codes[language],
            source_code: btoa(value),
            stdin: "SnVkZ2Uw",
          }),
        }
      )
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          console.log(data.stdout);
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
          setIsLoading(false);
        })
        .catch((e) => {
          console.log(e);
          setIsLoading(false);
          setOutputString(e);
        });
    }
  }, [isLoading]);

  const { status, data, error } = useQuery("getSnippets", async () => {
    const { data } = await axios.get("http://localhost:8080/");
    if (data) {
        const selected = getRandomSnippet(data);
        setSnippet(selected);
        setValue(selected.prompt)
    }
    return data;
  });

//   if (data) {
//       const { title, prompt, language, category, difficulty, solution } =
//         data[data?.arrId] || {};
//   }

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
    console.log(btoa(value));
    setIsLoading(true);
    if (!value) {
      setIsLoading(false);
      setOutputString("");
    }
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
    setCategoryInput("");
    setEditorHeight("250px");
  }
  function handleDeleteSnip() {
    setValue("");
    setEditorHeight("250px");
  }
  //   function handleAnchorClick(e) {
  //     e.preventDefault();
  //     setValue(chosenSnippet.prompt);
  //     setLanguage(chosenSnippet.language);
  //     setSolution(chosenSnippet.solution);
  //     setSolutionToggle(false);
  //     setSolutionHeight("");
  //     setDifficulty(chosenSnippet.difficulty);
  //     setCategory(chosenSnippet.category);
  //     setId(chosenSnippet._id);
  //     setEditorHeight("450px");
  //     // console.log(e)
  //     console.log(codeSnippets);
  //   }

  function handleExpandClick() {
    const expandedHeight = (
      parseInt(editorHeight.replace("px", "")) + 250
    ).toString();
    setEditorHeight(`${expandedHeight}px`);
  }

  function SnipCategories() {
    const snipCategories = new Set();
    for (let item of codeSnippets) {
      snipCategories.add(item.category);
    }
    return (
      <>
        <label htmlFor="category"></label>
        <select
        //   value={category}
          onChange={(e) => setCategoryInput(e.target.value)}
          style={{ padding: "5px", width: "147px" }}
          name="category"
          id="category"
        >
          <option value="Choose an option">Choose...</option>
          {[...snipCategories].map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </>
    );
  }

  function SnipSidebar() {
    const [sidebarCategory, setSidebarCategory] = useState(snippet?.category);
    const snipCategories = new Set();
    for (let snippet of data) {
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
          {[...snipCategories].map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <ol>
          {data
            .filter((snippet) => snippet.category === sidebarCategory)
            .map((snippet) => (
              <li href="#" key={snippet.id}>
                {snippet.title}
              </li>
            ))}
        </ol>
      </>
    );
  }
  function SnipFilter() {
    const snipCategories = new Set();
    for (let item of codeSnippets) {
      snipCategories.add(item.category);
    }

    function handleFilteredSnippets(e) {
      setFilteredCategory(e.target.value);
      if (e.target.value === "All") {
        setFilteredSnippets(codeSnippets);
      } else {
        setFilteredSnippets(
          codeSnippets.filter((item) => item.category === e.target.value)
        );
      }
    }

    return (
      <>
        <label htmlFor="filteredCategory"></label>
        <select
          value={filteredCategory}
          onChange={handleFilteredSnippets}
          style={{ padding: "5px" }}
          name="filteredCategory"
          id="filteredCategory"
        >
          <option value="Filter...">Filter...</option>
          <option value="All">All</option>
          {[...snipCategories].map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </>
    );
  }

  console.log("react-query test data fetch", data, "react-query error", error);

  if (status === "error") return <>Error: {error.message}</>;
  if (status === "loading") return <div>Loading</div>;

  return (
    <>
      <div className="sidenav">
        <SnipSidebar />
      </div>
      <div>
        <button onClick={handleNewSnip}>New</button>
        <button onClick={handleRandomSnip}>Generate</button>
        {/* <button onClick={handleSnipSave}>Save</button> */}
        <button onClick={handleDeleteSnip}>Delete</button>
      </div>
      <div className="code-editor-container">
        <div className="code-editor-header">
          <div className="code-editor-title">
            <h1 style={{ display: "flex", fontSize: "22px" }}>
              {snippet?.title}
            </h1>
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
              <SnipFilter />
            </div>
          </div>
        </div>
        <div style={{ width: "80vh", height: editorHeight }}>
          <AceEditor
            mode={snippet?.language}
            theme="dracula"
            height="100%"
            width="100%"
            value={value}
            onChange={e => setValue(e.target.value)}
            showPrintMargin={false}
            name="UNIQUE_ID_OF_DIV"
            editorProps={{ $blockScrolling: true }}
            fontFamily="Roboto Mono"
          />
        </div>
      </div>
      <div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <button style={{ padding: "5px" }} onClick={handleConsoleClick}>
              Run
            </button>
            <button style={{ padding: "5px" }} onClick={handleExpandClick}>
              Expand
            </button>
          </div>
          <div>
            <button style={{ padding: "5px" }} onClick={handleRandomSnip}>
              Solved
            </button>
            <button style={{ padding: "5px" }} onClick={handleRandomSnip}>
              Failed
            </button>
          </div>
        </div>
        <div className="console-container" style={{ width: "80vh" }}>
          {isLoading ? (
            <Loader />
          ) : (
            <p style={{ padding: "5px" }}>{outputString}</p>
          )}
        </div>
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
            {snippet?.category ? (
              `Category: ${snippet?.category}`
            ) : (
              <>
                <label style={{ fontSize: "16px" }} htmlFor="category">
                  Add a category:
                </label>
                <input
                  style={{
                    width: "150px",
                    paddingLeft: "5px",
                    marginLeft: "5px",
                  }}
                  placeholder="Add new..."
                  onChange={(e) => setCategoryInput(e.target.value)}
                  type="text"
                  value={categoryInput}
                />
                <SnipCategories />
              </>
            )}
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
