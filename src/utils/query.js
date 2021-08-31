

export default function query(value) {
    fetch("https://judge0-ce.p.rapidapi.com/submissions/?base64_encoded=true&wait=false", 
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
    }).then(res => res.json()).then(data => {

        fetch(`https://ce.judge0.com/submissions/${data.token}?base64_encoded=false&fields=stdout,stderr,status_id,language_id`)
        .then(res => res.json()).then(data => console.log(data))


        console.log(data)
        console.log(data.stdout)
        if (data.stderr) {
            return atob(data.stderr)
        }
        else if (data.stdout === null) {
            return data.message ? data.message : ''
        } 
        else {
            return atob(data.stdout)
        }
    }).catch(e => {
        console.log(e)
    })  
}


