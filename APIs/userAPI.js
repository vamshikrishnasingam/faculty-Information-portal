const exp = require("express")
const userApp = exp.Router()

require("dotenv").config()

const expressAsyncHandler = require("express-async-handler")

const jwt = require("jsonwebtoken")
let bcryptjs = require("bcryptjs")


//body parser
userApp.use(exp.json())

const verifyToken = require("./middlewares/verifyToken")

const verifySuperToken = async (request, response, next) => {
    try {
      //get user collection object
      const userCollectionObj = request.app.get("userCollectionObj")
      const username = request.user.username;
      const userOfDB = await userCollectionObj.findOne({ username });
    //   console.log(type)
      const type = userOfDB.type;
  
      if (type === 'super-admin') {
        next();
      } else {
        response.status(403).json({ message: "Access denied. Not an admin." });
      }
    } catch (error) {
      console.error("Error verifying super token:", error);
      response.status(401).json({ message: "Unauthorized" });
    }
  };
  


//create user
userApp.post("/user-signup", expressAsyncHandler(async (req, res) => {
    //get user collection object
    const userCollectionObj = req.app.get("userCollectionObj")
    //get new user from request
    const newUser = req.body
    //check for duplicate user by username
    let userOfDB = await userCollectionObj.findOne({ username: newUser.username })
    //if user already exist, send response to client "User already existed"
    if (userOfDB != null) {
        res.status(200).send({ message: "User Already Existed" })
    }
    //if user not existed
    else {
        //hash the password
        let hashedPassword = await bcryptjs.hash(newUser.password, 5)
        //replace plain password 
        newUser.password = hashedPassword
        //insert user
        await userCollectionObj.insertOne(newUser)
        //send res
        res.status(201).send({ message: "User Created" })
    }
}))


//User Login
userApp.post('/user-login', expressAsyncHandler(async (request, response) => {
    //get user collection object
    const userCollectionObj = request.app.get("userCollectionObj")
    //get user credentials
    const userCredObj = request.body
    //verify username
    let userOfDB = await userCollectionObj.findOne({ username: userCredObj.username })
    //if username is invalid
    if (userOfDB === null) {
        response.status(200).send({ message: "Invalid Username" })
    }
    //if username is valid
    else {
        //hash password and compare with password in DB to verify password
        let isEqual = await bcryptjs.compare(userCredObj.password, userOfDB.password)
        //if passwords are not matched
        if (isEqual === false) {
            response.status(200).send({ message: "Invalid Password" })
        }
        //if password matched
        else {
            let jwtToken = jwt.sign({ username: userOfDB.username }, "abcdef", { expiresIn: "10m" })
            //delete password from user of db
            delete userOfDB.password
            //send token in response
            response.status(200).send({ message: "success", token: jwtToken, user: userOfDB })
        }
    }
}))


//get userslist
userApp.get('/get-users',verifyToken,verifySuperToken,expressAsyncHandler(async(req,res)=>{
    //get user collection object
    const userCollectionObj=req.app.get("userCollectionObj")
    //get users from db
    
    await userCollectionObj.find({}, { projection: { password: 0 } }).toArray()
    .then((userList)=>{
        res.status(200).send({message:"UserList",payload:userList})
    })
    .catch((err)=>{
        console.log("Error in Retriving UserList",err)
        res.send({message:"Error",errMessage:err.message})
    })
}))

//set default password user
userApp.get('/set-default-password/:username',verifyToken,verifySuperToken,expressAsyncHandler(async(request,response)=>{
    try{
    //get user collection
        const userCollectionObj=request.app.get("userCollectionObj")
        // get username from url
        let usernameOfUrl=request.params.username;
        //set a default password
        let defaultPassword="welcome123";
        //has default password
        let hashedPassword=await bcryptjs.hash(defaultPassword,5);
        //update user
        let result = await userCollectionObj.updateOne({username:usernameOfUrl},{$set:{ password: hashedPassword }})
        if(result.modifiedCount===0){
            response.status(200).send({message:"User not found/Nothing Modified"});
        }
        //send res
        response.status(200).send({message:"Password set to default"})
    } catch (error) {
        console.error('Error setting default password:', error);
        // Handle error (e.g., send an error response to the client)
        response.status(500).send({ message: `Error setting default password:${error}` });
    }
}))

//update user credentials
userApp.put('/update',verifyToken,expressAsyncHandler(async(req,res)=>{
    //get user collection object
    const userCollectionObj=req.app.get("userCollectionObj")
    //get modified user from client
    console.log(req.body)
    let modifiedUser=req.body
    let oldusername=modifiedUser.username;
    //if username update required
    if(typeof(modifiedUser.newusername)!='undefined'){
        modifiedUser.username=modifiedUser.newusername
        await delete modifiedUser.newusername
        // console.log(modifiedUser)
    }
    await delete modifiedUser._id;
    //get user from db
    let userOfDB=await userCollectionObj.findOne({username:oldusername})
    //if username is invalid
    if(userOfDB===null){
        res.status(200).send({message:"Invalid Username"})
    }
    //if username is valid
    else{
        //hash the password
        if(typeof(modifiedUser.password)!='undefined'){
            let hashedPassword=await bcryptjs.hash(modifiedUser.password,5)
            //replace plain password 
            modifiedUser.password=hashedPassword;
        }
        //insert user
        await userCollectionObj.updateOne({username:oldusername},{$set:modifiedUser})
        //send res
        res.status(200).send({message:"User Modified"})
    }
}))

//remove user
userApp.delete("/remove-user/:username",verifyToken,verifySuperToken,expressAsyncHandler(async(request,response)=>{

    //get user collection
    const userCollectionObj=request.app.get("userCollectionObj")

    //get username from url
    let usernameOfUrl=request.params.username;

    //delete user by username
    await userCollectionObj.deleteOne({username:usernameOfUrl})
    //send res
    response.status(200).send({message:"User removed"});

}))
// receive verify token request directly andd check
userApp.post('/verify-token', verifyToken, (req, res) => {
    res.status(200).json({ message: 'Token is valid' });
});

//get userinfo for page refresh
userApp.get('/get-user-info', verifyToken, expressAsyncHandler(async(req, res) => {
  // You can access the user information from the request object (req.user)
//   const user = req.user;

  //get user collection
  const userCollectionObj=req.app.get("userCollectionObj")
  //fetch user
  const user=await userCollectionObj.findOne({username:req.user.username})
  //remove hash key
  delete user.password;
  delete user._id;
  res.status(200).json({ payload: user });
}));
//export express app
module.exports = userApp;