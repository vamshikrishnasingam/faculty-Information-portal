import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useContext } from "react";
import { Form, Button, Modal } from "react-bootstrap";
import { useSpring, animated } from "react-spring";
import { loginContext } from "../../../contexts/loginContext";
import { NavLink } from "react-router-dom";
const ContactUS = () => {
  const [searchId, setSearchId] = useState("");
  const [facdata, setFacData] = useState(null);
  const [dv, sdv] = useState(0);
  const [disss,setdissv] = useState(1);
  const [wlv, swlv] = useState(0);
  const [ewlv, sewlv] = useState(0);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedResult, setSelectedResult] = useState(null);
  const [inputRequiredCell, setInputRequiredCell] = useState(0);
  const [newInput, setNewInput] = useState(null);
  const [reason, setreason] = useState([]);
  const [changedCells, setChangedCells] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [timevalue, settimevalue] = useState("1");
  const [facultyModalShow, setFacultyModalShow] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState([]);
  const [message, setMessage] = useState("");
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
  const timings = ["1", "2", "3", "7", "SEM"];

  useEffect(() => {
    const fetchlist = async () => {
      try {
        const response = await axios.get(
          "/facultytimetable-api/faculty-data-total"
        );
        setSearchResults(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchlist();
  }, []);

  useEffect(() => {
    if (facdata === null) {
      sdv(0);
    } else {
      handlefacdata();
      sdv(1);
    }
  }, [facdata]);

  const handleSearch = async () => {
    swlv(0);
    if (!searchId) {
      setdissv(0)
      setMessage("Please Enter the Id");
      setFacData([]);
    } else {
      try {
        const response = await axios.get(
          `/freehours-api/full-data/${searchId}`
        );
        if (response.data) {
          setFacData(response.data);
          setMessage("");
          setdissv(1);
          setSearchTerm("");
        } else {
          setFacData(null);
          setSearchTerm("");
          setMessage("No data found for the given ID.");
        }
        // You can perform any data processing or UI updates here
      } catch (error) {
        // Handle any errors or exceptions here
        console.error("Error:", error);
        setFacData(null);
        // You can update the UI to show an error message or take any other action
        setMessage("Error occurred while fetching data.");
      }
    }
  };

  const editworkload = () => {
    sewlv(1);
  };

  const saveworkload = async () => {
    const passobj = {};
    passobj["dataupdate"] = selectedSlots;
    passobj["reasons"] = reason;
    passobj["selectedfaculty"] = [...selectedFaculty, searchId];
    passobj["timevalue"] = timevalue;
    console.log("final data :", passobj, selectedFaculty, timevalue);
    try {
      const response = await axios.post("/freehours-api/fac-update", passobj);
      console.log("Success:", response.data);
    } catch (error) {
      console.error("Error:", error);
    }
    sewlv(0);
    setSelectedSlots({});
    handleSearch();
    handlefacdata();
    setChangedCells([]);
    setreason([]);
    setSelectedSlots([]);
    setSelectedFaculty([]);
    handleFacultySelection([]);
    settimevalue("");
  };

  const cancelworkload = () => {
    sewlv(0);
    setChangedCells([]);
    setreason([]);
    setSelectedSlots([]);
    setSelectedFaculty([]);
    handleFacultySelection([]);
    settimevalue("1");
    // Reset changed cells
  };

  const handlefacdata = () => {
    if (facdata === null) {
      sdv(0);
    } else {
      sdv(1);
      swlv(1);
    }
  };

  const handleSearchInputChange = (event) => {
    const term = event.target.value;
    setSearchTerm(term);
    setSearchId(term);
  };

  const handleSelectResult = (result) => {
    setSelectedResult(result);
    setSearchTerm(result.username);
    setSearchId(result.username);
    setInputRequiredCell(null);
  };

  const handleSave = () => {};

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

  const handleFacultySelection = (selectedFacultyList) => {
    setSelectedFaculty(selectedFacultyList);
  };

  const handleSetMultipleFaculty = () => {
    setFacultyModalShow(true);
  };

  const handleFacultyModalClose = () => {
    setFacultyModalShow(false);
  };

  function MyVerticallyCenteredModal(props) {
    return (
      <Modal show={props.show} size="lg" centered>
        <Modal.Header>
          <Modal.Title id="contained-modal-title-vcenter">
            Conditionally Set Chnages
          </Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-around",
            }}
          >
            <h3 className="p-2">Set Time limit for the specified workload</h3>
            <select
              className="p-2"
              value={timevalue === "" ? "select" : timevalue}
              onChange={(e) => {
                settimevalue(e.target.value);
              }}
            >
              {timings.map((duration, index) => (
                <option key={index} value={duration}>
                  {index === 4 ? duration : `${duration}-weeks`}
                </option>
              ))}
            </select>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-around",
            }}
          >
            <h3 className="p-2">update the same status for multiple faculty</h3>
            <div className="p-2">
              <Button
                className="btn-secondary"
                onClick={() => {
                  setModalShow(false);
                  handleSetMultipleFaculty();
                }}
              >
                Update
              </Button>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="p-2">
            <Button
              onClick={() => {
                setModalShow(false);
                sewlv(1);
              }}
              variant="primary"
            >
              {" "}
              Save{" "}
            </Button>
          </div>
          <div className="p-2">
            <Button
              onClick={() => {
                setModalShow(false);
                sewlv(1);
                settimevalue("1");
                handleFacultySelection([]);
              }}
              variant="secondary"
            >
              Cancel
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    );
  }

  const FacultySelectionModal = ({ show, onHide }) => {
    const [selectedFacultyModal, setSelectedFacultyModal] =
      useState(selectedFaculty);

    const handleCheckboxChange = (username) => {
      setSelectedFacultyModal((prevSelectedFaculty) => {
        if (prevSelectedFaculty.includes(username)) {
          return prevSelectedFaculty.filter((faculty) => faculty !== username);
        } else {
          return [...prevSelectedFaculty, username];
        }
      });
    };

    return (
      <Modal show={show} size="lg" centered onHide={onHide}>
        <Modal.Header closeButton>
          <Modal.Title>Select Faculty</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {searchResults.length > 0 ? (
            <div
              className="container m-6 history-results bg-opacity-10"
              style={{ overflowX: "auto" }}
            >
              <table className="w-50 mx-auto">
                <thead>
                  <tr>
                    <th>Faculty-Id</th>
                    <th>Faculty-Name</th>
                    <th>Faculty-Type</th>
                    <th>Timetables</th>
                  </tr>
                </thead>
                <tbody>
                  {searchResults.map((row) => (
                    <tr key={row.username}>
                      <td>{row.username}</td>
                      <td>{row.name}</td>
                      <td>{row.facultytype}</td>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedFacultyModal.includes(row.username)}
                          onChange={() => handleCheckboxChange(row.username)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div>
              <h1>NO DATA TO FETCH IN API</h1>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            onClick={() => {
              setModalShow(true);
              onHide();
              handleFacultySelection(selectedFacultyModal);
              setSelectedFacultyModal([]);
            }}
          >
            Update
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              setModalShow(true);
              onHide();
              handleFacultySelection([]);
            }}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

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
          {message && <h3>{message}</h3>}
          {(dv === 1 && disss===1) && (
            <div className="container m-3" style={{ "overflow-x": "auto" }}>
              <h3>Fac_Id : {facdata.username}</h3>
              <h3>Name : {facdata.name}</h3>
              <h3>Type : {facdata.facultytype}</h3>
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
                          {times.map((ele) => (
                            <td
                              key={ele}
                              style={{
                                border: `1px solid ${
                                  changedCells.includes(`${day}.${ele}`)
                                    ? "red" // Change the border color for changed cells
                                    : "black" // Default border color
                                }`,
                              }}
                            >
                              {(facdata?.[day]?.[ele] || facdata?.['special']?.[day]?.[ele])
                                ? "Busy"
                                : "Idle"}
                              {ewlv === 1 && (
                                <div>
                                  <select
                                    value={selectedSlots[`${day}.${ele}`]}
                                    onChange={(e) => {
                                      setSelectedSlots(() => ({
                                        ...selectedSlots,
                                        [`${day}.${ele}`]: e.target.value,
                                      }));
                                      setInputRequiredCell(`${day}.${ele}`);
                                    }}
                                  >
                                    <option>select</option>
                                    {years.map((year, index) => (
                                      <option key={index} value={year}>
                                        {year}
                                      </option>
                                    ))}
                                  </select>
                                  {inputRequiredCell === `${day}.${ele}` && (
                                    <div
                                      style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        justifyContent: "space-around",
                                      }}
                                    >
                                      <div>
                                        <input
                                          type="text"
                                          value={newInput}
                                          className="search-input form-control me-2"
                                          placeholder="Specify Reason"
                                          onChange={(ev) => {
                                            setNewInput(ev.target.value);
                                            setreason(() => ({
                                              ...reason,
                                              [`${day}.${ele}`]:
                                                ev.target.value,
                                            }));
                                          }}
                                        />
                                      </div>
                                      <div className="p-1">
                                        <Button
                                          onClick={() => {
                                            setreason({
                                              ...reason,
                                              [`${day}.${ele}`]: newInput,
                                            });
                                            setChangedCells(
                                              (prevChangedCells) => [
                                                ...prevChangedCells,
                                                `${day}.${ele}`,
                                              ]
                                            );
                                            setInputRequiredCell(null);
                                          }}
                                        >
                                          O
                                        </Button>
                                      </div>
                                      <div className="p-1">
                                        <Button
                                          onClick={() =>
                                            setInputRequiredCell(null)
                                          }
                                        >
                                          X
                                        </Button>
                                      </div>
                                      <div></div>
                                    </div>
                                  )}
                                  <div></div>
                                </div>
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {ewlv === 0 && <button onClick={editworkload}>EDIT</button>}
                </div>
              )}
              {ewlv === 1 && (
                <div className="row p-4">
                  <div className="col-lg-2 col-sm-4 col-md-4">
                    <Button
                      onClick={() => {
                        setModalShow(true);
                      }}
                      className="btn btn-success w-100"
                    >
                      SET
                    </Button>
                  </div>
                  <div className="col-lg-2 col-sm-4 col-md-4">
                    <Button
                      className="btn btn-success w-100"
                      onClick={saveworkload}
                    >
                      SAVE
                    </Button>
                  </div>
                  <div className="col-lg-2 col-sm-4 col-md-4">
                    <Button
                      className="btn btn-success w-100"
                      onClick={cancelworkload}
                    >
                      CANCEL
                    </Button>
                  </div>
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
      <MyVerticallyCenteredModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        save={handleSave}
        setMultipleFaculty={handleSetMultipleFaculty}
      />
      <FacultySelectionModal
        show={facultyModalShow}
        onHide={handleFacultyModalClose}
      />
    </animated.div>
  );
};

export default ContactUS;
