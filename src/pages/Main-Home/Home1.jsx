import React from 'react'
import SideNav from '../../components/SideNav/SideNav';
import { Outlet } from 'react-router';
import "./Home1.css"
import { useSpring,animated } from 'react-spring';
function Home1() {
  const fadeInFromLeftAnimation = useSpring({
  to: { opacity: 1, transform: 'translateX(0px)' },
  from: { opacity: 0, transform: 'translateX(-20px)' },
  config: { duration: 500 },
});
const fadeInScaleUpAnimation = useSpring({
  to: { opacity: 1, transform: "scale(1)" },
  from: { opacity: 0, transform: "scale(0.8)" },
  config: { duration: 600 },
});

  return (
    <animated.div style={fadeInScaleUpAnimation}>
      <div className="d-flex">
        <div className="sidebar">
          <SideNav/>
        </div>
        <div className="page" >
          <Outlet/>
        </div>
      </div>
    </animated.div>
  );
}

export default Home1