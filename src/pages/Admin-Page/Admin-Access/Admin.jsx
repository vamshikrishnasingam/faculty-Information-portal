import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loginContext } from "../../../contexts/loginContext";
import { useNavigate } from "react-router-dom";
import { Button, Form } from "react-bootstrap";

function Admin() {
  const [userDetails, setUserDetails] = useState({});
  const [editing, setEditing] = useState(true); // State to track whether the user is in editing mode
  const [refresh, setRefresh] = useState(true);
  const [currentUser, , , , logoutUser] = useContext(loginContext);
  const [loading, setLoading] = useState(true);

  // Use the useNavigate hook to get the navigate function
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user details from the server
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:5000/user-api/get-user-info", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        // Add the new field 'newusername' and set it to the current username
        const userDetailsWithNewUsername = {
          ...response.data.payload,
          newusername: response.data.payload.username,
          oldusertype: response.data.payload.type,
        };
        setUserDetails(userDetailsWithNewUsername);
      })
      .catch((error) => {
        console.error("Error fetching user details:", error);
      });
  }, [refresh]);

  const handleEdit = () => {
    setEditing(!editing);
  };

  const handleSaveChanges = async () => {
    try {
      // Perform save changes logic
      setLoading(true);
      console.log("Save changes:", userDetails);

      // Example: You may want to send an API request to update user data
      const token = localStorage.getItem("token");
      let response=await axios.put("http://localhost:5000/user-api/update", userDetails, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((res)=>{  
        setLoading(false);
      }).catch((err)=>{

      });
      // Notify the user about the success
      toast.success("Changes saved successfully", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      if (userDetails.newusername !== userDetails.username) {
        // Notify the user about the success
        toast.error("Username Change Detected", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });

        toast.error("Please Login again", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });

        // Delay for 3 seconds before logging out and navigating
        setTimeout(() => {
          logoutUser();
          navigate("../admin-login");
        }, 3000);
      }

      setRefresh(!refresh);

      // Exit edit mode after saving changes
      setEditing(!editing);

      if (userDetails.type !== currentUser.type) {
        toast.error("User Type modified", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        navigate("/adminpage/admin-access")
        setTimeout(() => {}, 4000);
      }
    } catch (error) {
      console.error("Error saving changes:", error);

      // Notify the user about the failure
      toast.error("Error saving changes", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  const navigateToResetPassword = () => {
    // Navigate to the reset-password page
    navigate("/reset-password");
  };

  return (
    <div className="p-1">
      <h2 className="m-1">Welcome, {userDetails.username}!</h2>
      <hr />
      <div className="p-2">
        <h2>Your Details</h2>

        {editing ? (
          <>
            <div className="p-2">
              <p>
                <strong>Username:</strong> {userDetails.username}
              </p>
              <p>
                <strong>Email:</strong> {userDetails.email}
              </p>
              {userDetails.oldusertype === "super-admin" && (
                <p>
                  <strong>Type:</strong> {userDetails.type}
                </p>
              )}
            </div>
            <div className="p-2">
              <Button className="btn btn-success" onClick={handleEdit}>
                Edit Details
              </Button>
            </div>
          </>
        ) : (
          <div className="row">
            <div className="col-lg-3 col-sm-12 col-md-4 p-3">
              <label htmlFor="username">Username:</label>
              <input
                type="text"
                id="username"
                className="search-input form-control me-2"
                placeholder="Username"
                value={userDetails.newusername}
                onChange={(e) =>
                  setUserDetails({
                    ...userDetails,
                    newusername: e.target.value,
                  })
                }
              />
            </div>
            <div className="col-lg-3 col-sm-12 col-md-4 p-3">
              <label htmlFor="email">Email:</label>
              <input
                type="text"
                id="email"
                className="search-input form-control me-2"
                placeholder="Email"
                value={userDetails.email}
                onChange={(e) =>
                  setUserDetails({ ...userDetails, email: e.target.value })
                }
              />
            </div>
            <div className="col-lg-3 col-sm-12 col-md-4 p-3">
              {userDetails.oldusertype === "super-admin" && (
                <div>
                  <label htmlFor="type">Type:</label>
                  <div>
                    <Form.Select
                      id="type"
                      value={userDetails.type}
                      onChange={(e) =>
                        setUserDetails({ ...userDetails, type: e.target.value })
                      }
                    >
                      <option value="admin">Admin</option>
                      <option value="super-admin">Super Admin</option>
                    </Form.Select>
                  </div>
                </div>
              )}
            </div>
            <div className="col-lg-2 p-4 m-3">
              <Button className="btn btn-success" onClick={handleSaveChanges}>
                Save Changes
              </Button>
            </div>
          </div>
        )}
      </div>
      <div className="p-3">
        <Button className="btn btn-success" onClick={navigateToResetPassword}>
          Change Password
        </Button>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Admin;