import React from "react";
import { useSpring, animated } from "react-spring";
import Carousel from "react-bootstrap/Carousel";
import Accordion from "react-bootstrap/Accordion";
import ListGroup from "react-bootstrap/ListGroup";
import { useState, useEffect } from "react";
function Home() {
  const fadeIn = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    config: { duration: 1000 },
  });
  const textProps = useSpring({
    from: { width: "50%", color: "white" },
    to: { width: "100%", color: "blue" },
    config: { duration: 200 },
  });
  const [isVisible, setIsVisible] = useState(true);
  const welcomeAnimation = useSpring({
    opacity: isVisible ? 1 : 0.1,
  });

  useEffect(() => {
    const intervalId = setInterval(() => {
      setIsVisible(!isVisible);
    }, 500); // Adjust the interval based on your preference

    return () => clearInterval(intervalId);
  }, [isVisible]);

  const [val, setval] = useState('');
  const handleChange = () => {
    // Check if the accordion is already open
    if (val === 1) {
      // If it is open, set the value to 0
      setval(0);
    } else {
      // If it is not open, set the value to 1
      setval(1);
    }
  };
  const slideIn = useSpring({
     transform: "translateX(0%)",
     from: { transform: "translateX(-100%)" },
     config: { duration: 800 },
   });


  return (
    <animated.div style={fadeIn}>
      <div className="p-3 m-1">
        <animated.h1
          style={welcomeAnimation}
          className="fw-bold text-center text-white display-5 p-1"
        >
          Welcome to Faculty Information System!!!
        </animated.h1>
        <div className="row">
          <animated.div className="col-sm-12">
            <hr />
            <animated.h1
              style={welcomeAnimation}
              className="mt-1 mb-4 text-center text-white display-6 fw-bold"
            ></animated.h1>
            <Carousel>
              <Carousel.Item interval={10000}>
                <animated.div style={textProps}>
                  <animated.div style={fadeIn} className="col-sm-12 mx-auto">
                    <div>
                      <img
                        src="media/home.png"
                        typeof="image"
                        alt="Card"
                        width="100%"
                        height="450px"
                        className="image1"
                      />
                    </div>
                  </animated.div>
                </animated.div>
              </Carousel.Item>
              <Carousel.Item interval={1000}>
                <img
                  src="media/caur2.jpg"
                  typeof="image"
                  alt="Card"
                  width="100%"
                  height="450px"
                  className="image1"
                />
              </Carousel.Item>
              <Carousel.Item interval={1000}>
                <img
                  src="media/CSE_image.png"
                  typeof="image"
                  alt="Card"
                  width="100%"
                  height="450px"
                  className="image1"
                />
              </Carousel.Item>
            </Carousel>
          </animated.div>
          {/* <animated.div
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
          </animated.div> */}
        </div>
        <animated.div className="text-white marquee">
          <div className="marquee-container">
            <div className="marquee-content d-flex">
              <div className="divele">
                <img
                  src="media/home.png"
                  typeof="image"
                  alt="Card"
                  width="200px"
                  height="200px"
                  className="m-2"
                />
                <img
                  src="media/navbg2.jpg"
                  typeof="image"
                  alt="Card"
                  width="200px"
                  height="200px"
                  className="m-2"
                />
                <img
                  src="media/navbg.jpg"
                  typeof="image"
                  alt="Card"
                  width="200px"
                  height="200px"
                  className="m-2"
                />
              </div>
              <div className="divele">
                <img
                  src="media/CSE_image.png"
                  typeof="image"
                  alt="Card"
                  width="200px"
                  height="200px"
                  className="m-2"
                />
                <img
                  src="media/caur2.jpg"
                  typeof="image"
                  alt="Card"
                  width="200px"
                  height="200px"
                  className="m-2"
                />
                <img
                  src="media/bodyBackground.avif"
                  typeof="image"
                  alt="Card"
                  width="200px"
                  height="200px"
                  className="m-2"
                />
              </div>
              <div className="divele">
                <img
                  src="media/caur1.jpg"
                  typeof="image"
                  alt="Card"
                  width="200px"
                  height="200px"
                  className="m-2"
                />
                <img
                  src="media/navbg3.avif"
                  typeof="image"
                  alt="Card"
                  width="200px"
                  height="200px"
                  className="m-2"
                />
                <img
                  src="media/navbg3jpg.jpg"
                  typeof="image"
                  alt="Card"
                  width="200px"
                  height="200px"
                  className="m-2"
                />
                <img
                  src="media/home.png"
                  typeof="image"
                  alt="Card"
                  width="200px"
                  height="200px"
                  className="m-2"
                />
              </div>
            </div>
          </div>
        </animated.div>
      </div>
    </animated.div>
  );
}

export default Home;
