const exp=require("express")
const classtimetableApp=exp.Router()

const expressAsyncHandler=require("express-async-handler")

classtimetableApp.get("/classtt-data/:id",expressAsyncHandler(async(req,res)=>{
    const classTimeTableObj=req.app.get("classTimeTableObj")
    const ids=req.params.id;
    const matchedclass=await classTimeTableObj.findOne({id:ids})
    res.json(matchedclass)
}))

classtimetableApp.post("/classtt-insert",expressAsyncHandler(async(req,res)=>{
    //get user collection objec
    const newUser=req.body
    const classTimeTableObj=req.app.get("classTimeTableObj")
    //get new user from request
    await classTimeTableObj.deleteOne({id:newUser.id})
        await classTimeTableObj.insertOne(newUser)
        res.status(201).send({message:"User Created",payload:req.body})
}))

module.exports=classtimetableApp;