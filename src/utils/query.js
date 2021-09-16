

export default async function query(value, language_id) {
    const res = await fetch("https://judge0-ce.p.rapidapi.com/submissions/?base64_encoded=true&wait=false", 
    {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            "X-RapidAPI-Key": "99e3648241mshfb79b6fb9b41156p11abebjsne3388a69c835",
            "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
            "useQueryString": true
        },
        body: JSON.stringify({
            "language_id": 71,
            "source_code": btoa(value),
            "stdin": "SnVkZ2Uw"
        })
    })
    const data = await res.json()
    return await getFromToken(data.token)
}

async function getFromToken (token) {
    var data
    let threshold = 0
    do {
        await new Promise(resolve => setTimeout(resolve, 100))
        const res = await fetch(`https://ce.judge0.com/submissions/${token}?base64_encoded=false&fields=*`)
        data = await res.json()
        // console.log(data.status.description)
        threshold++
    } while (data.status.description !== 'Accepted' && threshold < 20)
    return data
    
        //     console.log(data)
        //     console.log(data.stdout)
        //     if (data.stderr) {
        //         return atob(data.stderr)
        //     }
        //     else if (data.stdout === null) {
        //         return data.message ? data.message : ''
        //     } 
        //     else {
        //         return atob(data.stdout)
        //     }
        // })
}            