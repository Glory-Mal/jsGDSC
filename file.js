//import file system (fs)
const fs = require ('fs');

//read database.json file
const jsonString = fs.readFileSync('database.json');

//without passing to jsonObject it prints buffers and numbers
const jsonObject = JSON.parse(jsonString);

//print database.json file
console.log(jsonObject)



//  WRITE TO database.json
//add new value to database.json
jsonObject.push({
    username: "Eliah",
    password:"EEE",
    age:25
});
//Write to JSON file
fs.writeFileSync("database.json",JSON.stringify(jsonObject));