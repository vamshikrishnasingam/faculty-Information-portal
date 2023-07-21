import React, { useContext } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { loginContext } from '../../../contexts/loginContext'
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';

function FacultyLogin() {
  let [, loginUser, userLoginStatus, loginErr,logOutUser] = useContext(loginContext)
  const navigate = useNavigate()
  let { register, handleSubmit, formState: { errors } } = useForm()
  let submitForm = async (userCredObj) => {
    await loginUser(userCredObj)
    if (userLoginStatus) {
      navigate('/facultypage')
    }
  }
  return (
    <div className="m-5 admin-card">
      <div className="row m-3">
        <div className="col-lg-6 border border-2" id='first'>
          <div className="card-body">
            <div className='text-center'>
              <h2 className='text-center fs-1'>Faculty Information System</h2>
              <h1>Sign In</h1>
              <p>The key to happiness is to sign in.</p>
            </div>
            {/* <p>Or Login through Email</p> */}
            <div className='d-block p-4'>
              <form onSubmit={handleSubmit(submitForm)}>
                <div className=" mx-auto">
                  <h5>Username</h5>
                  <FloatingLabel
                    controlId="floatingInput"
                    label="Username"
                    className="mb-3"
                  >
                    <Form.Control type="text" placeholder="Username" {...register("username", { required: { value: "true", message: "* Username is required" }, minLength: { value: 4, message: "* Username is Too Small" }, maxLength: { value: 12, message: "* Username is Too Big" } })} />
                  </FloatingLabel>
                  {/* <input type="text"  controlId="floatingInput" className='form-control mb-3' placeholder='Username' {...register("username",{required:{value:"true",message:"* Username is required"},minLength:{value:4,message:"* Username is Too Small"},maxLength:{value:12,message:"* Username is Too Big"}})}/>*/}
                  {errors.username?.message && <p className="text-danger">{errors.username?.message}</p>}
                </div>
                <div className=" mx-auto">
                  <h5>password</h5>
                  <FloatingLabel
                    controlId="floatingInput"
                    label="Password"
                    className="mb-3"
                  >
                    <Form.Control type="password" placeholder="Password" {...register("password", { required: { value: "true", message: "* Password is required" }, minLength: { value: 8, message: "* Password is Too Small" }, maxLength: { value: 16, message: "* Password is Too Big" } })} />
                  </FloatingLabel>
                  {/* <input type="password" className='form-control mb-3' placeholder='password' {...register("password",{required:{value:"true",message:"* Password is required"},minLength:{value:8,message:"* Password is Too Small"},maxLength:{value:16,message:"* Password is Too Big"}})}/> */}
                  {errors.password?.message && <p className="text-danger">{errors.password?.message}</p>}
                </div>
                <p>Admin?<Link className='p-3' to="/admin-login">Login here</Link></p>
                <div className='p-2 text-center '>
                  {loginErr.length !== 0 && <p className='text-danger text-left text-center'>{loginErr}</p>}
                  <button type='submit' className="btn btn-primary">Login</button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="col-lg-6" id='second' >
          <img
            className="image w-100 h-100"
            src="media/UserData.png"
            alt="Card"
          />
        </div>
      </div>
    </div>


  )
}
export default FacultyLogin