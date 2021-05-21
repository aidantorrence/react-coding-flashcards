
import React, {useState, useEffect} from "react";
import AceEditor from "react-ace";
import Loader from './Loader.js'

import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-monokai";



const language_codes = {python: 71, javascript: 63}

function Ace({codeSnippets, setCodeSnippets}) {
const [title, setTitle] = useState('')
const [value, setValue] = useState('')
const [titleInput, setTitleInput] = useState('')
const [language, setLanguage] = useState('python')
const [outputString, setOutputString] = useState('')
const [isLoading, setIsLoading] = useState(false)
const [solution, setSolution] = useState('')
const [solutionToggle, setSolutionToggle] = useState(false)


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
        })  
    }
}, [isLoading])

const randomSnippet = codeSnippets[Math.floor(Math.random() * codeSnippets.length)]

function handleRandomSnip () {
    console.log(randomSnippet)
    setValue(randomSnippet.value)
    setTitle(randomSnippet.title)
    setLanguage(randomSnippet.language)
    setSolution(randomSnippet.solution)
    console.log(value)
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

function handleSnipSave() {
    setCodeSnippets([...codeSnippets, {language, title: titleInput, value, solution} ])
    console.log(codeSnippets)
}

function handleNewSnip() {
    setValue('')
    setTitle('')
    setLanguage('')
    setSolution('')
}

  return <>
  <div>
      <button onClick={handleNewSnip} >New</button>
      <button onClick={handleRandomSnip} >Generate</button>
      <button onClick={handleSnipSave} >Save</button>
  </div>
  <div className="code-editor-header">
        <h1 style={{display: 'flex', fontSize: '22px'}}>
            {!title && <><label style={{fontSize: '16px'}} htmlFor="title">Title:</label>
            <input style={{width: '636px'}} onChange={e => setTitleInput(e.target.value)} type="text" value={titleInput}/></>}
            {title}
        </h1>
    </div>
    <div className='code-editor-container' >
        <div>
            <label for="languages"></label>
            <select onChange={e=> setLanguage(e.target.value)} style={{padding: '5px'}} name="languages" id="languages">
                <option value="python">Python</option>
                <option value="javascript">Javascript</option>
            </select>
        </div>
        <div style={{width: '636px', height: '500px'}}>
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
        <div style={{width: '636px', height: '250px'}}>
        <button style={{padding: '5px'}} onClick={() => setSolutionToggle(!solutionToggle)}>Solution</button>
        {solutionToggle && <AceEditor
            mode={language}
            theme="monokai"
            height='100%'
            width='100%'
            value={solution}
            onChange={e => setSolution(e)}
            name="UNIQUE_ID_OF_DIV"
            editorProps={{ $blockScrolling: true }}
            />}
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