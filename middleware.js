// Two types of middlewares:

// Pre-request middleware:
// 1. Simple middleware to log "Calling the /POSTS endpoint"
// 2. loadDatabase

// Post-request middleware:
// 1. Default express middleware for adding X-Powered-By
// 2. ????

// Route specific middleware:
// 1. Simple middleware to log "Calling the /POSTS endpoint"
// 2. loadDatabase

// Global middleware:
// 1. Default express middleware for adding X-Powered-By
// 2. logRequest


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