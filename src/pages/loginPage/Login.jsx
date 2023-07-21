// import React, { useContext } from 'react'
// import './Login.css'
// import {useForm} from 'react-hook-form'
import {NavLink} from 'react-router-dom'
// import { loginContext } from '../../contexts/loginContext'
import Card from 'react-bootstrap/Card';
import CardGroup from 'react-bootstrap/CardGroup';


function Login() {
  // let [,loginUser,userLoginStatus,loginErr]=useContext(loginContext)
  // const navigate=useNavigate()
  // let {register,handleSubmit,formState:{errors}}=useForm()
  // let submitForm=async(userCredObj)=>{
  //   await loginUser(userCredObj)
  //   if(userLoginStatus){
  //     navigate('/adminpage')
  //   }
  // }
  return (
      <div className="text-center m-3 w-100">
            <CardGroup>
            <Card>
                <Card.Img variant="top" src="media/UserData.png" />
                <Card.Body>
                  <Card.Text>
                   <h1> Administrator</h1>
                  </Card.Text>
                </Card.Body>
                <Card.Footer>
                    <NavLink to="/admin-login" className="btn border border-dark border-4">Login</NavLink>
                </Card.Footer>
              </Card>
              <Card>
                <Card.Img variant="top"  src="media/UserData.png" />
                <Card.Body>
                  <Card.Text>
                    <h1>Faculty</h1>
                  </Card.Text>
                </Card.Body>
                <Card.Footer>
                  <NavLink to="/faculty-login" className="btn border border-dark border-4">Faculty Login</NavLink>
                </Card.Footer>
              </Card>
            </CardGroup>
         </div> 
  )
}
export default Login