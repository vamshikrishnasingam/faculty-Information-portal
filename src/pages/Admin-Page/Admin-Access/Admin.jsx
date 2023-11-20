import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { loginContext } from "../../../contexts/loginContext";
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';

function Admin() {
  const [userDetails, setUserDetails] = useState({});
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [editing, setEditing] = useState(true); // State to track whether user is in editing mode
  const [refresh, setRefresh] = useState(true);
  let [currentUser, , , , logoutUser] = useContext(loginContext)
  // Use the useNavigate hook to get the navigate function
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user details from the server
    const token = localStorage.getItem('token');
    axios.get('http://localhost:5000/user-api/get-user-info', {
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
      .catch(error => {
        console.error('Error fetching user details:', error);
      });
  }, [refresh]);

  const handlePasswordChange = async () => {
    try {
      // Perform password change logic
      console.log('Change password:', oldPassword, newPassword, confirmNewPassword);

      // Example: You may want to send an API request to change the password
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/user-api/change-password/${userDetails.username}`,
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
      setOldPassword('');
      setNewPassword('');
      setConfirmNewPassword('');

      // Notify the user about the success
      toast.success('Password changed successfully', {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
    } catch (error) {
      console.error('Error changing password:', error);

      // Notify the user about the failure
      toast.error('Error changing password', {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
    }
  };

  const handleEdit = () => {
    setEditing(!editing);
  };

  const handleSaveChanges = async () => {
    try {
      // Perform save changes logic
      console.log('Save changes:', userDetails);

      // Example: You may want to send an API request to update user data
      const token = localStorage.getItem('token');
      await axios.put(
        'http://localhost:5000/user-api/update',
        userDetails,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Notify the user about the success
      toast.success('Changes saved successfully', {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });

      if (userDetails.newusername !== userDetails.username) {
        // Notify the user about the success
        toast.error('Username Change Detected', {
          position: 'top-center',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
        });

        toast.error('Please Login again', {
          position: 'top-center',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
        });

        // Delay for 4 seconds before logging out and navigating
        setTimeout(() => {
          logoutUser();
          navigate('../admin-login');
        }, 4000);
      }

      if (userDetails.type != currentUser.type) {
        toast.error('User Type modified', {
          position: 'top-center',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
        });
        setTimeout(() => {

        }, 4000);
      }

      setRefresh(!refresh)

      // Exit edit mode after saving changes
      setEditing(!editing);
    } catch (error) {
      console.error('Error saving changes:', error);

      // Notify the user about the failure
      toast.error('Error saving changes', {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
    }
  };

  return (
    <div>
      <h1>Welcome, {userDetails.username}!</h1>
      <div>
        <h2>User Details</h2>

        {editing ? (
          <>
            <p><strong>Username:</strong> {userDetails.username}</p>
            <p><strong>Email:</strong> {userDetails.email}</p>
            {userDetails.oldusertype === "super-admin" && <p><strong>Type:</strong> {userDetails.type}</p>}
            <Button className='btn btn-success' onClick={handleEdit}>Edit Details</Button>
          </>
        ) : (
          <div className='row'>
            <div className='col-lg-3'>
              <label htmlFor="username">Username:</label>
              <input
                type="text"
                id="username"
                className="search-input form-control me-2"
                placeholder="Username"
                value={userDetails.newusername}
                onChange={(e) => setUserDetails({ ...userDetails, newusername: e.target.value })}
              />
            </div>
            <div className='col-lg-3'>
              <label htmlFor="email">Email:</label>
              <input
                type="text"
                id="email"
                className="search-input form-control me-2"
                placeholder="Email"
                value={userDetails.email}
                onChange={(e) => setUserDetails({ ...userDetails, email: e.target.value })}
              />
            </div>
            <div className='col-lg-3'>
              {userDetails.oldusertype === "super-admin" &&
                <div>
                  <label htmlFor="type">Type:</label>
                  <select
                    id="type"
                    className="search-input form-control me-2"
                    value={userDetails.type}
                    onChange={(e) => setUserDetails({ ...userDetails, type: e.target.value })}
                  >
                    <option value="admin">Admin</option>
                    <option value="super-admin">Super Admin</option>
                  </select>
                </div>
              }
            </div>
            <div className='col-lg-2 p-4'>
              <Button className='btn btn-success'onClick={handleSaveChanges}>Save Changes</Button>
            </div>
          </div>

        )}
      </div>
      <h2>Change Password</h2>
      <div className='row'>
        <div className='col-lg-3'>
          <label htmlFor="oldPassword">Old Password:</label>
          <input
            type="password"
            id="oldPassword"
            placeholder="Old Password"
            className="search-input form-control me-2"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
        </div>
        <div className='col-lg-3'>
          <label htmlFor="newPassword">New Password:</label>
          <input
            type="password"
            id="newPassword"
            placeholder="New Password"
            className="search-input form-control me-2"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <div className='col-lg-3'> 
          <label htmlFor="confirmNewPassword">Confirm New Password:</label>
          <input
            type="password"
            id="confirmNewPassword"
            className="search-input form-control me-2"
            placeholder="Confirm New Password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
          />
        </div>
        <div className='col-lg-2 p-4'>
          <Button className='btn btn-success' onClick={handlePasswordChange}>Change Password</Button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Admin;
