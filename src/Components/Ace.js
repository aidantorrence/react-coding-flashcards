import React, { useState, useEffect } from "react";
import AceEditor from "react-ace";
import Loader from "./Loader.js";
import useDidMountEffect from "../utils/useDidMountEffect.js";
import { useQuery } from "react-query";
import axios from "axios";

import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-dracula";

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
  const [codeSnippets, setCodeSnippets] = useState(
    JSON.parse(localStorage.getItem("examples")) || []
  );
  const [title, setTitle] = useState("");
  const [value, setValue] = useState("");
  const [titleInput, setTitleInput] = useState("");
  const [language, setLanguage] = useState("python");
  const [outputString, setOutputString] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [solution, setSolution] = useState("");
  const [solutionToggle, setSolutionToggle] = useState(false);
  const [solutionHeight, setSolutionHeight] = useState("");
  const [editorHeight, setEditorHeight] = useState("450px");
  const [category, setCategory] = useState("");
  const [categoryInput, setCategoryInput] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [filteredSnippets, setFilteredSnippets] = useState(codeSnippets);
  const [filteredCategory, setFilteredCategory] = useState("Filter...");
  const [id, setId] = useState("");

  useEffect(() => {
    console.log("yesssss", codeSnippets);
    getSnippets().then((data) => {
      setCodeSnippets((prev) => data || prev);
      setFilteredSnippets((prev) => data || prev);
    });
  }, []);

  useDidMountEffect(() => {
    handleRandomSnip();
  }, [filteredCategory]);

  useEffect(() => {
    localStorage.setItem("examples", JSON.stringify([...codeSnippets]));
    console.log(localStorage.getItem("examples"));
  }, [handleSnipSave]);

  useEffect(() => {
    document.addEventListener("keydown", handleCmndEnter);
    return () => document.removeEventListener("keydown", handleCmndEnter);
  }, [onChange]);

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
            language_id: language_codes[language],
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

  function handleRandomSnip() {
    const randomSnippet =
      filteredSnippets[Math.floor(Math.random() * filteredSnippets.length)];
    // console.log(localStorage.getItem('examples'))
    // console.log(randomSnippet)
    setValue(randomSnippet.prompt);
    setTitle(randomSnippet.title);
    setLanguage(randomSnippet.language);
    setSolution(randomSnippet.solution);
    setSolutionToggle(false);
    setSolutionHeight("");
    setDifficulty(randomSnippet.difficulty);
    setCategory(randomSnippet.category);
    setId(randomSnippet._id);
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

  function onChange(newValue) {
    console.log(newValue);
    setValue(newValue);
  }

  function handleSolutionHeight() {
    setSolutionToggle(!solutionToggle);
    setSolutionHeight(!solutionHeight ? "250px" : "");
  }

  function handleSnipSave() {
    const filteredSnips = codeSnippets.filter((item) => item.title !== title);
    if (
      (!titleInput && !title) ||
      (!categoryInput && !category) ||
      !difficulty ||
      !value
    ) {
      return;
    }
    createSnippet(
      titleInput || title,
      value,
      language,
      categoryInput || category,
      difficulty,
      solution
    );
    getSnippets().then((data) => {
      setCodeSnippets((prev) => data || prev);
      setFilteredSnippets((prev) => data || prev);
      console.log("yessman", codeSnippets);
    });

    setCodeSnippets([
      ...filteredSnips,
      {
        language,
        title: titleInput || title,
        category: categoryInput || category,
        difficulty,
        value,
        solution,
      },
    ]);
    setTitleInput("");
    setTitle("");
    setDifficulty("");
    setCategory("");
    setCategoryInput("");
    setValue("");
    setLanguage("python");
    setSolution("");
    setEditorHeight("250px");

    // console.log(codeSnippets, localStorage.getItem('examples'))
    // localStorage.clear()
    // const storedArray = JSON.parse(localStorage.getItem('examples')) || []
    // localStorage.setItem('examples', JSON.stringify([...codeSnippets]))
    // console.log(localStorage.getItem('examples'))
  }

  function handleNewSnip() {
    setValue("");
    setTitle("");
    setLanguage("python");
    setSolution("");
    setDifficulty("");
    setCategory("");
    setCategoryInput("");
    setEditorHeight("250px");
  }
  function handleDeleteSnip() {
    deleteSnippet(id).then((res) => console.log("yes ok", res));
    setValue("");
    setTitle("");
    setLanguage("python");
    setSolution("");
    setDifficulty("");
    setCategory("");
    setEditorHeight("250px");
    localStorage.setItem(
      "examples",
      JSON.stringify(
        JSON.parse(localStorage.getItem("examples")).filter(
          (item) => item.title !== title
        )
      )
    );
    setCodeSnippets(codeSnippets.filter((item) => item.title !== title));
  }
  function handleAnchorClick(e) {
    e.preventDefault();
    const chosenSnippet = codeSnippets.find(
      (item) => item.title === e.target.innerText
    );
    setValue(chosenSnippet.prompt);
    setTitle(chosenSnippet.title);
    setLanguage(chosenSnippet.language);
    setSolution(chosenSnippet.solution);
    setSolutionToggle(false);
    setSolutionHeight("");
    setDifficulty(chosenSnippet.difficulty);
    setCategory(chosenSnippet.category);
    setId(chosenSnippet._id);
    setEditorHeight("450px");
    // console.log(e)
    console.log(codeSnippets);
  }

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
          value={category}
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
    const [sidebarCategory, setSidebarCategory] = useState(category);
    console.log(
      codeSnippets
        .filter((item) => item.category === sidebarCategory)
        .map((item) => item.title)
    );
    const snipCategories = new Set();
    for (let item of codeSnippets) {
      snipCategories.add(item.category);
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
          {[...snipCategories].map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <ol>
          {codeSnippets
            .filter((item) => item.category === sidebarCategory)
            .map((item) => (
              <li onClick={handleAnchorClick} href="#" key={item.value}>
                {item.title}
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

  const { isQueryLoading, error, data } = useQuery(
    "getSnippets",
    axios.get("http://localhost:8080/")
  );

  console.log('react-query test data fetch', data, 'react-query error', error)

  if (error) return <>Error: {error.message}</>;
  if (isQueryLoading) return <div>Loading</div>;

  return (
    <>
      <div className="sidenav">
        <SnipSidebar />
      </div>
      <div>
        <button onClick={handleNewSnip}>New</button>
        <button onClick={handleRandomSnip}>Generate</button>
        <button onClick={handleSnipSave}>Save</button>
        <button onClick={handleDeleteSnip}>Delete</button>
      </div>
      <div className="code-editor-container">
        <div
          style={{
            display: "flex",
            width: "80vh",
            justifyContent: "space-between",
            paddingLeft: "3px",
            paddingRight: "3px",
            paddingBottom: "10px",
            paddingTop: "10px",
            boxSizing: "border-box",
          }}
        >
          <div className="code-editor-header">
            <h1 style={{ display: "flex", fontSize: "22px" }}>
              {!title && (
                <>
                  <label style={{ fontSize: "16px" }} htmlFor="title">
                    Title:
                  </label>
                  <input
                    style={{ width: "200px" }}
                    onChange={(e) => setTitleInput(e.target.value)}
                    type="text"
                    value={titleInput}
                  />
                </>
              )}
              {title}
            </h1>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end" }}>
            <div>
              <label htmlFor="languages"></label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
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
            mode={language}
            theme="dracula"
            height="100%"
            width="100%"
            value={value}
            onChange={onChange}
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
              mode={language}
              theme="dracula"
              height="90%"
              width="100%"
              value={solution}
              showPrintMargin={false}
              onChange={(e) => setSolution(e)}
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
            {category ? (
              `Category: ${category}`
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
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
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
