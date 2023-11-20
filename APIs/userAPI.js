const exp = require("express")
const userApp = exp.Router()

require("dotenv").config()

const nodemailer = require('nodemailer');

// Create a Nodemailer transporter using Outlook SMTP settings
let transporter = nodemailer.createTransport({
  host: 'smtp.office365.com',
  port: 587,
  secure: false, // StartTLS is required for Office 365
  auth: {
    user: process.env.OUTLOOK_EMAIL,
    pass: process.env.OUTLOOK_PASSWORD,
  },
});

const expressAsyncHandler = require("express-async-handler")

const jwt = require("jsonwebtoken")
let bcryptjs = require("bcryptjs")


//body parser
userApp.use(exp.json())

const verifyToken = require("./middlewares/verifyToken")

const verifySuperToken = async (req, res, next) => {
    try {
      //get user collection object
      const userCollectionObj = req.app.get("userCollectionObj")
      const username = req.user.username;
      const userOfDB = await userCollectionObj.findOne({ username });
    //   console.log(type)
      const type = userOfDB.type;
  
      if (type === 'super-admin') {
        next();
      } else {
        res.status(403).json({ message: "Access denied. Not an admin." });
      }
    } catch (error) {
      console.error("Error verifying super token:", error);
      res.status(401).json({ message: "Unauthorized" });
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
userApp.post('/user-login', expressAsyncHandler(async (req, res) => {
    //get user collection object
    const userCollectionObj = req.app.get("userCollectionObj")
    //get user credentials
    const userCredObj = req.body
    //verify username
    let userOfDB = await userCollectionObj.findOne({ username: userCredObj.username })
    //if username is invalid
    if (userOfDB === null) {
        res.status(200).send({ message: "Invalid Username" })
    }
    //if username is valid
    else {
        //hash password and compare with password in DB to verify password
        let isEqual = await bcryptjs.compare(userCredObj.password, userOfDB.password)
        //if passwords are not matched
        if (isEqual === false) {
            res.status(200).send({ message: "Invalid Password" })
        }
        //if password matched
        else {
            let jwtToken = jwt.sign({ username: userOfDB.username }, "abcdef", { expiresIn: "10m" })
            //delete password from user of db
            delete userOfDB.password
            //send token in response
            res.status(200).send({ message: "success", token: jwtToken, user: userOfDB })
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
userApp.get('/set-default-password/:username',verifyToken,verifySuperToken,expressAsyncHandler(async(req,res)=>{
    try{
        //get user collection
        const userCollectionObj=req.app.get("userCollectionObj")
        // get username from url
        let usernameOfUrl=req.params.username;
        //set a default password
        let defaultPassword="welcome123";
        //has default password
        let hashedPassword=await bcryptjs.hash(defaultPassword,5);
        //update user
        let result = await userCollectionObj.updateOne({username:usernameOfUrl},{$set:{ password: hashedPassword }})
        //find user email
        if(result.modifiedCount===0){
          res.status(200).send({message:"User not found/Nothing Modified"});
        }
        let userOfDB = await userCollectionObj.findOne({ username: usernameOfUrl })
        // Define the email options
        let mailOptions = {
          from: process.env.OUTLOOK_EMAIL,
          to: userOfDB.email,
          subject: 'Password Changed for FIS',
          // text: 'Your Password for FIS has been changed to: welcome123',
          html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #0078D4;>Password Reset</h1>
            <p>Hello,</p>
            <p>Your username: ${userOfDB.username}</p>
            <p>Your new password: <strong><em>${defaultPassword}</em></strong></p>
            <p  style="color: #0078D4;">Thank you!</p>
          </div>
        `,
        };
        //send email
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
        });
        //send res
        res.status(200).send({message:"Password set to default"})
    } catch (error) {
        console.error('Error setting default password:', error);
        // Handle error (e.g., send an error response to the client)
        res.status(500).send({ message: `Error setting default password:${error}` });
    }
}))

// change password route
userApp.put('/change-password/:username', verifyToken, expressAsyncHandler(async (req, res) => {
    try {
      // get user collection
      const userCollectionObj = req.app.get('userCollectionObj');
      // get username from URL
      const usernameOfUrl = req.params.username;
      // get old and new passwords from request body
      const { oldPassword, newPassword, confirmNewPassword } = req.body;
  
      // fetch user
      const user = await userCollectionObj.findOne({ username: usernameOfUrl });
      if (!user) {
        res.status(200).send({ message: 'User not found' });
        return;
      }
  
      // compare old password with the stored password
      const isOldPasswordValid = await bcryptjs.compare(oldPassword, user.password);
      if (isOldPasswordValid) {
        if(newPassword!==confirmNewPassword){
            res.status().send({ message: 'New Passwords donot match' });
            return;
        }
        // hash the new password
        const hashedNewPassword = await bcryptjs.hash(newPassword, 5);
        // update user's password
        const result = await userCollectionObj.updateOne({ username: usernameOfUrl }, { $set: { password: hashedNewPassword } });
  
        if (result.modifiedCount === 0) {
          res.status(200).send({ message: 'User not found/Nothing modified' });
        } else {
          res.status(200).send({ message: 'Password changed successfully' });
        }
      } else {
        res.status(200).send({ message: 'Old password is invalid' });
      }
    } catch (error) {
      console.error('Error changing password:', error);
      // Handle error (e.g., send an error response to the client)
      res.status(500).send({ message: `Error changing password: ${error.message}` });
    }
}));

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
    if(typeof(modifiedUser.oldtype)!='undefined'){
        await delete modifiedUser.oldusertype
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
userApp.delete("/remove-user/:username",verifyToken,verifySuperToken,expressAsyncHandler(async(req,res)=>{

    //get user collection
    const userCollectionObj=req.app.get("userCollectionObj")

    //get username from url
    let usernameOfUrl=req.params.username;

    //delete user by username
    await userCollectionObj.deleteOne({username:usernameOfUrl})
    //send res
    res.status(200).send({message:"User removed"});

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