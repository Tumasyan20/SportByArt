const express = require('express');
const app = express()
app.listen(5846)
function getStatisticTimer() {
    var d = new Date();
    var h = d.getHours();
    var m = d.getMinutes();
    setInterval(() => {
        if(h == 00 && m == 00){
            console.log(secondsUntilEndOfDate)
        }
    }, 60000)
}

getStatisticTimer()