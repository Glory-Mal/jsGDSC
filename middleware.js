const express = require ("express");
const server = express();

server.get("/",log,hello); //log is the middleware

function log (req,res,next){
    console.log('Log');
    next();//next fn calls the next fn to be run
}

function hello(req,res,next){
    console.log("Hello user");
    next();//calls for next fn to run if available
}

server.listen(3000,function(){
    console.log("Server started listen to you");
});