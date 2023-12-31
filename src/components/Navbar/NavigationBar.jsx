import React, { useContext } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { NavLink } from "react-router-dom";
import { useSpring, animated } from "react-spring";
import "./Navigationbar.css";
import { loginContext } from "../../contexts/loginContext";

function NavigationBar() {
  const animationProps = useSpring({
    from: { opacity: 0, transform: "translateY(-30px)" },
    to: { opacity: 1, transform: "translateY(0)" },
    config: { duration: 500 },
  });

  let [, , userLoginStatus, , logoutUser] = useContext(loginContext);

  return (
    <animated.div style={animationProps}>
      {["lg"].map((expand) => (
        <Navbar
          key={expand}
          textcolor="#fff"
          expand={expand}
          className="nav-bar sticky-top p-2"
        >
          <Container fluid>
            <div className="m-3">
              {userLoginStatus ? (
                <NavLink
                  to="/adminpage"
                  className="text-decoration-none text-white"
                >
                  <img src="media/home.png" alt="" width="40" height="40" />
                </NavLink>
              ) : (
                <NavLink to="/" className="text-decoration-none text-white">
                  <img src="media/home.png" alt="logo" width="40" height="40" />
                </NavLink>
              )}
            </div>
            <Navbar.Brand>
              {userLoginStatus ? (
                <NavLink
                  to="/adminpage"
                  className="text-decoration-none text-white fs-1"
                >
                  VNRVJIET
                </NavLink>
              ) : (
                <NavLink
                  to="/"
                  className="text-decoration-none text-white fs-1"
                >
                  VNRVJIET
                </NavLink>
              )}
            </Navbar.Brand>
            <Navbar.Toggle />
            <Navbar.Collapse className="collapse-nav">
              <Nav className="ms-auto p-3">
                {userLoginStatus ? (
                  <></>
                ) : (
                  <div>
                    <NavLink
                      to="/"
                      className="fa nav-link text-white btn btn-success m-2"
                    >
                      <i className="fa fa-home fa-fw"></i>HOME
                    </NavLink>
                  </div>
                )}
                {userLoginStatus ? (
                  <>
                    <div>
                      <NavLink
                        to="/adminpage"
                        className="fa text-white nav-link btn btn-success m-2"
                      >
                        <i className="fa fa-sign-in fa-fw "></i>
                        ADMINPAGE
                      </NavLink>
                    </div>
                    <div>
                      <NavLink
                        to="/admin-login"
                        className="fa text-white nav-link btn btn-success m-2"
                        onClick={logoutUser}
                      >
                        <i className="fa fa-sign-in fa-fw "></i>
                        LOGOUT
                      </NavLink>
                    </div>
                  </>
                ) : (
                  <div>
                    <NavLink
                      to="/admin-login"
                      className="fa text-white nav-link btn btn-success m-2"
                    >
                      <i className="fa fa-user fa-fw "></i>ADMIN-LOGIN
                    </NavLink>
                  </div>
                )}
                {userLoginStatus ? (
                  <></>
                ) : (
                  <div>
                    <NavLink
                      to="/contactus"
                      className="fa nav-link text-white btn btn-success m-2"
                    >
                      <i className="fa fa-home fa-fw"></i>CONTACT US
                    </NavLink>
                  </div>
                )}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      ))}
    </animated.div>
  );
}

export default NavigationBar;
