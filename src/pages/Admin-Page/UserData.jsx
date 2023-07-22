/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import './UserData.css'
import { NavLink, Link, Outlet } from 'react-router-dom'
import AdminHome from './AdminHome'
import { loginContext } from '../../contexts/loginContext'
import { useContext } from 'react'
import Button from 'react-bootstrap/Button';
import ExcelToJsonConverterTimeTable from '../../ExcelToJsonConverterTimeTable'
function UserData() {
  let [, loginUser, userLoginStatus, loginErr, logoutUser] = useContext(loginContext)
  return (
    <div className='d-flex row m-5'>
      {userLoginStatus ?
        <>
          <div className="col-sm-3 col-lg-3 col-md-4 menu">
            <ul>
              <Link to="/classtt"><li><i className="fa fa-book"></i><NavLink className="text fw-bold fs-5" to="/classtt">CLASS TIME TABLES</NavLink></li></Link>
              <Link to="/facultytt"><li><i className="fa fa-graduation-cap"></i><NavLink className="fw-bold fs-5 text-decoration-none" to="/facultytt">FACULTY TIME TABLES</NavLink></li></Link>
              <Link to="/update"><li><i className="fa fa-users"></i> <NavLink className="fw-bold fs-5 text-decoration-none" to="/update">UPDATE DATA</NavLink></li></Link>
              <Link to="/freehours"><li><i className="fa fa-address-book"></i><NavLink className="fw-bold fs-5 text-decoration-none" to="/freehours">FREE HOURS</NavLink></li></Link>
              <Link to="/admin-login" onClick={logoutUser}><li><i className="fa fa-sign-out"></i><NavLink className="fw-bold fs-5 text-decoration-none" to="/admin-login" onClick={logoutUser}>LOGOUT</NavLink></li></Link>
            </ul>
          </div>
          <div className='col-lg-9 col-sm-9 col-md-8 p-3'>
            <AdminHome />
          </div>
          <div className='container p-3'>
            <Outlet />
          </div>
        </>
        :
        <div className='container col-sm-10 col-lg-6 p-5 border bg-secondary bg-opacity-10'>
          <h1 className='display-1 text-danger'>You are Logged Out</h1>
          <p className='display-6'>Please Login to continue</p>
          {/* <p className='display-6'>Please Login to continue</p> */}
          <Button variant="primary"><NavLink className="fw-bold fs-4 text-decoration-none text-white" to="/admin-login">Login</NavLink></Button>
        </div>
      }
    </div>

  )
}

export default UserData