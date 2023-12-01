import React, { useState } from "react";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import "./SideNav.css";
import { Link, NavLink, Outlet } from "react-router-dom";
import { loginContext } from "../../contexts/loginContext";
import { useSpring,animated } from "react-spring";
import { useContext } from "react";
const SideNav = () => {
  let [, , userLoginStatus, , logoutUser] = useContext(loginContext);
  const [collapsed, setCollapsed] = useState(false);

  const handleToggleSidebar = () => {
    setCollapsed(!collapsed);
  };
   const fadeInFromLeftAnimation = useSpring({
     to: { opacity: 1, transform: "translateX(0px)" },
     from: { opacity: 0, transform: "translateX(-20px)" },
     config: { duration: 500 },
   });
  
   const animationProps = useSpring({
    from: { opacity: 0, transform: "translateY(-30px)" },
    to: { opacity: 1, transform: "translateY(0)" },
    config: { duration: 300 },
  });

  return (
    <animated.div style={fadeInFromLeftAnimation} id="app1">
      <Sidebar
        // backgroundColor="rgba(146, 57, 147, 0.3)"
        collapsed={collapsed}
        className="side-nav border border-3 m-3"
        backgroundColor=""
      >
        <Menu>
          <div>
            <MenuItem
              icon={<MenuOutlinedIcon />}
              onClick={handleToggleSidebar}
              className="fw-bold text-col mt-4"
            >
              <h2>Welcome</h2>
            </MenuItem>
            <hr />
          </div>
          <MenuItem icon={<Link className="text-col fa fa-home"></Link>}>
            {userLoginStatus ? (
              <Link className="link" to="">
                <li>
                  <NavLink className="fw-bold fs-5 link text-col" to="">
                    ADMIN HOME
                  </NavLink>
                </li>
              </Link>
            ) : (
              <Link className="link" to="">
                <li>
                  <NavLink className="fw-bold fs-5 link text-col" to="">
                    HOME
                  </NavLink>
                </li>
              </Link>
            )}
          </MenuItem>
          <MenuItem
            icon={
              <Link className="fw-bold text-col fa fa-book" to="classtt"></Link>
            }
          >
            <Link className="link" to="classtt">
              <li>
                <NavLink className="fw-bold fs-5 link text-col" to="classtt">
                  CLASS TIME TABLES
                </NavLink>
              </li>
            </Link>
          </MenuItem>
          <MenuItem
            icon={
              <Link
                className="text-col fa fa-graduation-cap "
                to="facultytt"
              ></Link>
            }
          >
            <Link className="link" to="facultytt">
              <li>
                <NavLink className="fw-bold fs-5 link text-col" to="facultytt">
                  FACULTY TIME TABLES
                </NavLink>
              </li>
            </Link>
          </MenuItem>
          <MenuItem
            icon={<Link className="text-col fa fa-users" to="fac-list"></Link>}
          >
            <Link className="link" to="fac-list">
              <li>
                <NavLink className="fw-bold fs-5 link text-col" to="fac-list">
                  FACULTY LIST
                </NavLink>
              </li>
            </Link>
          </MenuItem>
          <MenuItem
            icon={
              <Link
                className="text-col fa fa-address-book"
                to="freehours"
              ></Link>
            }
          >
            <Link className="link" to="freehours">
              <li>
                <NavLink className="fw-bold fs-5 link text-col" to="freehours">
                  FREEHOURS
                </NavLink>
              </li>
            </Link>
          </MenuItem>
          <MenuItem
            icon={<Link className="text-col fa fa-file" to="history"></Link>}
          >
            <Link className="link" to="history">
              <li>
                <NavLink className="fw-bold fs-5 link text-col" to="history">
                  HISTORY
                </NavLink>
              </li>
            </Link>
          </MenuItem>
          {!userLoginStatus ? (
            <MenuItem
              icon={
                <Link
                  className="text-col fa fa-paper-plane"
                  to="https://vnrvjiet.ac.in/"
                ></Link>
              }
            >
              <Link className="link" to="https://vnrvjiet.ac.in/">
                <li>
                  <NavLink
                    className="fw-bold fs-5 link text-col"
                    to="https://vnrvjiet.ac.in/"
                  >
                    VISIT VNR
                  </NavLink>
                </li>
              </Link>
            </MenuItem>
          ) : (
            <></>
          )}
          {userLoginStatus ? (
            <>
              <SubMenu
                icon={<Link className="text-col fa fa-filter"></Link>}
                className="fw-bold  fs-5 link text-col"
                label="UPDATE"
              >
                <MenuItem
                  icon={
                    <Link
                      className="text-col fa fa-filter"
                      to="/fac-update"
                    ></Link>
                  }
                >
                  <Link className="link" to="fac-update">
                    <li>
                      <NavLink
                        className="fw-bold  fs-5 link text-col"
                        to="fac-update"
                      >
                        FACULTY UPDATE
                      </NavLink>
                    </li>
                  </Link>
                </MenuItem>
                <MenuItem
                  icon={
                    <Link className="text-col fa fa-filter" to="update"></Link>
                  }
                >
                  <Link className="link" to="update">
                    <li>
                      <NavLink
                        className="fw-bold  fs-5 link text-col"
                        to="update"
                      >
                        UPDATE
                      </NavLink>
                    </li>
                  </Link>
                </MenuItem>
                {/* <MenuItem
                  icon={
                    <Link
                      className="text-col fa fa-filter"
                      to="fac-replace"
                    ></Link>
                  }
                >
                  <Link className="link" to="fac-replace">
                    <li>
                      <NavLink
                        className="fw-bold  fs-5 link text-col"
                        to="fac-replace"
                      >
                        Replace Faculty
                      </NavLink>
                    </li>
                  </Link>
                </MenuItem> */}
              </SubMenu>
              <MenuItem
                icon={
                  <Link
                    className="text-col fa fa-user-secret"
                    to="admin-access"
                  ></Link>
                }
              >
                <Link className="link" to="admin-access">
                  <li>
                    <NavLink
                      className="fw-bold fs-5 link text-col"
                      to="admin-access"
                    >
                      ADMIN-ACCESS
                    </NavLink>
                  </li>
                </Link>
              </MenuItem>
            </>
          ) : (
            <></>
          )}
        </Menu>
      </Sidebar>
    </animated.div>
  );
};

export default SideNav;
