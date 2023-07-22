import React from 'react'
import { Outlet } from 'react-router-dom'
import NavigationBar from '../components/Navbar/NavigationBar'
import Footer from '../components/Footer/Footer'
function RouteLayout() {
  return (
      <div>
          <div className="content-container">
            <NavigationBar />
            <div className='container'>
                <Outlet/>
            </div>
          </div>
          <div className="footer-container">
            <Footer />
          </div>
    </div>
  )
}
export default RouteLayout