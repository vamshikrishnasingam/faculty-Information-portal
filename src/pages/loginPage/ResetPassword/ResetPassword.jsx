import React, { useState, useContext } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "react-bootstrap";
import { loginContext } from "../../../contexts/loginContext";
import { useNavigate } from "react-router-dom";

function ResetPassword() {
  //for changing password
  const [oldPassword, setOldPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  //for forgot password
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  //common for both reset and change
  const [newPassword, setNewPassword] = useState("");
  const [currentUser, , userLoginStatus, ,] = useContext(loginContext);
  const [step, setStep] = useState(1); // Track the current step
  // Use the useNavigate hook to get the navigate function
  const navigate = useNavigate();

  //for changing password
  const handlePasswordChange = async () => {
    try {
      // Perform password change logic
      // console.log(
      //   "Change password:",
      //   oldPassword,
      //   newPassword,
      //   confirmNewPassword
      // );

      // Example: You may want to send an API request to change the password
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/user-api/change-password/${currentUser.username}`,
        {
          oldPassword,
          newPassword,
          confirmNewPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Clear the password fields after changing the password
      setOldPassword("");
      setNewPassword("");
      setConfirmNewPassword("");

      // Notify the user about the success
      toast.success("Password changed successfully", {
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
    } catch (error) {
      console.error("Error changing password:", error);

      // Notify the user about the failure
      toast.error("Error changing password", {
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

  //for forgot password
  const handleForgotPassword = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/user-api/reset-password",
        { username }
      );
      toast.success(response.data.message);
      setStep(2);
    } catch (error) {
      console.error("Error initiating password reset:", error);
      toast.error("Error initiating password reset");
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/user-api/verify-otp",
        { username, otp }
      );
      toast.success(response.data.message);
      setStep(3); // Move to the next step (enter new password)
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.error("Error verifying OTP");
    }
  };

  const handleResetPassword = async () => {
    try {
      const response = await axios.put(
        `http://localhost:5000/user-api/change-password-with-otp/${currentUser.username}`,
        { newPassword }
      );
      toast.success(response.data.message);
      setTimeout(() => {
        navigate("/admin-login");
      }, 2000);
    } catch (error) {
      console.error("Error changing password with OTP:", error);
      toast.error("Error changing password with OTP");
    }
  };

  const handleForgotUsername = async () => {
    setStep(4);
  };

  const handleSendUsernameOnEmail = async () => {
    try {
      // Perform logic to retrieve the username based on other user details
      // For example, send a request to the server to get the username associated with the provided email
      const response = await axios.post(
        "http://localhost:5000/user-api/forgot-username",
        { email }
      );
      toast.success(response.data.message);
      setTimeout(() => {
        setStep(1);
      }, 1500);
    } catch (error) {
      console.error("Error retrieving username:", error);
      toast.error("Error retrieving username");
    }
  };

  return (
    <div className="container">
      {userLoginStatus ? (
        <div className="row p-5">
          <h2 className="fw-bold text-white text-center mb-4">
            Change Password
          </h2>
          <hr />
          <div className="row m-2">
            <div className="col-lg-4 col-sm-12 col-md-12">
              <label className="text-white p-2" htmlFor="oldPassword">
                Old Password:
              </label>
              <input
                type="password"
                id="oldPassword"
                placeholder="Old Password"
                className="search-input form-control me-2"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
            </div>
            <div className="col-lg-4 col-sm-12 col-md-12">
              <label className="text-white p-2" htmlFor="newPassword">
                New Password:
              </label>
              <input
                type="password"
                id="newPassword"
                placeholder="New Password"
                className="search-input form-control me-2"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="col-lg-4 col-sm-12 col-md-12">
              <label className="text-white p-2" htmlFor="confirmNewPassword">
                Confirm New Password:
              </label>
              <input
                type="password"
                id="confirmNewPassword"
                className="search-input form-control me-2"
                placeholder="Confirm New Password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
              />
            </div>
          </div>
          <div className="row mx-auto">
            <div className="col-lg-3 col-sm-12 col-md-6 p-4">
              <Button
                className="btn btn-success text-white"
                onClick={handlePasswordChange}
              >
                Change Password
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="container m-3">
          {step !== 4 && <h2 className="text-white p-3">Reset Password</h2>}
          {step === 1 && (
            <div className="m-2">
              <label className="text-white p-2" htmlFor="username">
                Username:
              </label>
              <div className="row ">
                <div className="col-lg-4 col-sm-12 col-md-5 m-2">
                  <input
                    type="text"
                    id="username"
                    className="search-input form-control me-2"
                    placeholder="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className="col-lg-3 col-md-6 col-sm-12 m-2">
                  <Button
                    className="btn btn-success text-white"
                    onClick={handleForgotPassword}
                  >
                    Reset Password
                  </Button>
                </div>
              </div>
              <hr />
              <div className="m-2">
                <div className="row">
                  <div className="col-lg-4 col-sm-6 col-md-6 p-2">
                    <h2 className="text-white ">Forgot Username?</h2>
                  </div>
                  <div className="col-lg-4 col-sm-6 col-md-6 m-2">
                    <Button
                      className="btn btn-info text-white w-50"
                      onClick={handleForgotUsername}
                    >
                      Click here
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="m-2">
              <h1 className="text-white">Forgot Username?</h1>
              <label className="text-white fw-bold fs-5 p-2" htmlFor="email">
                Email:
              </label>
              <div className="row">
                <div className="col-lg-4 col-sm-6 col-md-6 m-2">
                  <input
                    type="text"
                    id="email"
                    placeholder="Email"
                    className="search-input form-control me-2"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="col-lg-4 col-sm-6 col-md-6 m-2">
                  <Button
                    className="btn btn-success"
                    onClick={handleSendUsernameOnEmail}
                  >
                    Send Username
                  </Button>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="m-2">
              <label htmlFor="otp" className="text-white fw-bold fs-5 p-2">
                Enter OTP:
              </label>
              <div className="col-lg-4 col-sm-6 col-md-6 m-2">
                <input
                  type="text"
                  id="otp"
                  placeholder="OTP"
                  className="search-input form-control me-2"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              </div>
              <div className="col-lg-4 col-sm-6 col-md-6 p-2">
                <Button className="btn btn-success" onClick={handleVerifyOtp}>
                  Verify OTP
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="m-2">
              <label
                htmlFor="newPassword"
                className="text-white fw-bold fs-5 p-2"
              >
                New Password:
              </label>
              <div className="row">
                <div className="col-lg-4 col-sm-6 col-md-6 m-2">
                  <input
                    type="password"
                    id="newPassword"
                    className="search-input form-control me-2"
                    placeholder="Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-lg-4 col-sm-6 col-md-6 m-2">
                <Button
                  className="btn btn-success"
                  onClick={handleResetPassword}
                >
                  Change Password
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
      <ToastContainer />
    </div>
  );
}

export default ResetPassword;
