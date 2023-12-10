import React from 'react'
import { loginContext } from '../../../contexts/loginContext';
import { useContext } from 'react';
import Button from "react-bootstrap/Button";
import { NavLink, Link, Outlet } from "react-router-dom";
import { useSpring, animated } from "react-spring";
import { useState, useEffect } from "react";
function AdminHome() {
  let [currentUser, , userLoginStatus, , logoutUser] = useContext(loginContext);
 const fadeOutSlideUpAnimation = useSpring({
   to: async (next) => {
     await next({ opacity: 1, transform: "translateY(-10px)" });
   },
   from: { opacity: 0, transform: "translateY(20px)" },
   config: { duration: 700 },
 });

  return (
    <animated.div style={fadeOutSlideUpAnimation} className="fs-3 text-white container p-4 m-1">
      {userLoginStatus ? (
        <div className='m-4 p-1'>
          <h1>Welcome!!! {currentUser.username }</h1>
          <hr />
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
        <div className="container col-sm-10 col-lg-6 p-5 mt-5 border border-5 bg-secondary bg-opacity-10">
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

export default AdminHome;