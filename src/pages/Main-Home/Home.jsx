import React from "react";
import { Link, NavLink } from "react-router-dom";
import { useSpring, animated } from "react-spring";
import Carousel from "react-bootstrap/Carousel";
function Home() {
  const fadeIn = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    config: { duration: 1000 },
  });

  const slideIn = useSpring({
    transform: "translateX(0%)",
    from: { transform: "translateX(-100%)" },
    config: { duration: 800 },
  });

  const scaleHeading = useSpring({
    transform: "scale(1)",
    from: { transform: "scale(0.9)" },
    config: { duration: 600 },
  });

  const scaleMenu = useSpring({
    to: { transform: "scale(1)" },
    from: { transform: "scale(0.9)" },
    config: { duration: 600 },
  });

  return (
    <animated.div style={fadeIn}>
      <div className="p-2">
        <animated.h1
          style={{ ...scaleHeading }}
          className="p-2 text-center display-5"
        >
          Faculty Information System
        </animated.h1>
        <hr />
        <div className="row">
          <animated.div style={fadeIn} className="col-lg-8 col-sm-12">
            <Carousel>
              <Carousel.Item interval={2000}>
                <img
                  src="media/home.png"
                  typeof="image"
                  alt="Card"
                  width="100%"
                  height="100%"
                />
                <Carousel.Caption>
                  <h3>Faculty Information System</h3>
                  <p>Welcome to FIS Vnrvjiet. </p>
                </Carousel.Caption>
              </Carousel.Item>
              <Carousel.Item interval={2000}>
                <img
                  src="media/home.png"
                  typeof="image"
                  alt="Card"
                  width="100%"
                  height="100%"
                />
                <Carousel.Caption>
                  <h3>Faculty Information System</h3>
                  <p>Welcome to FIS Vnrvjiet.</p>
                </Carousel.Caption>
              </Carousel.Item>
              <Carousel.Item interval={2000}>
                <img
                  src="media/home.png"
                  typeof="image"
                  alt="Card"
                  width="100%"
                  height="100%"
                />
                <Carousel.Caption>
                  <h3>Faculty Information System</h3>
                  <p>Welcome to FIS Vnrvjiet</p>
                </Carousel.Caption>
              </Carousel.Item>
            </Carousel>
          </animated.div>
          <animated.div
            style={{ ...slideIn, ...scaleMenu }}
            className="col-lg-4 col-sm-12 menu p-3"
          >
            <h1 className="p-3 text-center display-5">WELCOME!!!</h1>
            <ul>
              <Link to="/classtt">
                <li>
                  <animated.i className="fa fa-book"></animated.i>
                  <NavLink className="fw-bold fs-5" to="/classtt">
                    CLASS TIME TABLES
                  </NavLink>
                </li>
              </Link>
              <Link to="/facultytt">
                <li>
                  <animated.i className="fa fa-graduation-cap"></animated.i>
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
                  <animated.i className="fa fa-book"></animated.i>
                  <NavLink className="text fw-bold fs-5" to="/fac-list">
                    FACULTY LIST
                  </NavLink>
                </li>
              </Link>
              <Link to="/freehours">
                <li>
                  <animated.i className="fa fa-address-book"></animated.i>
                  <NavLink
                    className="fw-bold fs-5 text-decoration-none"
                    to="/freehours"
                  >
                    FREE HOURS
                  </NavLink>
                </li>
              </Link>
              <Link to="/history">
                <li>
                  <animated.i className="fa fa-users"></animated.i>
                  <NavLink
                    className="fw-bold fs-5 text-decoration-none"
                    to="/history"
                  >
                    HISTORY
                  </NavLink>
                </li>
              </Link>
              <Link to="https://vnrvjiet.ac.in/">
                <li>
                  <animated.i className="fa fa-paper-plane"></animated.i>
                  <NavLink
                    className="fw-bold fs-5 text-decoration-none"
                    to="https://vnrvjiet.ac.in/"
                  >
                    VISIT VNR
                  </NavLink>
                </li>
              </Link>
            </ul>
          </animated.div>
        </div>
      </div>
    </animated.div>
  );
}

export default Home;
