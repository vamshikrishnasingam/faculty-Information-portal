import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { Form, Button } from "react-bootstrap";
import { loginContext } from "../../contexts/loginContext";
import { useNavigate } from "react-router-dom";

function ProfessorsData() {
  const [searchId, setSearchId] = useState("");
  const [type, setType] = useState("");
  const [facultyData, setFacultyData] = useState([]);
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedResult, setSelectedResult] = useState(null);
  const navigate = useNavigate();

  const [currentUser, loginUser, userLoginStatus, loginErr, logoutUser] =
    useContext(loginContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/facultytimetable-api/faculty-data-total`);
        setSearchResults(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchId) {
      setMessage("Please enter a search criteria.");
      setFacultyData([]);
    } else {
      try {
        const response = await axios.get(
          `/facultytimetable-api/classfaculty-data/${searchId}`
        );
        if (response.data) {
          setFacultyData([response.data]);
          setMessage("");
          setSearchTerm("");
        } else {
          setFacultyData([]);
          setMessage("No data found for the given ID.");
        }
      } catch (error) {
        console.error(error);
        setFacultyData([]);
        setMessage("Error occurred while fetching data.");
      }
    }
  };

  const handleTypeSubmit = async (e) => {
    e.preventDefault();
    if (!type) {
      setMessage("Please select a faculty type.");
      setFacultyData([]);
    } else {
      try {
        const response = await axios.get(
          `/facultytimetable-api/faculty-data/${type}`
        );
        if (response.data.length > 0) {
          setFacultyData(response.data);
          setMessage("");
        } else {
          setFacultyData([]);
          setMessage("No data found for the selected faculty type.");
        }
      } catch (error) {
        console.error(error);
        setFacultyData([]);
        setMessage("Error occurred while fetching data.");
      }
    }
  };

  const handleSearchInputChange = (event) => {
    const term = event.target.value;
    setSearchTerm(term);
  };

  const handleSelectResult = (result) => {
    setSelectedResult(result);
    setSearchTerm(result.username);
    setSearchId(result.username);
  };

  const filteredResults = searchResults.filter(
    (item) =>
      item.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.facultytype.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const goingBack = () => {
    if (userLoginStatus) {
      navigate("/adminpage");
    } else {
      navigate("/");
    }
  };

  return (
    <div className="container mx-auto">
      <div className="row m-4 mx-auto">
        <div className="col-lg-8 col-sm-10 col-md-12 p-3">
          <h1>FACULTY INFO</h1>
        </div>
        <div className="col-lg-4 col-sm-12 col-md-12 p-3">
          <div className="row">
            <div className="col-lg-7 col-sm-6 col-md-6 p-3">
              <div className="search-bar-container">
                <input
                  type="text"
                  className="search-input form-control me-2"
                  placeholder="Search for faculty..."
                  value={searchTerm}
                  onChange={handleSearchInputChange}
                />
                {searchTerm && (
                  <div className="search-results">
                    {filteredResults.map((user) => (
                      <div
                        key={user._id.$oid}
                        className={`search-result-item ${
                          selectedResult === user ? "selected" : ""
                        }`}
                        value={user.username}
                        onClick={() => handleSelectResult(user)}
                      >
                        {user.username} - {user.name} - {user.facultytype}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="col-lg-5 col-sm-6 col-md-6 p-3">
              <Button
                className="btn btn-success w-100"
                type="submit"
                onClick={handleSearch}
              >
                Search
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="row m-2 mx-auto">
        <div className="col-lg-4 col-sm-12 col-md-6 p-3">
          <Form.Select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="">Select Type</option>
            <option value="Professor">Professors</option>
            <option value="Asst. Prof">Assistant Professors</option>
            <option value="Assoc.Prof">Associate Professors</option>
          </Form.Select>
        </div>
        <div className="col-lg-8 col-sm-10 col-md-6 mx-auto p-3">
          <Button
            className="col-lg-2 col-sm-5 col-md-5  btn-success"
            type="submit"
            style={{ marginRight: "30px" }}
            onClick={handleTypeSubmit}
          >
            Fetch
          </Button>
          <Button
            className="col-lg-2 col-sm-5 col-md-5  btn-danger"
            onClick={goingBack}
          >
            GO BACK
          </Button>
        </div>
      </div>
      <div className="row">
        {message && <h3>{message}</h3>}
        {facultyData.length > 0 ? (
          <div className="container m-3" style={{ "overflow-x": "auto" }}>
            <table className="mx-auto w-75">
              <thead>
                <tr>
                  <th>Faculty-Id</th>
                  <th>Faculty-Name</th>
                  <th>Faculty-Type</th>
                  <th>Timetables</th>
                </tr>
              </thead>
              <tbody>
                {facultyData.map((row) => (
                  <tr key={row.username}>
                    <td>{row.username}</td>
                    <td>{row.name}</td>
                    <td>{row.facultytype}</td>
                    {/* <td>
                      <Button className="btn-success" onClick={handleSearch}>
                        Timetable
                      </Button>
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default ProfessorsData;
