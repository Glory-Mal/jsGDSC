const express = require('express');//import express
const fs = require ('fs');//import file system (fs)

//import body parser for taking user input
bodyParser = require ('body-parser');
const server = express();//app or server
//use body parser
server.use(bodyParser.urlencoded({extended:true}));

const port = 1234;

//middleware
const logger = function(req,res,next){
    console.log("Custom middleware called");
    next();
}
server.use(express.json());
server.use(logger);


server.get('/', (request, response) => {
  console.log(request.headers)
  response.status(412).send('Hello, World! from my first express server');
});

//Get ALL Posts //READ
//get request
//http://localhost:3000/posts
server.get('/posts',(req,res)=>{
  const jsonString = fs.readFileSync("database.json");
  const posts = JSON.parse(jsonString);

  res.json(posts);
});

//Get Single Post //READ
//request params
server.get('/posts/:id', (req, res) => {
  const id = req.params.id;
  const jsonString = fs.readFileSync("database.json");
  const posts = JSON.parse(jsonString);

  const singlePost = posts.filter((post)=>post.id==id);

  res.json(singlePost);
});

//Create NEW Post //CREATE
//POST request
server.post('/posts',(req,res)=>{
  const {title,content} = req.body;//id and time are automatic

  //read db
  try{
    const jsonString = fs.readFileSync('database.json');
  const jsonObject = JSON.parse(jsonString);
  const lastPost = jsonObject[jsonObject.length-1];
  const lastId = lastPost.id;//finds the last id
  const newId = lastId + 1;
  const created_at = Date.now();
  jsonObject.push({id:newId,title,content,created_at});
  fs.writeFileSync("database.json",JSON.stringify(jsonObject));
  res.json({id:newId,title,content,created_at});
  } catch (error){
    jsonObject=[];
    const id = 1;
    const created_at = Date.now();
    jsonObject.push({id,title,content,created_at});
    fs.writeFileSync("database.json",JSON.stringify(jsonObject));//checks if database.json exists
    //if does not exist the above code creates one and write to it
    res.json(jsonObject);//works when database.json is empty
    //res.json(jsonObject=[]);
    res.json({id:id,title,content,created_at});
  }

  res.send(`${title},${content}`);
  
});

//UPDATE Single Post
//PUT request
server.put("/posts/:id", (req, res) => {
  // Get the post id
  const id = req.params.id;
  // Get the new data
  const { title, content } = req.body;

  // Read DB file
  const jsonString = fs.readFileSync("database.json");
  const posts = JSON.parse(jsonString);

  // Get the post and update it
  const singlePostId = posts.findIndex((post) => post.id == id);
  posts[singlePostId] = { 
    ...posts[singlePostId], 
    title, 
    content, 
    updated_at: Date.now() 
  };

  // Update the DB file
  fs.writeFileSync("database.json", JSON.stringify(posts));

  res.json(posts[singlePostId]);
});


//DELETE Single Post
//DELETE request
server.delete("/posts/:id", (req, res) => {
  const id = req.params.id;

  const jsonString = fs.readFileSync("database.json");
  let posts = JSON.parse(jsonString);

  const singlePost = posts.filter((post) => post.id == id);

  // Update the DB file
  posts = posts.filter((post) => post.id != id);
  fs.writeFileSync("database.json", JSON.stringify(posts));

  res.json(singlePost);
});

//Login sends login.html page
server.get('/login', (request, response) => {
    response.sendFile('login.html',{root:__dirname});
});

//Getting the post from login.html page
//body parser is necessary in line
//http://localhost:3000/login
server.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  res.send(`Your username is ${username} and password is ${password}`);
});

//request params
//http://localhost:3000/user/5
server.get('/user/:id', (req, res) => {
  const id = req.params.id;
  res.send(`Your id is ${id}`);
});

//request params
//http://localhost:3000/user/Glory/5
server.get('/user/:name/:id', (req, res) => {
  const name = req.params.name;
  const id = req.params.id;
  res.send(`Your name is ${name} and your id is ${id}`);
});

server.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);//localhost:1234 as an example
});