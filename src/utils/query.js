import React, { useEffect } from 'react'

function query() {
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


