import React from 'react';
import { Link, NavLink } from 'react-router-dom';
function Home() {
  return (
    <>
      {/* <div className="p-4 text-white "> */}
      <div className="p-2">
        <h1 className=" p-2 text-center display-5">Faculty Information System</h1>
        < hr />
        <div className='row'>
          <div className='col-lg-8  col-sm-12 '>
            <img
              src="media/home.png"
              typeof="image"
              alt="Card"
              width="100%" height="100%"
            />

          </div>
          <div className='col-lg-4 col-sm-12 menu p-3'>
            <h1 className="p-3 text-center display-5">WELCOME!!!</h1>
            <ul>
              <Link to="/classtt"><li><i className="fa fa-book"></i><NavLink className="fw-bold fs-5" to="/classtt">CLASS TIME TABLES</NavLink></li></Link>
              <Link to="/facultytt"><li><i className="fa fa-graduation-cap"></i><NavLink className="fw-bold fs-5 text-decoration-none" to="/facultytt">FACULTY TIME TABLES</NavLink></li></Link>
              <Link to="/freehours"><li><i className="fa fa-address-book"></i><NavLink className="fw-bold fs-5 text-decoration-none" to="/freehours">FREE HOURS</NavLink></li></Link>
              <Link to="/admin-login"><li><i className="fa fa-user"></i><NavLink className="fw-bold fs-5 text-decoration-none" to="/admin-login">ADMIN LOGIN</NavLink></li></Link>
              <Link to="https://vnrvjiet.ac.in/"><li><i className="fa fa-paper-plane"></i><NavLink className="fw-bold fs-5 text-decoration-none" to="https://vnrvjiet.ac.in/">VISIT VNR</NavLink></li></Link> 
            </ul>
          </div>
        </div>
      </div>
    </>
  )
}

export default Home