import React from 'react'
import { loginContext } from "../../../contexts/loginContext";
import { useContext } from "react";
import SuperAdmin from './SuperAdmin';
import Admin from './Admin';
import { useSpring,animated } from 'react-spring';
function AdminAccess() {
  const [currentUser, , , ,] = useContext(loginContext);
  const fadeOutSlideUpAnimation = useSpring({
    to: async (next) => {
      await next({ opacity: 1, transform: "translateY(0px)" });
    },
    from: { opacity: 0, transform: "translateY(-20px)" },
    config: { duration: 700 },
  });

    return (
      <animated.div style={fadeOutSlideUpAnimation} className='text-white container p-5'>
        {currentUser.type === "super-admin" ? (
          <div>
            <Admin />
            <SuperAdmin />
          </div>
        ) : currentUser.type === "admin" ? (
          <Admin />
        ) : (
          <div>
            <h1>User is not an Admin/Super Admin</h1>
          </div>
        )}
      </animated.div>
    );
  }

  export default AdminAccess;