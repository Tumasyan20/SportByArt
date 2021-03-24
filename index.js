const express       = require('express');           //? import project main framework
const bodyParser    = require('body-parser');       //? import lib for work with request body
const mongoose      = require('mongoose');          //? ORM for easy wotrk with mongoDB


const { PORT, DB_URL } = require('./config');           //? import variables from config file
const router           = require('./routers/router');   //? import project main router

const app = express();


//? function for start HTTP server, and connect to mongoDB
async function start() {
    try {
        await mongoose.connect(DB_URL, {
            useNewUrlParser :   true,
            useFindAndModify:   false,
            useUnifiedTopology: true
        });
    
        app.listen(PORT, () => {
            console.log('Server has been started in port - ', PORT);
        })
    }
    catch(e) {console.log(e)}
}

start();


app.use('/', router);       //? connect project main router



//? use body parses for encode request body
app.use(bodyParser.urlencoded({
    extended: false
 }));
 
app.use(bodyParser.json());


app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Origin'
    );
    res.header(
      'Access-Control-Allow-Methods',
      'PUT, POST, GET, DELETE, OPTIONS, PATCH'
    );
    next();
});


