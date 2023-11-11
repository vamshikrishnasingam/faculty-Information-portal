import React, { useState, useEffect } from 'react';
import { OverlayTrigger, Popover, Button, Form } from 'react-bootstrap';
import axios from 'axios';

const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
const times = ['9-10', '10-11', '11-12', '12-1', '12.40-1.40', '1.40-2.40', '2.40-3.40', '3.40-4.40'];
let pegasus = [];

const Others =() => {
  const [searchId, setSearchId] = useState('');
  const [data, setData] = useState(null);
  const [year, setYear] = useState('');
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedResult, setSelectedResult] = useState(null);

  useEffect(() => {
    const fetchlist = async () => {
      try {
        const response = await axios.get(`/facultytimetable-api/faculty-data-total`);
        setSearchResults(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchlist(); // Call the async function inside useEffect
  
    // Specify any dependencies if needed
  }, []);
  

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`/facultytimetable-api/classfaculty-data/${searchId}`);
      if (response.data) {
        setData(response.data);
        setSearchTerm("");
      }
      else {
        setData(null)
        setMessage("No data found for the given ID.")
      }
    } catch (error) {
      console.error('Error:', error);
      setData(null);
    }
  };

  const MyPopoverContent = (cell) => (
    <Popover id="popover-basic">
      <Popover.Body>
        <p>SUBJECT: {cell.subject}</p>
        <p>ROOM-NO: {cell.roomno}</p>
      </Popover.Body>
    </Popover>
  );

  useEffect(() => {
    if (data) {
      printData();
    }
  }, [year, data]);

  const printData = () => {
    const y = year || Object.keys(data)[Object.keys(data).length - 1];
    const unicorn = [];
    for (const day of days) {
      const b = [{ classtype: day }];
      const l = data[y]?.hasOwnProperty(day);
      if (l) {
        for (const time of times) {
          const a = data[y][day]?.hasOwnProperty(time.replace(/\./g, '_'));
          if (a) {
            b.push(data[y][day][time.replace(/\./g, '_')]);
          } else {
            b.push({ name: 'null', roomno: 'null', subjectname: 'null' });
          }
        }
      } else {
        for (let j = 0; j < 8; j++) {
          b.push({ name: 'null', roomno: 'null', subjectname: 'null' });
        }
      }
      unicorn.push(b);
    }
    pegasus = unicorn;
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
      item.username.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
      item.facultytype.toLowerCase().includes(searchTerm.toLowerCase().trim())
  );


  return (
    <div className="container p-5">
      <h3 className="mb-5">Please enter FacultyID for their Time Tables!!!</h3>
      {/* <div className="row">
        <div className="col-lg-3 col-sm-7 p-2">
          <input
            className="form-control me-2"
            type="text"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            placeholder="Enter ID"
          />
        </div>
        <div className="col-lg-3 col-sm-5 p-2">
          <Button
            className="btn btn-success w-50"
            type="submit"
            onClick={handleSearch}
          >
            Search
          </Button>
        </div>
      </div> */}
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
              <div className="search-results">
                {filteredResults.map((user) => (
                  <div
                    key={user._id.$oid}
                    className={`search-result-item ${selectedResult === user ? "selected" : ""
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
          <table className="m-3 mx-auto">
            <thead>
              <tr className="col-lg-4 col-sm-12 col-md-6 p-3">
                <Form.Select value={year} onChange={(e) => setYear(e.target.value)}>
                  <option value={year === '' ? Object.keys(data)[Object.keys(data).length - 1] : ''}>
                    {year === '' ? Object.keys(data)[Object.keys(data).length - 1] : 'Select Year'}
                  </option>

                  {Object.keys(data).slice(4,).map((yearOption) => (
                    <option key={yearOption} value={yearOption}>
                      {yearOption}
                    </option>
                  ))}
                </Form.Select>
              </tr>
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
                      {cellIndex === 0 && cell && Object.keys(cell).length > 0 && (
                        <div className="cell-content">
                          <p>{cell.classtype}</p>
                        </div>
                      )}
                      {cellIndex !== 0 && cell && Object.keys(cell).length > 0 && (
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
    </div>
  );
};

export default Others;