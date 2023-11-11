import React from 'react'
import NavigationBar from './components/Navbar/NavigationBar';
import Footer from './components/Footer/Footer';
import { BrowserRouter as Router} from 'react-router-dom';
import AnimatedRoutes from './AnimatedRoutes';
function AppRoutes() {
    return (
        <Router>
            <div className="content-container">
                <NavigationBar />
            </div>
            <div className='container'>
                <AnimatedRoutes/>
            </div>
            <div className="footer-container">
                <Footer />
            </div>
        </Router>
    )
}

export default AppRoutes