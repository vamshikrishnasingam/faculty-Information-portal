const exp=require("express")

const app=exp() 

app.use(exp.json())

require('dotenv').config()
//assign port numnrt
const port=process.env.PORT||5000;
app.listen(port, () => console.log("server listening on port 5000..."));
const path=require("path")

//connect react build
app.use(exp.static(path.join(__dirname,'./build')))


//for validating CORS policy
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

//connect user api
const userApp=require("./APIs/userAPI")
app.use("/user-api",userApp)

const facultytimetableApp=require("./APIs/facultyTimeTable")
app.use("/facultytimetable-api",facultytimetableApp)

const classtimetableApp=require("./APIs/classTimeTable")
app.use("/classtimetable-api",classtimetableApp)

const facultylistApp=require("./APIs/facultyList")
app.use("/facultylist-api",facultylistApp)

const classfacultyApp=require("./APIs/classFaculty")
app.use("/classfaculty-api",classfacultyApp)

const freehoursApp=require("./APIs/freeHours")
app.use("/freehours-api",freehoursApp)

//connect to mongoclient
const mclient=require('mongodb').MongoClient

mclient.connect('mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.9.1')
.then((dbRef)=>{
    const dbObj=dbRef.db("portal")
    const userCollectionObj=dbObj.collection("userCollection")
    app.set("userCollectionObj",userCollectionObj)
    const facultyListObj=dbObj.collection("facultyListCollection")
    app.set("facultyListObj",facultyListObj)
    const facultyTimeTableObj=dbObj.collection("facTimeTableCollection")
    app.set("facultyTimeTableObj",facultyTimeTableObj)
    const classTimeTableObj=dbObj.collection("classTimeTableCollection")
    app.set("classTimeTableObj",classTimeTableObj)
    const classFacultyObj=dbObj.collection("classFacultyCollection")
    app.set("classFacultyObj",classFacultyObj)
    const freeHoursObj=dbObj.collection("freeHours")
    app.set("freeHoursObj",freeHoursObj)

    console.log("Connection to Test DB - Success")
})
.catch((err)=>console.log("Connection to Test DB - Failed"))


//middleware to deal with page refresh
const pageRefresh=(request,response,next)=>{
response.sendFile(path.join(__dirname,'./build/index.html'))
}
app.use("*",pageRefresh)


//create a middleware to handle invalid path
const invalidPathHandlingMiddleware = (request, response, next) => {
response.send({ message: "Invalid path" });
};

app.use(invalidPathHandlingMiddleware);

//create err handling middleware
const errHandler = (error, request, response, next) => {
response.send({ "error-message": error.message });
};
app.use(errHandler);