import React from 'react'
import { Outlet } from 'react-router-dom'
import NavigationBar from '../components/Navbar/NavigationBar'
import Footer from '../components/Footer/Footer'
import './RootLayout.css'
function RouteLayout() {
  return (
      <div>
          <div className="content-container rot">
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