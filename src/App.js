
import React, { useState, useEffect } from "react";
import Ace from './Components/Ace.js'
import './App.css';
import query from './utils/query'

const examples = [{
  language: 'python', 
  title: 'Count the elements in a linked list (iterative or recursive)', 
  value: atob("Y2xhc3MgTGlzdE5vZGU6CiAgICBkZWYgX19pbml0X18oc2VsZiwgdmFsdWUgPSAwLCBuZXh0ID0gTm9uZSk6IAogICAgICAgIHNlbGYudmFsdWUgPSB2YWx1ZQogICAgICAgIHNlbGYubmV4dCA9IG5leHQKICAgIApkZWYgY291bnRFbGVtZW50cyhoZWFkOiBMaXN0Tm9kZSkgLT4gaW50OgogICAgIyBXcml0ZSB5b3VyIGNvZGUgaGVyZS4KICAgIHBhc3MKCiMgVGVzdCBDYXNlcwpMTDEgPSBMaXN0Tm9kZSgxLCBMaXN0Tm9kZSg0LCBMaXN0Tm9kZSg1KSkpCnByaW50KGNvdW50RWxlbWVudHMoTm9uZSkpICMgMApwcmludChjb3VudEVsZW1lbnRzKExMMSkpICMgMwpwcmludChjb3VudEVsZW1lbnRzKExpc3ROb2RlKCkpKSAjIDE="),
  solution: atob('ZGVmIGNvdW50RWxlbWVudHMoc2VsZik6CiAgICAgICAgbm9kZSA9IHNlbGYKICAgICAgICBsZW5ndGggPSAwCiAgICAgICAgd2hpbGUgbm9kZSBpcyBub3QgTm9uZToKICAgICAgICAgICAgbm9kZSA9IG5vZGUubmV4dAogICAgICAgICAgICBsZW5ndGggKz0gMQogICAgICAgIHJldHVybiBsZW5ndGgKICAgIApkZWYgY291bnRFbGVtZW50c1JlYyhzZWxmKToKICAgIGlmIHNlbGYubmV4dCBpcyBOb25lOgogICAgICAgIHJldHVybiAxCiAgICByZXR1cm4gMSArIHNlbGYubmV4dC5jb3VudEVsZW1lbnRzUmVjKCk=')}]

  

function App() {
  const [value, setValue] = useState('')

function handleClick () {
    query(`print('hello')`, 71).then(res => setValue(res.stdout))
  }

  return <>
  <div className="main">
    <Ace />
    <div>{value}</div>
    <button onClick={handleClick}>Submit</button>
  </div>
  </>
}

export default App;

