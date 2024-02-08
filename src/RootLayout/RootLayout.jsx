import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useSpring, animated } from "react-spring";
import NavigationBar from "../components/Navbar/NavigationBar";
import Footer from "../components/Footer/Footer";
import "./RootLayout.css";
import { SpinnerDotted } from "spinners-react";
import { ToastContainer } from "react-toastify";


function RouteLayout() {
  const [designData, setDesignData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const figmaFileKey = "your-figma-file-key"; // Replace with your Figma file key
        const figmaAccessToken = "your-figma-access-token"; // Replace with your Figma access token
        const response = await fetch(
          `https://api.figma.com/v1/files/${figmaFileKey}`,
          {
            headers: {
              "X-Figma-Token": figmaAccessToken,
            },
          }
        );
        const data = await response.json();
        setDesignData(data);
        setLoading(false); // Set loading to false once data is fetched
      } catch (error) {
        console.error("Error fetching Figma data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <animated.div>
      {loading ? (
        // Show loader while data is being fetched
        // <div className="loader-container">
        //   <div className="loading-dots">
        //     <div className="loading-dot"></div>
        //     <div className="loading-dot"></div>
        //     <div className="loading-dot"></div>
        //   </div>
        // </div>
        <div className="containerloading text-center">
          <SpinnerDotted speed={140} thickness={300} enabled={true} />
        </div>
      ) : (
        // Render content once data is loaded
        <div className="content-container rot">
          <div>
              <NavigationBar/>

          </div>
          <div className="page">
            {/* Render your components based on designData */}
            <Outlet />
          </div>
          {/* <div className="footer-container">
            <Footer />
          </div> */}
        </div>
      )}
    </animated.div>
  );
}

export default RouteLayout;
