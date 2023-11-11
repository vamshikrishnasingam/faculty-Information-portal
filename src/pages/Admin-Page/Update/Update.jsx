import React from 'react'
import { NavLink, Link, Outlet } from "react-router-dom";
import { useContext } from "react";
import Button from "react-bootstrap/Button";
import ExcelToJsonConverterTimeTable from '../../../ExcelToJsonConverterTimeTable'
import { loginContext } from '../../../contexts/loginContext'
const Update = () => {
  let [, , userLoginStatus,, logoutUser] = useContext(loginContext)
  return (
    <div className="container m-5">
      {userLoginStatus ? (
        <ExcelToJsonConverterTimeTable />
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

export default Update