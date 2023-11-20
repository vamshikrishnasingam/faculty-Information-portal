/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import "./AdminMainpage.css";
import { NavLink, Link, Outlet } from "react-router-dom";
import { loginContext } from "../../../contexts/loginContext";
import { useContext } from "react";
import Button from "react-bootstrap/Button";
function AdminMainPage() {

  let [currentUser,, userLoginStatus,,] = useContext(loginContext);
  return (
    <div className="d-flex row m-5">
      {userLoginStatus ? (
        <>
          <div className="col-lg-3 col-md-4 menu">
            <ul>
              <Link to="/classtt">
                <li>
                  <i className="fa fa-book"></i>
                  <NavLink className="text fw-bold fs-5" to="/classtt">
                    CLASS TIME TABLES
                  </NavLink>
                </li>
              </Link>
              <Link to="/facultytt">
                <li>
                  <i className="fa fa-graduation-cap"></i>
                  <NavLink
                    className="fw-bold fs-5 text-decoration-none"
                    to="/facultytt"
                  >
                    FACULTY TIME TABLES
                  </NavLink>
                </li>
              </Link>
              <Link to="/fac-list">
                <li>
                  <i className="fa fa-book"></i>
                  <NavLink className="text fw-bold fs-5" to="/fac-list">
                    FACULTY LIST
                  </NavLink>
                </li>
              </Link>
              <Link to="/freehours">
                <li>
                  <i className="fa fa-address-book"></i>
                  <NavLink
                    className="fw-bold fs-5 text-decoration-none"
                    to="/freehours"
                  >
                    FREE HOURS
                  </NavLink>
                </li>
              </Link>
              <Link to="/updatepage">
                <li>
                  <i className="fa fa-users"></i>
                  <NavLink
                    className="fw-bold fs-5 text-decoration-none"
                    to="/updatepage"
                  >
                    UPDATE
                  </NavLink>
                </li>
              </Link>
              <Link to="/history">
                <li>
                  <i className="fa fa-users"></i>
                  <NavLink
                    className="fw-bold fs-5 text-decoration-none"
                    to="/history"
                  >
                    HISTORY
                  </NavLink>
                </li>
              </Link>
                {(currentUser.type==="super-admin"||currentUser.type==="admin")
                &&<Link to="/admin-access">
                <li>
                  <i className="fa fa-users"></i>
                  <NavLink
                    className="fw-bold fs-5 text-decoration-none"
                    to="/admin-access"
                  >
                    ADMIN-ACCESS
                  </NavLink>
                </li>
              </Link>}
              {/* <Link to="/admin-login" onClick={logoutUser}>
                <li>
                  <i className="fa fa-sign-out"></i>
                  <NavLink
                    className="fw-bold fs-5 text-decoration-none"
                    to="/admin-login"
                    onClick={logoutUser}
                  >
                    LOGOUT
                  </NavLink>
                </li>
              </Link> */}
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
