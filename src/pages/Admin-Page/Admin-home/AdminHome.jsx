import React from 'react'
import { loginContext } from '../../../contexts/loginContext';
import { useContext } from 'react';
import Button from "react-bootstrap/Button";
import { NavLink, Link, Outlet } from "react-router-dom";
function AdminHome() {
	let [, , userLoginStatus, , logoutUser] = useContext(loginContext);
  return (
    <div className="fs-4 text-white container p-5">
      {userLoginStatus ? (
        <div>
          <h1>Welcome to the Faculty Information Portal</h1>
          <p>
            Please check following things
            <div>
              <ul>
                <li>FACULTY TIME TABLES</li>
                <li>CLASS TIME TABLES</li>
                <li>UPDATION</li>
                <li>FREE HOURS</li>
              </ul>
            </div>
          </p>
        </div>
      ) : (
        <div className="container col-sm-10 col-lg-6 p-5 border bg-secondary bg-opacity-10">
          <h1 className="display-1 text-danger">You are Logged Out</h1>
          <p className="display-6">Please Login to continue</p>
          {/* <p className='display-6'>Please Login to continue</p> */}
          <Button variant="primary">
            <NavLink
              className="fw-bold fs-4 text-decoration-none text-white"
              to="/admin-login"
            >
              Login
            </NavLink>
          </Button>
        </div>
      )}
    </div>
  );
}

export default AdminHome;