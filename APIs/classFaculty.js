const exp=require("express")
const classfacultyApp=exp.Router()

const expressAsyncHandler=require("express-async-handler")

classfacultyApp.get("/classfaculty-data/:id",expressAsyncHandler(async(req,res)=>{
    const classFacultyObj=req.app.get("classFacultyObj")
    const ids=req.params.id;
    const matchedfaculty=await classFacultyObj.findOne({id:ids})
    res.json(matchedfaculty)
}))

classfacultyApp.post("/cf-insert",expressAsyncHandler(async(req,res)=>{
    //get user collection object
    const classFacultyObj=req.app.get("classFacultyObj")
    //get new user from request
    const newUser=req.body
    await classFacultyObj.deleteOne({id:newUser.id})
        await classFacultyObj.insertOne(newUser)
        res.status(200).send({message:"User Created",payload:req.body})
}))

module.exports=classfacultyApp;