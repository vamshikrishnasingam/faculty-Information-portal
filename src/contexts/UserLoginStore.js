import { useState } from "react"
import axios from "axios";
import { loginContext } from "./loginContext";

function UserLoginStore({children}){
    const [currentUser,setCurrentUser]=useState({});
    const [loginErr,setLoginErr]=useState("")
    const [userLoginStatus,setUserLoginStatus]=useState(false)
    //function to make user login reuqest
    const loginUser=async(userCredObj)=>{
        await axios.post("http://localhost:5000/user-api/user-login",userCredObj)
        .then((response)=>{
            if(response.data.message==="success"){
                setCurrentUser({...response.data.user})
                setLoginErr("");
                setUserLoginStatus(true)
            }
            else{
                setLoginErr(response.data.message)
            }
            //navigate to user profile
            console.log("navigated to user profile")
        })
        .catch((err)=>{
            console.log("err in user login:",err)
            setLoginErr(err)
        })
    }

    //userlogout
    const logoutUser=()=>{
        //clear local or session storage
        localStorage.clear();
         //update user login status
         setUserLoginStatus(false)

    }

    return(
        <loginContext.Provider value={[currentUser,loginUser,userLoginStatus,loginErr,logoutUser]}>
            {children}
        </loginContext.Provider>
    )
}
export default UserLoginStore;