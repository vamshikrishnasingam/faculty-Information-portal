import React, { useState, useEffect } from "react";
import { OverlayTrigger, Popover, Button, Form } from "react-bootstrap";
import axios from "axios";
import { useSpring, animated } from "react-spring";
const days = ["mon", "tue", "wed", "thu", "fri", "sat"];
const times = [
  "9-10",
  "10-11",
  "11-12",
  "12-1",
  "12.40-1.40",
  "1.40-2.40",
  "2.40-3.40",
  "3.40-4.40",
];
let pegasus = [];

const FacultyTimeTable = () => {
  const [searchId, setSearchId] = useState("");
  const [data, setData] = useState(null);
  const [year, setYear] = useState("");
  const [sem, setSem] = useState(1);
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedResult, setSelectedResult] = useState(null);

  useEffect(() => {
    const fetchlist = async () => {
      try {
        const response = await axios.get(
          `/facultytimetable-api/faculty-data-total`
        );
        setSearchResults(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchlist();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(
        `/facultytimetable-api/classfaculty-data/${searchId}`
      );
      if (response.data) {
        setData(response.data);
        setSearchTerm("");
      } else {
        setData(null);
        setMessage("No data found for the given ID.");
      }
    } catch (error) {
      console.error("Error:", error);
      setData(null);
    }
  };

  useEffect(() => {
    if (year !== "") handleSearch();
  }, [sem, year]);

  const MyPopoverContent = (cell) => (
    <Popover id="popover-basic">
      <Popover.Body>
        <p>SUBJECT: {cell.subject}</p>
        <p>CLASS: {cell.class}</p>
        <p>ROOM-NO: {cell.roomno}</p>
      </Popover.Body>
    </Popover>
  );

  useEffect(() => {
    if (data) {
      printData();
    }
  }, [year, data, sem]);

  const printData = () => {
    const y = year || Object.keys(data)[Object.keys(data).length - 1];
    const unicorn = [];
    for (const day of days) {
      const b = [{ classtype: day }];
      const l = data[y][sem]?.hasOwnProperty(day);
      if (l) {
        for (const time of times) {
          const a = data[y][sem][day]?.hasOwnProperty(time.replace(/\./g, "_"));
          if (a) {
            b.push(data[y][sem][day][time.replace(/\./g, "_")]);
          } else {
            b.push({ name: "null", roomno: "null", subjectname: "null" });
          }
        }
      } else {
        for (let j = 0; j < 8; j++) {
          b.push({ name: "null", roomno: "null", subjectname: "null" });
        }
      }
      unicorn.push(b);
    }
    pegasus = unicorn;
  };

  const handleSearchInputChange = (event) => {
    const term = event.target.value;
    setSearchTerm(term);
    setSelectedResult(term);
    setSearchId(term);
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

  const slideIn = useSpring({
    transform: "translateX(0%)",
    from: { transform: "translateX(-100%)" },
    config: { duration: 800 },
  });
  return (
    <animated.div style={slideIn} className="container p-5 text-white">
      <h3 className="mb-4 text-center">
        Please enter FacultyID for their Time Tables!!!
      </h3>
      <hr />
      <div className="row">
        <div className="col-lg-3 col-sm-6 col-md-6 p-3">
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
        <div className="col-lg-2 col-sm-6 col-md-6 p-3">
          <Button
            className="btn btn-success w-100"
            type="submit"
            onClick={handleSearch}
          >
            Search
          </Button>
        </div>
      </div>
      {data && (
        <div className="table-container">
          <h3>Fac_Id : {data.username}</h3>
          <h3>Name : {data.name}</h3>
          <h3>Type : {data.facultytype}</h3>
          <table className="m-3 mx-auto">
            <thead>
              <div className="row">
                <tr className="col-lg-6 col-sm-12 col-md-6 p-3">
                  <Form.Select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                  >
                    <option
                      value={
                        year === ""
                          ? Object.keys(data)[Object.keys(data).length - 1]
                          : ""
                      }
                    >
                      {year === ""
                        ? Object.keys(data)[Object.keys(data).length - 1]
                        : "Select Year"}
                    </option>

                    {Object.keys(data)
                      .slice(4)
                      .map((yearOption) => (
                        <option key={yearOption} value={yearOption}>
                          {yearOption}
                        </option>
                      ))}
                  </Form.Select>
                </tr>
                <tr className="col-lg-6 col-sm-12 col-md-6 p-3">
                  <Form.Select
                    value={sem}
                    onChange={(e) => setSem(e.target.value)}
                  >
                    <option>select SEM</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                  </Form.Select>
                </tr>
              </div>

              <tr>
                <th>Day</th>
                {times.map((time) => (
                  <th key={time}>{time}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pegasus.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex}>
                      {cellIndex === 0 &&
                        cell &&
                        Object.keys(cell).length > 0 && (
                          <div className="cell-content">
                            <p>{cell.classtype}</p>
                          </div>
                        )}
                      {cellIndex !== 0 &&
                        cell &&
                        Object.keys(cell).length > 0 && (
                          <div className="cell-content">
                            <OverlayTrigger
                              trigger="hover"
                              placement="right"
                              overlay={MyPopoverContent(cell)}
                            >
                              <p className="popover-button">{cell.classtype}</p>
                            </OverlayTrigger>
                          </div>
                        )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </animated.div>
  );
};

export default FacultyTimeTable;
