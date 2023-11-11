import React, { useContext } from 'react'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { NavLink } from 'react-router-dom'
import './Navigationbar.css'
import { loginContext } from '../../contexts/loginContext';
function NavigationBar() {
  let [currentUser, loginUser, userLoginStatus, loginErr, logoutUser] = useContext(loginContext)
  return (
    <>
      {["lg"].map((expand) => (
        <Navbar
          key={expand}
          textcolor="#fff"
          expand={expand}
          className="header sticky-top p-2"
        >
          <Container fluid>
            <div className="m-3">
              <a href="/">
                <img src="media/home.png" alt="" width="40" height="40" />
              </a>
            </div>
            <Navbar.Brand>
              <NavLink to="/" className="text-decoration-none text-white fs-1">
                VNRVJIET
              </NavLink>
            </Navbar.Brand>
            <Navbar.Toggle />
            <Navbar.Collapse className="collapse-nav">
              <Nav className="ms-auto p-3">
                <NavLink
                  to="/"
                  className="fa nav-link text-white btn btn-success m-2"
                >
                  <i className="fa fa-home fa-fw"></i>HOME
                </NavLink>
                {userLoginStatus ? (
                  <NavLink
                    to="/admin-login"
                    className="fa text-white nav-link btn btn-success m-2"
                    onClick={logoutUser}
                  >
                    <i className="fa fa-sign-in fa-fw "></i>
                    LOGOUT
                  </NavLink>
                ) : (
                  <NavLink
                    to="/admin-login"
                    className="fa text-white nav-link btn btn-success m-2"
                  >
                    <i className="fa fa-user fa-fw "></i>ADMIN-LOGIN
                  </NavLink>
                )}
                {/* <NavLink to="/admin-login" className="fa text-white nav-link btn btn-success m-2"><i className="fa fa-sign-in fa-fw "></i>LOGIN</NavLink> */}
                {/* <NavLink to="/contactus" className='fa nav-link text-white  btn btn-success m-2'><i className="fa fa-users fa-fw"></i>CONTACT</NavLink> */}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      ))}
    </>
  );
}

export default NavigationBar;