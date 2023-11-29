import React from 'react'
import { NavLink, Link, Outlet } from "react-router-dom";
import { useContext } from "react";
import Button from "react-bootstrap/Button";
import ExcelToJsonConverterTimeTable from '../../../ExcelToJsonConverterTimeTable'
import { loginContext } from '../../../contexts/loginContext'
import { useSpring,animated } from 'react-spring';
const Update = () => {
  let [, , userLoginStatus, , logoutUser] = useContext(loginContext)
const fadeOutSlideUpAnimation = useSpring({
  to: async (next) => {
    await next({ opacity: 1, transform: "translateY(-10px)" });
  },
  from: { opacity: 0, transform: "translateY(20px)" },
  config: { duration: 700 },
});

  return (
    <animated.div
      style={fadeOutSlideUpAnimation}
      className="p-4 m-4 text-white"
    >
      <h1 className="m-1 text-white">DATA UPDATE</h1>
      <hr />
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
    </animated.div>
  );
}

export default Update