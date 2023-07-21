const exp = require("express")
const userApp = exp.Router()

require("dotenv").config()

const expressAsyncHandler = require("express-async-handler")

const jwt = require("jsonwebtoken")
let bcryptjs = require("bcryptjs")


//body parser
userApp.use(exp.json())


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

//export express app
module.exports = userApp;