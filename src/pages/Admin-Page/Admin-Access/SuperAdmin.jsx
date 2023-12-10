import React, { useContext , useEffect , useState } from 'react'
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { loginContext } from "../../../contexts/loginContext";
import { Button , Modal } from 'react-bootstrap';

function SuperAdmin() {
  let [currentUser, , , ,] = useContext(loginContext);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [editMode, setEditMode] = useState({});
  const [editedData, setEditedData] = useState({});
  const [refresh, setRefresh] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [filterType, setFilterType] = useState(""); // '' for all, 'admin', or 'super-admin'
  //the add user form
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    type: 'admin', // Default value, you can change it based on your requirements
    password: '',
  });
  const [show, setShow] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      // No token, return null indicating no authenticated user
      return null;
    }
    axios
      .get("http://localhost:5000/user-api/get-users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        // Filter out the current user from the list
        const filteredUsers = response.data.payload.filter(
          (user) => user.username !== currentUser.username
        );

        // Update the state with the filtered users
        const usersWithNewUsername = filteredUsers.map((user) => ({
          ...user,
          newusername: user.username, // Adding new field newUsername
        }));
        setUsers(usersWithNewUsername);
        setFilteredUsers(usersWithNewUsername);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, [refresh,show]);

  useEffect(() => {
    // Apply type filter
    const filteredByType = filterType
      ? users.filter((user) => user.type === filterType.toLowerCase())
      : users;

    setFilteredUsers(filteredByType);
  }, [filterType, filteredUsers]);

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

  // const filteredUsers = users.filter((user) => {
  //   // Filter users based on the search term (case-insensitive)
  //   const usernameMatch = user.newusername
  //     .toLowerCase()
  //     .includes(searchTerm.toLowerCase());

  //   // Filter users based on email
  //   const emailMatch = user.email
  //     .toLowerCase()
  //     .includes(searchTerm.toLowerCase());

  //   // Filter users based on type
  //   const typeMatch =
  //     filterType === '' || user.type === filterType.toLowerCase();

  //   // return usernameMatch ;
  //   return usernameMatch || emailMatch || typeMatch;
  // });

  const handleFilterChange = (selectedFilter) => {
    setFilterType(selectedFilter);
  };

  const handleSearch = async () => {
    try {
      if(searchInput===''){
      const token = localStorage.getItem("token");
      if (!token) {
        // No token, return null indicating no authenticated user
        return null;
      }
      axios
        .get("http://localhost:5000/user-api/get-users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          // Filter out the current user from the list
          const filteredUsers = response.data.payload.filter(
            (user) => user.username !== currentUser.username
          );

          // Update the state with the filtered users
          const usersWithNewUsername = filteredUsers.map((user) => ({
            ...user,
            newusername: user.username, // Adding new field newUsername
          }));
          setUsers(usersWithNewUsername);
        })
        .catch((error) => {
          console.error("Error fetching users:", error);
        });
        return;
      }
      const response = await axios.get(`http://localhost:5000/user-api/search-users/${searchInput}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      // Filter out the current user from the list
      const filteredUsers = response.data.payload.filter(
        (user) => user.username !== currentUser.username
      );

      // Update the state with the filtered users
      const usersWithNewUsername = filteredUsers.map((user) => ({
        ...user,
        newusername: user.username, // Adding new field newUsername
      }));
      setUsers(usersWithNewUsername);
    } catch (error) {
      console.error("Error searching users:", error);

      // Handle error (e.g., show an error message to the user)
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
  const handleRemoveUser = async (username) => {
    try {
      // Fetch request to set default password
      const response = await axios.delete(
        `http://localhost:5000/user-api/remove-user/${username}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setRefresh(!refresh);

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
    } catch (error) {
      console.error("Error setting default password:", error);
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
      console.log("Save changes for user:", editedData[userId]);
      // Example: You may want to send an API request to update user data
      await axios.put(
        "http://localhost:5000/user-api/update",
        editedData[userId],
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setRefresh(!refresh);
      // Notification using react-toastify
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
    } catch (error) {
      console.error("Error saving changes:", error);
      // Handle error (e.g., show an error message to the user)
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
    } finally {
      // Exit edit mode after saving changes
      setEditMode((prevMode) => ({
        ...prevMode,
        [userId]: false,
      }));
    }
  };

  const handleSetDefaultPassword = async (username) => {
    try {
      // Fetch request to set default password
      const response = await axios.get(
        `http://localhost:5000/user-api/set-default-password/${username}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
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
    } catch (error) {
      console.error("Error setting default password:", error);
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

  const handleAddUser = async () => {
    try {
      // Validate the new user object
      if (!newUser.username || !newUser.email || !newUser.type || !newUser.password) {
        toast.error('Please fill in all fields', {
          position: 'top-center',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
        });
        setShow(false);
        return;
      }
      // Send the new user object to the backend
      const response = await axios.post('http://localhost:5000/user-api/user-signup', newUser, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      // Handle the response
      // console.log(response); // Log the response message or handle it accordingly

      // Trigger a refresh to update the user list
      setRefresh(!refresh);

      // Close the add user form
      setShow(false);

      // Notification using react-toastify
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
    } catch (error) {
      console.error('Error adding user:', error);
      // Handle error (e.g., show an error message to the user)
      toast.error(error.message, {
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
      <ToastContainer />
      <div className="row">
        <div className="col-lg-8">
          <h2>User List</h2>
        </div>
        <div className="col-lg-4">
          <Button
            className="btn btn-success ms-3 w-50"
            onClick={() => setShow(true)}
          >
            Add User
          </Button>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-4 col-sm-12 col-md-6 p-3">
          <select
            className="form-select"
            value={filterType}
            onChange={(e) => handleFilterChange(e.target.value)}
          >
            <option value="">All</option>
            <option value="admin">Admin</option>
            <option value="super-admin">Super Admin</option>
          </select>
        </div>
        <div className="col-lg-4 col-sm-12 col-md-6 p-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search Here..."
            id="search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
        <div className="col-lg-4 col-sm-12 col-md-6 p-3">
          <Button className="w-50 btn btn-primary ms-3" onClick={handleSearch}>
            Search
          </Button>
        </div>
      </div>
      <Modal
        show={show}
        size="lg"
        onHide={() => setShow(false)}
        backdrop="static"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">Add User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="add-user-form">
            <form>
              <div className="mb-3">
                <label htmlFor="username" className="form-label">
                  Username
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="username"
                  value={newUser.username}
                  onChange={(e) =>
                    setNewUser({ ...newUser, username: e.target.value })
                  }
                />
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser({ ...newUser, email: e.target.value })
                  }
                />
              </div>
              <div className="mb-3">
                <label htmlFor="type" className="form-label">
                  Type
                </label>
                <select
                  className="form-select"
                  id="type"
                  value={newUser.type}
                  onChange={(e) =>
                    setNewUser({ ...newUser, type: e.target.value })
                  }
                >
                  <option value="admin">Admin</option>
                  <option value="super-admin">Super Admin</option>
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  value={newUser.password}
                  onChange={(e) =>
                    setNewUser({ ...newUser, password: e.target.value })
                  }
                />
              </div>
            </form>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            style={{ width: "10vw", color: "white" }}
            type="button"
            className="btn btn-secondary"
            onClick={() => setShow(false)}
          >
            Close
          </Button>
          <Button
            style={{ width: "10vw", color: "white" }}
            type="button"
            className="btn btn-primary"
            onClick={handleAddUser}
          >
            Add User
          </Button>
        </Modal.Footer>
      </Modal>
      {/* <div style={{ marginBottom: "10px" }}>
        <label htmlFor="search">Search: </label>
        <input
          type="text"
          id="search"
          className="search-input form-control me-2"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="">All</option>
          <option value="admin">Admin</option>
          <option value="super-admin">Super Admin</option>
        </select>
      </div> */}
      <div style={{ overflowX: "auto", overflowY: "hidden" }}>
        <table className="mt-3 rounded">
          <thead>
            <tr>
              <th style={{ width: "20%" }} className="rounded">
                Username
              </th>
              <th style={{ width: "15%" }} className="rounded">
                Type
              </th>
              <th style={{ width: "25%" }} className="rounded">
                Email
              </th>
              <th style={{ width: "10%" }} className="rounded">
                Edit
              </th>
              <th style={{ width: "15%" }} className="rounded">
                Change Password
              </th>
              <th style={{ width: "15%" }} className="rounded">
                Remove User
              </th>
            </tr>
          </thead>
          {/* <tbody>
            {users?.map((user) => (
                <tr key={user._id}>
                <td>{user.username}</td>
                <td>{user.type}</td>
                <td>{user.email}</td>
                <td>
                    <Button style={{ width: '10vw' }} onClick={() => handleEdit(user)}>Edit</Button>
                </td>
                <td>
                    <Button style={{ width: '10vw' }} onClick={() => handleSetDefaultPassword(user.username)}>change</Button>
                </td>
                </tr>
            ))}
            </tbody> */}
          <tbody>
            {filteredUsers?.map((user) => (
              <tr key={user._id}>
                <td className="rounded">
                  {editMode[user._id] ? (
                    <input
                      type="text"
                      value={
                        editedData[user._id]?.newusername || user.newusername
                      }
                      onChange={(e) =>
                        handleInputChange(
                          user._id,
                          "newusername",
                          e.target.value
                        )
                      }
                    />
                  ) : (
                    user.newusername
                  )}
                </td>
                <td className="rounded">
                  {editMode[user._id] ? (
                    <select
                      value={editedData[user._id]?.type || user.type}
                      onChange={(e) =>
                        handleInputChange(user._id, "type", e.target.value)
                      }
                    >
                      <option value="admin">Admin</option>
                      <option value="super-admin">Super Admin</option>
                    </select>
                  ) : (
                    user.type
                  )}
                </td>
                <td className="rounded">
                  {editMode[user._id] ? (
                    <input
                      type="text"
                      value={editedData[user._id]?.email || user.email}
                      onChange={(e) =>
                        handleInputChange(user._id, "email", e.target.value)
                      }
                    />
                  ) : (
                    user.email
                  )}
                </td>
                <td className="rounded">
                  {editMode[user._id] ? (
                    <Button
                      style={{ width: "10vw" }}
                      className="btn btn-primary"
                      onClick={() => handleSaveChanges(user._id)}
                    >
                      Save
                    </Button>
                  ) : (
                    <Button
                      style={{ width: "10vw" }}
                      className="btn btn-primary"
                      onClick={() => handleEdit(user)}
                    >
                      Edit
                    </Button>
                  )}
                </td>
                <td className="rounded">
                  <Button
                    style={{ width: "10vw" }}
                    className="btn btn-primary"
                    onClick={() => handleSetDefaultPassword(user.username)}
                  >
                    Change
                  </Button>
                </td>
                <td className="rounded">
                  <Button
                    style={{ width: "10vw" }}
                    className="btn btn-primary"
                    onClick={() => handleRemoveUser(user.username)}
                  >
                    Remove
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SuperAdmin