/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import { NavLink,Link } from 'react-router-dom'
import { Outlet } from 'react-router-dom'
import { loginContext } from '../../contexts/loginContext'
import { useContext } from 'react'
import Button from 'react-bootstrap/Button';
function FacultyData() {
  let [,, userLoginStatus,, logoutUser] = useContext(loginContext)

  return (
    <div className='d-flex row m-4 mt-5'>
      {userLoginStatus ?
        <>
          <div class="col-3 menu">
            <ul>
              <Link to="userprofile"><li><i class="fa fa-user"></i><NavLink className="fs-5 fw-bold" to="userprofile">Your Profile</NavLink></li></Link>
              <Link to="userprofile"><li><i class="fa fa-book"></i><NavLink className="fs-5 fw-bold" to="userprofile">Syllabus</NavLink></li></Link>
              <Link to="userprofile"><li><i class="fa fa-question-circle"></i> <NavLink className="fs-5 fw-bold" to="userprofile">Help</NavLink></li></Link>
              <Link to="userprofile"><li><i class="fa fa-question-circle"></i><NavLink className="fw-bold fs-5" to="update">FAQ</NavLink></li></Link>
              <Link to="/faculty-login" onClick={logoutUser}><li><i class="fa fa-sign-out"></i><NavLink className="fw-bold fs-5" to="/faculty-login" onClick={logoutUser}>Logout</NavLink></li></Link>
            </ul>
          </div>
          <div className='col-9'>
            <Outlet />
          </div>
        </>

        :
        <div className='container col-sm-10 col-lg-6 p-5 border bg-secondary bg-opacity-10'>
          <h1 className='display-1 text-danger'>You are Logged Out</h1>
          <p className='display-6'>Please Login to continue</p>
          <Button variant="primary"><NavLink className="fw-bold fs-4 text-decoration-none text-white" to="/faculty-login">Login</NavLink></Button>

        </div>
      }
    </div>
  )
}

export default FacultyData