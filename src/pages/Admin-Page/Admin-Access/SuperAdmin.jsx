import React, { useEffect ,useState } from 'react'
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function SuperAdmin() {
    const [users, setUsers] = useState([]);
    const [editMode, setEditMode] = useState({});
    const [editedData, setEditedData] = useState({});
    const [refresh,setRefresh] = useState(false);
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
          // No token, return null indicating no authenticated user
          return null;
        }
      //   axios.get('http://localhost:5000/user-api/get-users', {
      //             headers: {
      //               Authorization: `Bearer ${token}`,
      //             },
      //           })
      //           .then((response) => {
      //             // Update the state with the fetched users
      //             setUsers(response.data.payload);
      //           })
      //           .catch(error => {
      //             console.error('Error fetching users:', error);
      //           })
        axios.get('http://localhost:5000/user-api/get-users', {
          headers: {
              Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
            // Update the state with the fetched users
            const usersWithNewUsername = response.data.payload.map(user => ({
                ...user,
                newusername: user.username, // Adding new field newUsername
            }));
            setUsers(usersWithNewUsername);
        })
        .catch(error => {
            console.error('Error fetching users:', error);
        });
      }, [refresh]);
      const handleEdit = (user) => {
        // Toggle edit mode for the selected user
        setEditMode((prevMode) => ({
          ...prevMode,
          [user._id]: !prevMode[user._id],
        }));
  
        // Set the initial edited data to the current user data
        setEditedData({
          ...editedData,
          [user._id]: { ...user },
        });
      };
  
      const handleInputChange = (userId, field, value) => {
        // Update the edited data when input fields change
        setEditedData((prevData) => ({
          ...prevData,
          [userId]: {
            ...prevData[userId],
            [field]: value,
          },
        }));
      };
      const handleRemoveUser = async(username) => {
          try {
            // Fetch request to set default password
            const response = await axios.delete(
              `http://localhost:5000/user-api/remove-user/${username}`,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
              }
            );
            setRefresh(!refresh)
        
            // Handle the response
            // console.log(response); // Log the response message or handle it accordingly
            //notification using react toastify
            toast.success(response.data.message, {
              position: "top-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            });
          }catch (error) {
            console.error('Error setting default password:', error);
            // Handle error (e.g., show an error message to the user)
            // console.log(error) needed modification
            toast.error(error.message, {
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
      
  
      const handleSaveChanges = async (userId) => {
        try {
          // Perform the save changes logic
          console.log('Save changes for user:', editedData[userId]);
          // Example: You may want to send an API request to update user data
          await axios.put(
            'http://localhost:5000/user-api/update',
            editedData[userId],
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
              },
            }
          );
          setRefresh(!refresh);
          // Notification using react-toastify
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
        } catch (error) {
          console.error('Error saving changes:', error);
          // Handle error (e.g., show an error message to the user)
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
        } finally {
          // Exit edit mode after saving changes
          setEditMode((prevMode) => ({
            ...prevMode,
            [userId]: false,
          }));
        }
      };
  
      const handleSetDefaultPassword = async(username) => {
        try {
          // Fetch request to set default password
          const response = await axios.get(
            `http://localhost:5000/user-api/set-default-password/${username}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
              },
            }
          );
      
          // Handle the response
          // console.log(response); // Log the response message or handle it accordingly
          //notification using react toastify
          toast.success(response.data.message, {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        }catch (error) {
          console.error('Error setting default password:', error);
          // Handle error (e.g., show an error message to the user)
          // console.log(error) needed modification
          toast.error(error.message, {
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
  return (
    <div>
        <ToastContainer />
        <h2>User List</h2>
        <table>
            <thead>
            <tr>
                <th>Username</th>
                <th>Type</th>
                <th>Email</th>
                <th>Edit</th>
                <th>Change Password</th>
                <th>Remove User</th>
            </tr>
            </thead>
            {/* <tbody>
            {users?.map((user) => (
                <tr key={user._id}>
                <td>{user.username}</td>
                <td>{user.type}</td>
                <td>{user.email}</td>
                <td>
                    <button onClick={() => handleEdit(user)}>Edit</button>
                </td>
                <td>
                    <button onClick={() => handleSetDefaultPassword(user.username)}>change</button>
                </td>
                </tr>
            ))}
            </tbody> */}
            <tbody>
            {users?.map((user) => (
                <tr key={user._id}>
                <td>
                    {editMode[user._id] ? (
                    <input
                    type="text"
                    value={editedData[user._id]?.newusername || user.newusername}
                    onChange={(e) =>
                        handleInputChange(user._id, 'newusername', e.target.value)
                    }
                    />
                    ) : (
                        user.newusername
                    )}
                </td>
                <td>
                    {editMode[user._id] ? (
                    <select
                        value={editedData[user._id]?.type || user.type}
                        onChange={(e) => handleInputChange(user._id, 'type', e.target.value)}
                    >
                        <option value="admin">Admin</option>
                        <option value="super-admin">Super Admin</option>
                    </select>
                    ) : (
                    user.type
                    )}
                </td>
                <td>
                    {editMode[user._id] ? (
                    <input
                        type="text"
                        value={editedData[user._id]?.email || user.email}
                        onChange={(e) => handleInputChange(user._id, 'email', e.target.value)}
                    />
                    ) : (
                    user.email
                    )}
                </td>
                <td>
                    {editMode[user._id] ? (
                    <button onClick={() => handleSaveChanges(user._id)}>Save</button>
                    ) : (
                    <button onClick={() => handleEdit(user)}>Edit</button>
                    )}
                </td>
                <td>
                    <button onClick={() => handleSetDefaultPassword(user.username)}>Change</button>
                </td>
                <td>
                    <button onClick={() => handleRemoveUser(user.username)}>Remove</button>
                </td>
                </tr>
            ))}
            </tbody>
        </table>
        </div>
  )
}

export default SuperAdmin