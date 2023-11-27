import React, { useContext } from 'react'
import { useForm } from 'react-hook-form'
import { NavLink, useNavigate } from 'react-router-dom'
import { loginContext } from '../../../contexts/loginContext'
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import './AdminLogin.css'
import { Button } from 'react-bootstrap';
import { useSpring,animated } from 'react-spring';
function AdminLogin() {
  let [, loginUser, userLoginStatus, loginErr,] = useContext(loginContext)
  const navigate = useNavigate()
  let { register, handleSubmit, formState: { errors } } = useForm()
  let submitForm = async (userCredObj) => {
    await loginUser(userCredObj);
    if (userLoginStatus) {
      navigate('/adminpage')
    }
  }
  const fadeInFromLeftAnimation = useSpring({
    to: { opacity: 1, transform: "translateX(0px)" },
    from: { opacity: 0, transform: "translateX(-20px)" },
    config: { duration: 500 },
  });
  
  return (
    <animated.div style={fadeInFromLeftAnimation} className="container p-4">
      <div className="row">
        <div className="col-lg-6 col-md-6 col-sm-12">
          <img
            className="image1"
            src="media/UserData.png"
            alt="Card"
            width="100%"
            height="100%"
          />
        </div>
        <div className="col-lg-6 col-md-6 col-sm-12 p-4 border  border-2 bg bg-success bg-opacity-10 image1">
          <div className="card-body" width="100%" height="100%">
            <div className="text-center">
              <h2 className="text-center text-white fs-1">Administrator</h2>
              <h1 className="text-white ">Sign In</h1>
              <p className="text-white ">The key to happiness is to sign in.</p>
            </div>
            <div className="d-block p-4">
              <form onSubmit={handleSubmit(submitForm)}>
                <div className=" mx-auto">
                  <h5 className="text-white ">Username</h5>
                  <FloatingLabel
                    controlId="floatingInput"
                    label="Username"
                    className="mb-3"
                  >
                    <Form.Control
                      type="text"
                      placeholder="Username"
                      {...register("username", {
                        required: {
                          value: "true",
                          message: "* Username is required",
                        },
                        minLength: {
                          value: 4,
                          message: "* Username is Too Small",
                        },
                        maxLength: {
                          value: 12,
                          message: "* Username is Too Big",
                        },
                      })}
                    />
                  </FloatingLabel>
                  {errors.username?.message && (
                    <p className="text-danger">{errors.username?.message}</p>
                  )}
                </div>
                <div className=" mx-auto">
                  <h5 className="text-white">password</h5>
                  <FloatingLabel
                    controlId="floatingInput1"
                    label="Password"
                    className="mb-3"
                  >
                    <Form.Control
                      type="password"
                      placeholder="Password"
                      {...register("password", {
                        required: {
                          value: "true",
                          message: "* Password is required",
                        },
                        minLength: {
                          value: 8,
                          message: "* Password is Too Small",
                        },
                        maxLength: {
                          value: 16,
                          message: "* Password is Too Big",
                        },
                      })}
                    />
                  </FloatingLabel>
                  {errors.password?.message && (
                    <p className="text-danger">{errors.password?.message}</p>
                  )}
                </div>
                <p className="text-white ">
                  Forget Password?
                  <NavLink className="p-3" to="/reset-password">
                    Reset here
                  </NavLink>
                </p>
                {/* <p className="text-white ">
                  Faculty?
                  <NavLink className="p-3" to="/faculty-login">
                    Login here
                  </NavLink>
                </p> */}
                <div className="p-2 text-center ">
                  {loginErr.length !== 0 && (
                    <p className="text-danger text-left text-center">
                      {loginErr}
                    </p>
                  )}
                  <Button
                    type="submit"
                    className="col-lg-3 bg-success border-success fw-bold"
                  >
                    Login
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </animated.div>
  );
}
export default AdminLogin