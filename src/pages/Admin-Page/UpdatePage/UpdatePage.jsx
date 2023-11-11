/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { NavLink, Link, Outlet } from "react-router-dom";
import { loginContext } from "../../../contexts/loginContext";
import { useContext } from "react";
import Button from "react-bootstrap/Button";
function AdminMainPage() {
  let [, , userLoginStatus, , logoutUser] = useContext(loginContext);
  return (
    <div className="d-flex row m-5">
      {userLoginStatus ? (
        <>
          <div className="col-lg-3 col-md-4 menu">
            <ul>
              <Link to="/replace-fac">
                <li>
                  <i className="fa fa-users"></i>{" "}
                  <NavLink
                    className="fw-bold fs-5 text-decoration-none"
                    to="/fac-replace"
                  >
                    REPLACE FACULTY
                  </NavLink>
                </li>
              </Link>
              <Link to="/fac-update">
                <li>
                  <i className="fa fa-users"></i>{" "}
                  <NavLink
                    className="fw-bold fs-5 text-decoration-none"
                    to="/fac-update"
                  >
                    FACULTY UPDATE
                  </NavLink>
                </li>
              </Link>
              <Link to="/update">
                <li>
                  <i className="fa fa-users"></i>{" "}
                  <NavLink
                    className="fw-bold fs-5 text-decoration-none"
                    to="/update"
                  >
                    UPDATE DATA
                  </NavLink>
                </li>
              </Link>
              <Link to="/adminpage">
                <li>
                  <i className="fa fa-sign-out"></i>
                  <NavLink
                    className="fw-bold fs-5 text-decoration-none"
                    to="/adminpage"
                  >
                    GOBACK
                  </NavLink>
                </li>
              </Link>
            </ul>
          </div>
          <div className="col-lg-9 col-md-7 container">
            <Outlet />
          </div>
        </>
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

export default AdminMainPage;
