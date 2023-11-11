/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Outlet } from 'react-router-dom'

function FacultyTimeTable() {
  return (
      <div className='row p-4'>
        <div class="col-sm-10 mx-auto col-lg-4 col-md-6 menu">
          <ul>
            <Link to=""><li><i class="fa fa-user"></i><NavLink className="fs-5 fw-bold" to="professors">PROFESSORS</NavLink></li></Link>
            <Link to=""><li><i class="fa fa-book"></i><NavLink className="fs-5 fw-bold" to="assistentprofessors">ASSISTENT PROFESSORS</NavLink></li></Link>
            <Link to=""><li><i class="fa fa-question-circle"></i> <NavLink className="fs-5 fw-bold" to="associateprofessors">ASSOCIATE PROFESSORS</NavLink></li></Link>
            <Link to=""><li><i class="fa fa-question-circle"></i><NavLink className="fw-bold fs-5" to="h&sdept">H&S DEPARTMENT</NavLink></li></Link>
            <Link to=""><li><i class="fa fa-users"></i><NavLink className="fw-bold fs-5" to="others">OTHERS</NavLink></li></Link>
            <Link to="facultytt"><li><i class="fa fa-question-circle"></i><NavLink className="fw-bold fs-5" to="replace">REPLACE FACULTY</NavLink></li></Link>
            <Link to="others"><li><i class="fa fa-user"></i><NavLink className="fw-bold fs-5" to="others">SEARCH</NavLink></li></Link>
            <Link to="/"><li><i class="fa fa-sign-out"></i><NavLink className="fw-bold fs-5" to="/">GOBACK</NavLink></li></Link>
          </ul>
        </div>
      <div className='col-lg-8 col-md-6 p-4'>
          <Outlet />
        </div>
      </div>
  )
}

export default FacultyTimeTable