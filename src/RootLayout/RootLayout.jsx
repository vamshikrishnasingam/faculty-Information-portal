import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useSpring, animated } from "react-spring";
import NavigationBar from "../components/Navbar/NavigationBar";
import Footer from "../components/Footer/Footer";
import "./RootLayout.css";

function RouteLayout() {
  const [designData, setDesignData] = useState(null);
  const [loading, setLoading] = useState(true);

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
        <div className="loader-container">
          <div className="loading-dots">
            <div className="loading-dot"></div>
            <div className="loading-dot"></div>
            <div className="loading-dot"></div>
          </div>
        </div>
      ) : (
        // Render content once data is loaded
        <div className="content-container rot">
          <NavigationBar />
          <div>
            {/* Render your components based on designData */}
            <Outlet />
          </div>
        </div>
      )}
      <div className="footer-container">
        <Footer />
      </div>
    </animated.div>
  );
}

export default RouteLayout;
