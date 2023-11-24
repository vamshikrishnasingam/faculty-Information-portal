import React, { useState } from 'react'
import Button from "react-bootstrap/Button";
import { useSpring,animated } from 'react-spring';
const ReplaceFaculty = () => {
  const [searchId, setSearchId] = useState('')
   const fadeOutSlideUpAnimation = useSpring({
     to: async (next) => {
       await next({ opacity: 1, transform: "translateY(-10px)" });
     },
     from: { opacity: 0, transform: "translateY(20px)" },
     config: { duration: 700 },
   });


  return (
    <animated.div style={fadeOutSlideUpAnimation} className="container p-5">
      <h1 className="text-white text-center">
        Please enter FacultyID for their Time Tables!!!
      </h1>
      <hr />
      <div className="row">
        <div className="col-lg-3 col-sm-7 p-2">
          <input
            className="form-control me-2"
            type="text"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            placeholder="Enter ID"
          />
        </div>
        <div className="col-lg-3 col-sm-5 p-2">
          <Button className="btn btn-success w-50" type="submit" onClick={1}>
            search
          </Button>
        </div>
      </div>
    </animated.div>
  );
}

export default ReplaceFaculty