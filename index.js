const express = require('express');//import express
const fs = require ('fs');//import file system (fs)
const ejs = require ('ejs');//import ejs
const mysql = require ('mysql');//import mysql

//import body parser for taking user input
bodyParser = require ('body-parser');
const server = express();//app or server
//use body parser
server.use(bodyParser.urlencoded({extended:true}));
server.set("view engine","ejs");//ejs view engine

var connection = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "",
  database: "gdsc",
});


//middleware logRequest informs for a new request (Global middleware)
const logRequest = (req,res,next) => {
  console.log("New Request",req.method,req.url,new Date());
  next();
};

server.use(logRequest);

const port = 3000;

const loadDatabase = (req,res,next) => {
  const jsonString = fs.readFileSync("database.json");
  const posts = JSON.parse(jsonString);
  req.posts = posts;
  next(); 
}

// server.get('/', loadDatabase, (request, response) => {
//   console.log(request.headers)
//   //response.status(412).send('Hello, World! from my first express server');
//   response.render("index",{
//     title:"Home page",
//     posts:request.posts
//   });
// });


//Get all posts from mysql database
server.get("/", (request, response) => {
  connection.query("SELECT * FROM posts", function (error, results, fields) {
    if (error) {
      console.log("There's an error", error);

      response.status(500).json({
        message: "There's an error",
        error: error.message,
      });
    }

    const posts = results;

    console.log({ databaseResponse: results });

    response.render("index", {
      title: "Home page",
      posts,
    });
  });
});


//Get ALL Posts //READ
//get request
//http://localhost:3000/posts
server.get(
  '/posts',(req,res,next)=>{
    console.log("Calling the /POSTS endpoint");
    next();
  },
  loadDatabase,(req,res)=>{
    res.json(req.posts);
  },
);


// server.get('/posts',(req,res)=>{
//   const jsonString = fs.readFileSync("database.json");
//   const posts = JSON.parse(jsonString);

//   res.json(posts);
// });

//Get Single Post //READ
//request params
server.get('/posts/:id', loadDatabase, (req, res) => {
  const id = req.params.id;
  // const jsonString = fs.readFileSync("database.json");
  // const posts = JSON.parse(jsonString);

  const singlePost = req.posts.filter((post)=>post.id==id);

  res.json(singlePost);
});

//Create NEW Post //CREATE
//POST request
// server.post('/posts', loadDatabase, (req,res)=>{
//   const {title,content} = req.body;//id and time are automatic

//   //read db
//   try{
//   //   const jsonString = fs.readFileSync('database.json');
//   // const jsonObject = JSON.parse(jsonString);
//   const jsonObject = req.posts;
//   //above line for req.posts
//   const lastPost = jsonObject[jsonObject.length-1];
//   const lastId = lastPost.id;//finds the last id
//   const newId = lastId + 1;
//   const created_at = Date.now();
//   jsonObject.push({id:newId,title,content,created_at});
//   fs.writeFileSync("database.json",JSON.stringify(jsonObject));
//   res.json({id:newId,title,content,created_at});
//   } catch (error){
//     jsonObject=[];
//     const id = 1;
//     const created_at = Date.now();
//     jsonObject.push({id,title,content,created_at});
//     fs.writeFileSync("database.json",JSON.stringify(jsonObject));//checks if database.json exists
//     //if does not exist the above code creates one and write to it
//     res.json(jsonObject);//works when database.json is empty
//     //res.json(jsonObject=[]);
//     res.json({id:id,title,content,created_at});
//   }

//   res.send(`${title},${content}`);
  
// });

server.post("/posts", loadDatabase, (req, res) => {
  const { title, content } = req.body;

  console.log({ title, content });

  connection.query(
    `INSERT INTO posts (title, content, created_at) 
  VALUES (${title}, ${content}, NOW());`,
    function (error, results, fields) {
      if (error) {
        console.log("There's an error", error);

        res.status(500).json({
          message: "There's an error",
          error: error.message,
        });
      }

      const posts = results;

      console.log({ databaseResponse: results });

      response.json({
        id: results.insertId,
        title,
        content,
        created_at: "Hello",
      });
    },
  );


});

//UPDATE Single Post
//PUT request
server.put("/posts/:id", loadDatabase, (req, res) => {
  // Get the post id
  const id = req.params.id;
  // Get the new data
  const { title, content } = req.body;

  // Read DB file
  // const jsonString = fs.readFileSync("database.json");
  // const posts = JSON.parse(jsonString);

  // Get the post and update it
  const singlePostId = req.posts.findIndex((post) => post.id == id);
  req.posts[singlePostId] = { 
    ...req.posts[singlePostId], 
    title, 
    content, 
    updated_at: Date.now() 
  };

  // Update the DB file
  fs.writeFileSync("database.json", JSON.stringify(req.posts));

  res.json(req.posts[singlePostId]);
});


//DELETE Single Post
//DELETE request
server.delete("/posts/:id", loadDatabase, (req, res) => {
  const id = req.params.id;

  // const jsonString = fs.readFileSync("database.json");
  // let posts = JSON.parse(jsonString);

  const singlePost = req.posts.filter((post) => post.id == id);

  // Update the DB file
  req.posts = req.posts.filter((post) => post.id != id);
  fs.writeFileSync("database.json", JSON.stringify(req.posts));

  res.json(singlePost);
});

//Login sends login.html page
server.get('/login', (request, response) => {
    //response.sendFile('login.html',{root:__dirname});
    response.render("login",{
      title:"No login Page"
    });
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

// server.listen(port, () => {
//   console.log(`Server listening at http://localhost:${port}`);//localhost:1234 as an example
// });

server.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);

  // connection.connect();
  connection.connect(function (err) {
    if (err) {
      console.error("error connecting: " + err.stack);
      return;
    }

    console.log("connected as id " + connection.threadId);
  });
});
