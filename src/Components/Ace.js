
import React, {useState, useEffect} from "react";
import AceEditor from "react-ace";
import Loader from './Loader.js'

import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-monokai";



const language_codes = {python: 71, javascript: 63}

function Ace() {
    const [codeSnippets, setCodeSnippets] = useState(JSON.parse(localStorage.getItem('examples')) || [])
    const [title, setTitle] = useState('')
    const [value, setValue] = useState('')
    const [titleInput, setTitleInput] = useState('')
    const [language, setLanguage] = useState('python')
    const [outputString, setOutputString] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [solution, setSolution] = useState('')
    const [solutionToggle, setSolutionToggle] = useState(false)
    const [solutionHeight, setSolutionHeight] = useState('')
    const [editorHeight, setEditorHeight] = useState('500px')
    const [category, setCategory] = useState('')
    const [categoryInput, setCategoryInput] = useState('')
    const [difficulty, setDifficulty] = useState('')
    const [filteredSnippets, setFilteredSnippets] = useState(codeSnippets)
    const [filteredCategory, setFilteredCategory] = useState('Filter...')
    



    
    useEffect ( () => {
        localStorage.setItem('examples', JSON.stringify([...codeSnippets]))
        console.log(localStorage.getItem('examples'))
    }, [handleSnipSave] )

    useEffect (() => {  
        document.addEventListener('keydown',handleCmndEnter)
        return () => document.removeEventListener('keydown',handleCmndEnter)
    }, [onChange])

    useEffect (() => {
        if (!isLoading ) {
            return
        } else {
            fetch("https://judge0-ce.p.rapidapi.com/submissions/?base64_encoded=true&wait=true", 
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "X-RapidAPI-Key": "99e3648241mshfb79b6fb9b41156p11abebjsne3388a69c835",
                    "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
                    "useQueryString": true
                },
                body: JSON.stringify({
                    "language_id": language_codes[language],
                    "source_code": btoa(value),
                    "stdin": "SnVkZ2Uw"
                })
            }).then(res => res.json()).then(data => {
                console.log(data)
                console.log(data.stdout)
                if (data.stderr) {
                    setOutputString(atob(data.stderr))
                }
                else if (data.stdout === null) {
                    if (data.message) {
                        setOutputString(atob(data.message))
                    } else {
                    setOutputString('')
                    }
                } 
                else {
                    setOutputString(atob(data.stdout))
                }
                setIsLoading(false)
            }).catch(e => {
                console.log(e)
                setIsLoading(false)
                setOutputString(e)
            })  
        }
    }, [isLoading])

    



    function handleRandomSnip () {
        const randomSnippet = filteredSnippets[Math.floor(Math.random() * filteredSnippets.length)]
        // console.log(localStorage.getItem('examples'))
        // console.log(randomSnippet)
        setValue(randomSnippet.value)
        setTitle(randomSnippet.title)
        setLanguage(randomSnippet.language)
        setSolution(randomSnippet.solution)
        setSolutionToggle(false)
        setSolutionHeight('')
        setDifficulty(randomSnippet.difficulty)
        setCategory(randomSnippet.category)
        setEditorHeight('500px')
    }


    function handleConsoleClick() {
        console.log(btoa(value))
        setIsLoading(true)    
        if (!value) {
            setIsLoading(false)
            setOutputString('')
        }
    }

    function handleCmndEnter(e) {
        if(e.keyCode===13 && e.metaKey && value.length !== 0) {
            setIsLoading(true)    
        }
    }

    function onChange(newValue) {
        console.log(newValue);
        setValue(newValue)
    }

    function handleSolutionHeight () {
        setSolutionToggle(!solutionToggle)
        setSolutionHeight(!solutionHeight ? '250px' : '')
    }

    function handleSnipSave() {
        const filteredSnips = codeSnippets.filter(item => item.title !== title)

        if (!titleInput || !categoryInput || !difficulty || !value) {
            return
        }

        setCodeSnippets([...filteredSnips, {language, title: titleInput || title, category: categoryInput || category, difficulty, value, solution} ])
        setTitleInput('')
        setTitle('')
        setDifficulty('')
        setCategory('')
        setCategoryInput('')
        setValue('')
        setLanguage('python')
        setSolution('')
        setEditorHeight('250px')
        
        // console.log(codeSnippets, localStorage.getItem('examples'))
        // localStorage.clear()
        // const storedArray = JSON.parse(localStorage.getItem('examples')) || []
        // localStorage.setItem('examples', JSON.stringify([...codeSnippets]))
        // console.log(localStorage.getItem('examples'))
    }

    function handleNewSnip() {
        setValue('')
        setTitle('')
        setLanguage('python')
        setSolution('')
        setDifficulty('')
        setCategory('')
        setCategoryInput('')
        setEditorHeight('250px')
    }
    function handleDeleteSnip() {
        setValue('')
        setTitle('')
        setLanguage('python')
        setSolution('')
        setDifficulty('')
        setCategory('')
        setEditorHeight('250px')
        localStorage.setItem('examples', JSON.stringify(JSON.parse(localStorage.getItem('examples')).filter( item => item.title !== title)))
        setCodeSnippets(codeSnippets.filter(item => item.title !== title))
    }
    function handleAnchorClick(e) {
        e.preventDefault()
        const chosenSnippet = codeSnippets.find ( item => item.title === e.target.innerText)
        setValue(chosenSnippet.value)
        setTitle(chosenSnippet.title)
        setLanguage(chosenSnippet.language)
        setSolution(chosenSnippet.solution)
        setSolutionToggle(false)
        setSolutionHeight('')
        setDifficulty(chosenSnippet.difficulty)
        setCategory(chosenSnippet.category)
        setEditorHeight('500px')
        // console.log(e)
        console.log(codeSnippets)
    }

    function SnipCategories() {

        const snipCategories = new Set()
        for (let item of codeSnippets) {
            snipCategories.add(item.category)
        }
        return <>
        <label htmlFor="category"></label>
        <select value={category} onChange={e=> setCategoryInput(e.target.value)} style={{padding: '5px', width: '147px'}} name="category" id="category">
        <option value="Choose an option">Choose...</option>
        {[...snipCategories].map(item => <option key={item} value={item} >{item}</option>)}
        </select>
        </>
    }

    function SnipSidebar() {

        const [sidebarCategory, setSidebarCategory] = useState(category)
        console.log(codeSnippets.filter(item => item.category === sidebarCategory ).map( item => item.title))
        const snipCategories = new Set()
        for (let item of codeSnippets) {
            snipCategories.add(item.category)
        }
        return <>
        <label htmlFor="category"></label>
        <select value={sidebarCategory} onChange={e=> setSidebarCategory(e.target.value)} style={{padding: '5px', width: '147px'}} name="category" id="category">
        <option value="Choose an option">Choose...</option>
        {[...snipCategories].map(item => <option key={item} value={item} >{item}</option>)}
        </select>
        {codeSnippets.filter(item => item.category === sidebarCategory ).map( item => <a onClick={handleAnchorClick} href="#" key={item.value}>{item.title}</a> )}

        </>
    }
    function SnipFilter() {

        

        const snipCategories = new Set()
        for (let item of codeSnippets) {
            snipCategories.add(item.category)
        }

        function handleFilteredSnippets(e) {
            setFilteredCategory(e.target.value)
            if (e.target.value === 'All') {
                setFilteredSnippets(codeSnippets)
            } else {
                setFilteredSnippets(codeSnippets.filter(item => item.category === e.target.value ))
            }
            console.log(snipCategories, codeSnippets, filteredCategory)
        }

        return <>
        <label htmlFor="filteredCategory"></label>
        <select value={filteredCategory} onChange={handleFilteredSnippets} style={{padding: '5px', width: '147px'}} name="filteredCategory" id="filteredCategory">
        <option value="Filter...">Filter...</option>
        <option value="All">All</option>
        {[...snipCategories].map(item => <option key={item} value={item} >{item}</option>)}
        </select>
        

        </>
    }

  return <>
  <div className="sidenav">
      <SnipSidebar />
  </div>
  <div>
      <button onClick={handleNewSnip} >New</button>
      <button onClick={handleRandomSnip} >Generate</button>
      <button onClick={handleSnipSave} >Save</button>
      <button onClick={handleDeleteSnip} >Delete</button>
  </div>
  <div className="code-editor-header">
        <h1 style={{display: 'flex', fontSize: '22px'}}>
            {!title && <><label style={{fontSize: '16px'}} htmlFor="title">Title:</label>
            <input style={{width: '636px'}} onChange={e => setTitleInput(e.target.value)} type="text" value={titleInput}/></>}
            {title}
        </h1>
    </div>
    <div className='code-editor-container' >
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <div>
                <label htmlFor="languages"></label>
                <select value={language} onChange={e=> setLanguage(e.target.value)} style={{padding: '5px'}} name="languages" id="languages">
                    <option value="python">Python</option>
                    <option value="javascript">Javascript</option>
                </select>
            </div>
            <div>
            <SnipFilter />
            </div>
        </div>
        <div style={{width: '636px', height: editorHeight}}>
            <AceEditor
            mode={language}
            theme="monokai"
            height='100%'
            width='100%'
            value={value}
            onChange={onChange}
            name="UNIQUE_ID_OF_DIV"
            editorProps={{ $blockScrolling: true }}
            />
        </div>
    </div>
    <div >
        <button style={{padding: '5px'}} onClick={handleConsoleClick}>Run</button>
        <div className='console-container'>
            {isLoading ? <Loader /> : <p style={{padding: '5px'}}>{outputString}</p>}
        </div>
        <div style={{width: '636px', height: solutionHeight}}>
            <button style={{padding: '5px'}} onClick={handleSolutionHeight}>Solution</button>
            {solutionToggle && <AceEditor
                mode={language}
                theme="monokai"
                height='90%'
                width='100%'
                value={solution}
                onChange={e => setSolution(e)}
                name="UNIQUE_ID_OF_DIV"
                editorProps={{ $blockScrolling: true }}
                />}
        </div>
        <div style={{display: 'flex'}}>
            <h2 style={{display: 'flex', fontSize: '16px', paddingTop: '20px', paddingBottom: '10px', fontWeight: 'normal', marginRight: '20px'}}>
                {category ? `Category: ${category}` : <><label style={{fontSize: '16px'}} htmlFor="category">Add a category:</label>
                <input style={{width: '150px', paddingLeft: '5px', marginLeft: '5px'}} placeholder="Add new..." onChange={e => setCategoryInput(e.target.value)} type="text" value={categoryInput}/>
                <SnipCategories />
                </>}
            </h2>
        </div>
        <div style={{flexDirection: 'row', fontSize: '16px', paddingTop: '15px', paddingBottom: '10px', fontWeight: 'normal'}}>
                <label htmlFor="difficulty">Difficulty: </label>
                <select value={difficulty} onChange={e=> setDifficulty(e.target.value)} style={{padding: '5px', width: '147px'}} name="difficulty" id="difficulty">
                    <option value="Choose an option">Choose an option</option>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                </select>
            </div>
    </div>
</>


}

export default Ace;








// function Ace() {

//     const [value, setValue] = useState()
//     const [outputString, setOutputString] = useState(window.$log)
    
//     useEffect( () => {
//         console.oldLog = console.log;
//         console.log = function(value) {
//             console.oldLog(value);
//             window.$log = value;
//         };
//     }, [])
    
//     function handleConsoleClick() {
//         eval(value)
        
//         if (typeof window.$log === 'object') {
//             setOutputString(JSON.stringify(window.$log))
//         } else {
//             setOutputString(window.$log)
//         }
        
//     }
    
//     function onChange(newValue) {
    
        
    
//         // console.log(newValue);
//         setValue(newValue)
//       }
    
//       return <><AceEditor
//       mode="javascript"
//       theme="monokai"
//       onChange={onChange}
//       name="UNIQUE_ID_OF_DIV"
//       editorProps={{ $blockScrolling: true }}
//     />
//     <button onClick={handleConsoleClick}>Run</button>
//     <div className='lateesha' >{outputString}</div>
//     </>
    
    
//     }
    
//     export default Ace;