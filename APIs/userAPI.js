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
userApp.post("/user-signup",verifyToken,verifySuperToken, expressAsyncHandler(async (req, res) => {
    //get user collection object
    const userCollectionObj = req.app.get("userCollectionObj")
    //get new user from request
    const newUser = req.body
    // convert username to lowercase
    newUser.username = newUser.username.toLowerCase();
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
        // Convert email to lowercase before inserting the user
        newUser.email = newUser.email.toLowerCase();
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
    // convert username to lowercase
    userCredObj.username = userCredObj.username.toLowerCase();
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
            let jwtToken = jwt.sign({ username: userOfDB.username }, "abcdef", { expiresIn: "30m" })
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

// ...

// Route to search for users based on username or email
userApp.get('/search-users/:userInput', verifyToken, verifySuperToken, expressAsyncHandler(async (req, res) => {
  const userInput = req.params.userInput;

  // get user collection object
  const userCollectionObj = req.app.get("userCollectionObj");

  try {
      // Search for users with the given username or email
      const users = await userCollectionObj.find({
        $or: [
          { username: { $regex: userInput, $options: 'i' } }, // 'i' for case-insensitive
          { email: { $regex: userInput, $options: 'i' } }
        ],
      }).toArray();

      res.status(200).send({ message: "User Search Results", payload: users });
  } catch (err) {
      console.log("Error in Searching Users", err);
      res.status(500).send({ message: "Error", errMessage: err.message });
  }
}));

//set default password user
userApp.get('/set-default-password/:username',verifyToken,verifySuperToken,expressAsyncHandler(async(req,res)=>{
    try{
        //get user collection
        const userCollectionObj=req.app.get("userCollectionObj")
        // get username from url
        let usernameOfUrl=req.params.username;
        // convert username to lowercase
        usernameOfUrl = usernameOfUrl.toLowerCase();
        //set a default password
        let defaultPassword="welcome123";
        //has default password
        let hashedPassword=await bcryptjs.hash(defaultPassword,5);
        //update user
        let result = await userCollectionObj.updateOne({username:usernameOfUrl},{$set:{ password: hashedPassword }})
        if(result.modifiedCount===0){
          res.status(200).send({message:"User not found/Nothing Modified"});
        }
        //find user email
        const userOfDB = await userCollectionObj.findOne(
          { username : usernameOfUrl },
          { projection: { email: 1, _id: 0 } }
        );
        // Define the email options
        let mailOptions = {
          from: process.env.OUTLOOK_EMAIL,
          to: userOfDB.email,
          subject: 'Password Changed by Super Admin - FIS',
          text: 'Your Password for FIS has been changed to: welcome123',
        //   html: `
        //   <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        //     <h1 style="color: #0078D4;>Password Reset</h1>
        //     <p>Hello,</p>
        //     <p>Your username: ${userOfDB.username}</p>
        //     <p>Your new password: <strong><em>${defaultPassword}</em></strong></p>
        //     <p  style="color: #0078D4;">Thank you!</p>
        //   </div>
        // `,
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

// Change Password Route
userApp.put('/change-password/:username', verifyToken, expressAsyncHandler(async (req, res) => {
  try {
    // get user collection
    const userCollectionObj = req.app.get('userCollectionObj');
    // get username from URL
    let usernameOfUrl = req.params.username;
    // convert username to lowercase
    usernameOfUrl = usernameOfUrl.toLowerCase();
    // get old and new passwords from the request body
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;
    const confirmNewPassword = req.body.confirmNewPassword;
    // fetch user email
    const user = await userCollectionObj.findOne({ username : usernameOfUrl });
    if (!user) {
      res.status(200).send({ message: 'User not found' });
      return;
    }
    // compare old password with the stored password
    const isOldPasswordValid = await bcryptjs.compare(oldPassword, user.password);
    if (isOldPasswordValid) {
      if (newPassword !== confirmNewPassword) {
        res.status(403).send({ message: 'New Passwords do not match' });
        return;
      }

      // hash the new password
      const hashedNewPassword = await bcryptjs.hash(newPassword, 5);
      // update user's password
      const result = await userCollectionObj.updateOne({ username: usernameOfUrl }, { $set: { password: hashedNewPassword } });

      if (result.modifiedCount === 0) {
        res.status(200).send({ message: 'User not found/Nothing modified' });
      } else {
        // send a password changed email to the user
        const mailOptions = {
          from: process.env.OUTLOOK_EMAIL,
          to: user.email, // Assuming user.email is available in your user object
          subject: 'Password Changed - FIS',
          text: 'Your password has been changed successfully.',
        };

        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.error('Error sending email:', error);
            res.status(500).json({ message: 'Error sending email' });
          } else {
            console.log('Email sent: ' + info.response);
            res.status(200).json({ message: 'Password changed successfully. Email sent.' });
          }
        });
      }
    } else {
      res.status(200).send({ message: 'Old password is invalid' });
    }
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).send({ message: `Error changing password: ${error.message}` });
  }
}));

// Update User Credentials Route
userApp.put('/update', verifyToken, expressAsyncHandler(async (req, res) => {
  try {
    // get user collection object
    const userCollectionObj = req.app.get("userCollectionObj");

    // get modified user from the client
    let modifiedUser = req.body;
    let oldUsername = modifiedUser.username;
    oldUsername=oldUsername.toLowerCase();
    // if username update required
    if (typeof(modifiedUser.newusername) !== 'undefined') {
      modifiedUser.username = modifiedUser.newusername;
      delete modifiedUser.newusername;
    }

    if (typeof(modifiedUser.oldusertype) !== "undefined") {
      delete modifiedUser.oldusertype;
    }

    delete modifiedUser._id;

    // get user from the database
    let userOfDB = await userCollectionObj.findOne(
      { username : oldUsername},
      { projection: { email: 1, _id: 0 } }
    );

    // if username is invalid
    if (!userOfDB) {
      res.status(200).send({ message: "Invalid Username" });
    } else {
      // hash the password
      if (typeof (modifiedUser.password) !== 'undefined') {
        let hashedPassword = await bcryptjs.hash(modifiedUser.password, 5);
        // replace plain password 
        modifiedUser.password = hashedPassword;
      }

      // Convert email to lowercase before updating user details
      const lowercaseEmail = modifiedUser.email.toLowerCase();
      userOfDB.email=lowercaseEmail;

      // update user details in the database
      await userCollectionObj.updateOne({ username: oldUsername }, { $set: { ...modifiedUser, email: lowercaseEmail } });

      // send an email to the user
      const mailOptions = {
        from: process.env.OUTLOOK_EMAIL,
        to: userOfDB.email, // Assuming user.email is available in your user object
        subject: 'User Details Modified - FIS',
        text: 'Your user details have been modified.',
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.error('Error sending email:', error);
          res.status(500).json({ message: 'Error sending email' });
        } else {
          console.log('Email sent: ' + info.response);
          res.status(200).json({ message: 'User details modified. Email sent.' });
        }
      });
    }
  } catch (error) {
    console.error('Error updating user details:', error);
    res.status(500).json({ message: 'Error updating user details' });
  }
}));

//remove user
userApp.delete("/remove-user/:username",verifyToken,verifySuperToken,expressAsyncHandler(async(req,res)=>{
  try {
    // get user collection
    const userCollectionObj = req.app.get("userCollectionObj");

    // get username from the URL
    let usernameOfUrl = req.params.username;

    // find the user by username
    const user = await userCollectionObj.findOne(
      { username : usernameOfUrl },
      { projection: { email: 1, _id: 0 } }
    );

    // Convert email to lowercase before sending an email
    const lowercaseEmail = user.email.toLowerCase();

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // delete user by username
    await userCollectionObj.deleteOne({ username: usernameOfUrl });

    // send an email to the user
    let mailOptions = {
      from: process.env.OUTLOOK_EMAIL,
      to: lowercaseEmail,
      subject: 'Access Removed - FIS',
      text: 'Your access to the admin page has been removed.',
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ message: 'Error sending email' });
      } else {
        console.log('Email sent: ' + info.response);
        res.status(200).json({ message: 'User removed. Email sent.' });
      }
    });
  } catch (error) {
    console.error('Error removing user:', error);
    res.status(500).json({ message: 'Error removing user' });
  }
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

// Generate a random OTP
const generateOTP = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

// Store OTPs temporarily (you might want to use a more persistent storage in a real application)
const otpStorage = {};

// Reset Password Route
userApp.post('/reset-password', expressAsyncHandler(async (req, res) => {
  try {
    // Get user collection object
    const userCollectionObj = req.app.get("userCollectionObj");
    // Get user input (email or username)
    const userInput = req.body.username;
    // Check if the user exists in the database
    const user = await userCollectionObj.findOne({
      $or: [{ username: userInput }, { email: userInput }],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate OTP
    const otp = generateOTP();
    // Store OTP temporarily
    otpStorage[user.username] = otp;

    // Define the email options
    let mailOptions = {
      from: process.env.OUTLOOK_EMAIL,
      to: user.email,
      subject: 'Password Reset OTP - FIS',
      text: `Your OTP for password reset is: ${otp}`,
    };

    // Send email
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.error('Error sending OTP email:', error);
        return res.status(500).json({ message: 'Error sending OTP email' });
      } else {
        console.log('OTP email sent: ' + info.response);
        res.status(200).json({ message: 'OTP sent successfully' });
      }
    });
    // console.log(otpStorage)
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ message: 'Error resetting password' });
  }
}));

// Verify OTP Route
userApp.post('/verify-otp', expressAsyncHandler(async (req, res) => {
  try {
    // const { username, otp } = req.body;
    const username = req.body.username;
    const otp = req.body.otp;
    // Check if OTP is valid
    // console.log(otpStorage)
    if (otpStorage[username] === otp) {
      // Clear the OTP after successful verification (for security reasons)
      delete otpStorage[username];
      res.status(200).json({ message: 'OTP verified successfully' });
    } else {
      res.status(400).json({ message: 'Invalid OTP' });
    }
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ message: 'Error verifying OTP' });
  }
}));

// Change Password with OTP Route
userApp.put('/change-password-with-otp/:username', expressAsyncHandler(async (req, res) => {
  try {
    const userCollectionObj = req.app.get("userCollectionObj");
    let username = req.params.username;
    let newPassword = req.body.newPassword;

    // Hash the new password
    const hashedNewPassword = await bcryptjs.hash(newPassword, 5);
    const user = await userCollectionObj.findOne(
      { username },
      { projection: { email: 1, _id: 0 } }
    );
    // console.log(user)
    // Update user's password
    const result = await userCollectionObj.updateOne({ username }, { $set: { password: hashedNewPassword } });

    if (result.modifiedCount === 0) {
      res.status(404).json({ message: 'User not found/Nothing modified' });
    } else {
      // Send email notifying about the password change
      const mailOptions = {
        from: process.env.OUTLOOK_EMAIL,
        to: user.email, // Assuming user.email is available in your user object
        subject: 'Password Changed - FIS',
        text: 'Your password has been changed successfully.',
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.error('Error sending email:', error);
          res.status(500).json({ message: 'Error sending email' });
        } else {
          console.log('Email sent: ' + info.response);
          res.status(200).json({ message: 'Password changed successfully. Email sent.' });
        }
      });
    }
  } catch (error) {
    console.error('Error changing password with OTP:', error);
    res.status(500).json({ message: 'Error changing password with OTP' });
  }
}));

// Forgot Username Route
userApp.post('/forgot-username', expressAsyncHandler(async (req, res) => {
  try {
    //get user collection
    const userCollectionObj=req.app.get("userCollectionObj")
    //get email
    const email = req.body.email;
    // console.log(email)
    // Check if the email exists in the database
    const user = await userCollectionObj.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Send the username via email
    const mailOptions = {
      from: process.env.OUTLOOK_EMAIL,
      to: user.email,
      subject: 'Username Retrieval - FIS',
      text: `Your username is: ${user.username}`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ message: 'Error sending email' });
      } else {
        console.log('Email sent: ' + info.response);
        res.status(200).json({ message: 'Username retrieved successfully. Check your email.' });
      }
    });
  } catch (error) {
    console.error('Error retrieving username:', error);
    res.status(500).json({ message: 'Error retrieving username' });
  }
}));

//export express app
module.exports = userApp;