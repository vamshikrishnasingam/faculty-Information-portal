import React, { useState, useEffect } from "react";
import axios from "axios";
import { useContext } from "react";
import { Form, Button } from "react-bootstrap";
import { useSpring, animated } from 'react-spring'
import { loginContext } from "../../../contexts/loginContext";
import { NavLink, Link, Outlet } from "react-router-dom";
const ContactUS = () => {
  const [searchId, setSearchId] = useState("");
  const [facdata, setFacData] = useState(null);
  const [dv, sdv] = useState(0);
  const [wlv, swlv] = useState(0);
  const [message, setMessage] = useState("");
  const [cellState, setCellState] = useState({});
  const [selectedSlots, setSelectedSlots] = useState({});
  const [dropdownOpen, setDropdownOpen] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedResult, setSelectedResult] = useState(null);
  const week = ["mon", "tue", "wed", "thu", "fri", "sat"];

  let [, , userLoginStatus, , logoutUser] = useContext(loginContext);
  const times = [
    "9-10",
    "10-11",
    "11-12",
    "12-1",
    "12_40-1_40",
    "1_40-2_40",
    "2_40-3_40",
    "3_40-4_40",
  ];
  const years = ["1", "2", "3", "4"];

  useEffect(() => {
    const fetchlist = async () => {
      try {
        const response = await axios.get("/facultytimetable-api/faculty-data-total");
        setSearchResults(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchlist();
  }, []);

  useEffect(() => {
    if (facdata === null) sdv(0);
    else sdv(1);
  }, [facdata]);

  const handleSearch = async (e) => {
    e.preventDefault();
    swlv(0);
    await axios
      .get(`/freehours-api/full-data/${searchId}`)
      .then((response) => {
        // Handle the successful response here
        if (response.data) {
          setFacData(response.data);
          setSearchTerm("");
        } else {
          setFacData(null);
          setMessage("No data found for the given ID.");
        }
        // You can perform any data processing or UI updates here
      })
      .catch((error) => {
        // Handle any errors or exceptions here
        console.error("Error:", error);
        setFacData(null);
        // You can update the UI to show an error message or take any other action
      });
  };

  const editworkload = () => {
    swlv(1);
  };

  const toggleCellState = (day, time) => {
    const cellKey = `${day}.${time}`;
    if (cellState[cellKey] === "idle") {
      const newState = { ...cellState };
      newState[cellKey] = "busy";
      setSelectedSlots((prevSelectedSlots) => ({
        ...prevSelectedSlots,
        [cellKey]: "Year 1",
      }));
      setCellState(newState);
    }
  };

  const toggleDropdown = (day, time) => {
    setDropdownOpen((prevState) => ({
      ...prevState,
      [`${day}.${time}`]: !prevState[`${day}.${time}`],
    }));
  };

  const saveworkload = async () => {
    fetchData();
    swlv(0);
    setDropdownOpen({});
    let k = Object.keys(selectedSlots);
    console.log("keys : ", k);
    k.forEach(async (ele) => {
      await axios
        .post(
          `/freehours-api/fac-update/${searchId}/${ele}/${selectedSlots[ele]}`
        )
        .then((response) => {
          // Handle the successful response here
          console.log("Success:", response.data);
          // You can perform any data processing or UI updates here
        })
        .catch((error) => {
          // Handle any errors or exceptions here
          console.error("Error:", error);
          // You can update the UI to show an error message or take any other action
        });
    });
    setSelectedSlots({});
  };

  const cancelworkload = () => {
    setCellState({});
    setSelectedSlots({});
    swlv(0);
    // Close all dropdowns
    setDropdownOpen({});
  };

  useEffect(() => {
    if (facdata === null) {
      sdv(0);
      setCellState({});
    } else {
      sdv(1);
      const initialCellState = {};
      week.forEach((day) => {
        times.forEach((time) => {
          const cellKey = `${day}.${time}`;
          initialCellState[cellKey] =
            facdata[day] && facdata[day][time] ? "busy" : "idle";
        });
      });
      setCellState(initialCellState);
    }
  }, [facdata]);

  const fetchData = async () => {};

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
      item.username.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
      item.facultytype.toLowerCase().includes(searchTerm.toLowerCase().trim())
  );

  const fadeOutSlideUpAnimation = useSpring({
    to: async (next) => {
      await next({ opacity: 1, transform: "translateY(-10px)" });
    },
    from: { opacity: 0, transform: "translateY(20px)" },
    config: { duration: 700 },
  });


  return (
    <animated.div
      style={fadeOutSlideUpAnimation}
      className="text-white m-5 p-1"
    >
      <h1 className="text-white">FACULTY UPDATE</h1>
      <hr />
      {userLoginStatus ? (
        <div>
          <div className="row">
            <div className="col-lg-3 col-sm-12 col-md-6 p-3">
              <div className="search-bar-container">
                <input
                  type="text"
                  className="search-input form-control me-2"
                  value={searchTerm}
                  onChange={handleSearchInputChange}
                  placeholder="Enter faculty ID"
                />
                {searchTerm && (
                  <div className="search-results text-dark">
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
            <div className="col-lg-2 col-sm-12 col-md-6 p-3">
              <Button
                className="btn btn-success w-100"
                type="submit"
                onClick={handleSearch}
              >
                Search
              </Button>
            </div>
          </div>
          {dv === 1 && (
            <div className="container m-3" style={{ "overflow-x": "auto" }}>
              <h3>Fac_Id : {facdata.username}</h3>
              <h3>Name : {facdata.name}</h3>
              <h3>Type : {facdata.facultytype}</h3>
              {wlv === 0 && (
                <div className="history-results">
                  <table>
                    <thead>
                      <tr>
                        <th>#</th>
                        {times.map((ele) => (
                          <th key={ele}>{ele}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {week.map((element) => (
                        <tr key={element}>
                          <td>{element}</td>
                          {times.map((ele) => (
                            <td key={ele}>
                              {facdata[element] && facdata[element][ele]
                                ? "Busy"
                                : "Idle"}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <button onClick={editworkload}>EDIT</button>
                </div>
              )}
              {wlv === 1 && (
                <div>
                  <table>
                    <thead>
                      <tr>
                        <th>#</th>
                        {times.map((ele) => (
                          <th key={ele}>{ele}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {week.map((day) => (
                        <tr key={day}>
                          <td>{day}</td>
                          {times.map((time) => (
                            <td key={time}>
                              <h6
                                onClick={() => toggleCellState(day, time)}
                                className={
                                  cellState[`${day}.${time}`] === "busy"
                                    ? "busy"
                                    : "idle"
                                }
                              >
                                {cellState[`${day}.${time}`] === "busy"
                                  ? "Busy"
                                  : "Idle"}
                              </h6>
                              {cellState[`${day}.${time}`] === "idle" && (
                                <select
                                  value={selectedSlots[`${day}.${time}`]}
                                  onChange={(e) => {
                                    setSelectedSlots((prevSelectedSlots) => ({
                                      ...prevSelectedSlots,
                                      [`${day}.${time}`]: e.target.value,
                                    }));
                                  }}
                                >
                                  {years.map((year, index) => (
                                    <option key={index} value={year}>
                                      {year}
                                    </option>
                                  ))}
                                </select>
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <button onClick={saveworkload}>SAVE</button>
                  <button onClick={cancelworkload}>CANCEL</button>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="container col-sm-10 col-lg-6 p-5 border bg-secondary bg-opacity-10">
          <h1 className="display-1 text-danger">You are Logged Out</h1>
          <p className="display-6">Please Login to continue</p>
          {/* <p className='display-6'>Please Login to continue</p> */}
          <Button variant="primary">
            <NavLink
              className="fw-bold fs-4 text-decoration-none text-white"
              to="/admin-login"
            >
              Login
            </NavLink>
          </Button>
        </div>
      )}
    </animated.div>
  );
};

export default ContactUS;
