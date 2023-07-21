const exp=require("express")
const userApp=exp.Router()

const expressAsyncHandler=require("express-async-handler")

userApp.put("/facultylist-insert",expressAsyncHandler(async(req,res)=>{
    //get user collection object
    const newUser=req.body
    const facultyListObj=req.app.get("facultyListObj")
    const classfacultyobj=req.app.get("classFacultyObj")
    const obj1=facultyListObj.findOne({username:newUser.username})
    //get new user from request
    await facultyListObj.insertOne(newUser)
    res.status(201).send({message:"User Created",payload:req.body})
}))

userApp.get("/faculty-data/:id",expressAsyncHandler(async(req,res)=>{
    //get user collection object
    const newUser=req.params.id;
    console.log(newUser)
    const facultyListObj=req.app.get("facultyListObj")
    const obj1=await facultyListObj.findOne({username:newUser})
    //get new user from request   
    res.json(obj1)
}))

module.exports=userApp;