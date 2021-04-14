const fetch = require('node-fetch');

const req = async () => {
    try {
        const response = await fetch("HTTP://127.0.0.1:8000/article/search", {
            method: "POST",
            body: JSON.stringify({"title" : "mek"}),
            headers: {
                'Content-Type': 'application/json'
            }
        })
    
        const json = await response.json();
        console.log(json)
    }
    catch(error) {
        console.log("error", error);
    }
}
req()