import React, { useState, useContext, useEffect, useRef } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { Dropdown } from "react-bootstrap";
import { Button } from "react-bootstrap";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router-dom";
import { loginContext } from "../../contexts/loginContext";
import { useSpring, animated } from "react-spring";
function FreeFaculty() {
  let [currentUser, loginUser, userLoginStatus, loginErr, logoutUser] =
    useContext(loginContext);
  let navigate = useNavigate();
  const [searchTime1, setSearchTime1] = useState("");
  const [searchTime2, setSearchTime2] = useState("");
  const [freeFaculty, setFreeFaculty] = useState("");
  const [truevalue, setTrueValue] = useState("");
  const [facultyvalue, setFacultyValue] = useState("");
  const [freeFacultyInfo, setFreeFacultyInfo] = useState("");
  const [date, setSelectedOption] = useState("");
  const [dateError, setDateError] = useState("");
  const [st1error, setst1error] = useState("");
  const [st2error, setst2error] = useState("");
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [selectedOptionsError, setSelectedOptionsError] = useState("");
  const initialRender = useRef(true);

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
    setDateError("");
  };

  const handleDownload = () => {
    // Create a CSV string from the data in freeFacultyInfo
    const csvData = freeFacultyInfo
      .map((row) => `${row.username},${row.name},${row.facultytype}`)
      .join("\n");
    // Create a Blob with the CSV data
    const blob = new Blob([csvData], { type: "text/csv" });
    // Create a URL for the Blob
    const url = URL.createObjectURL(blob);
    // Create a link element for downloading
    const a = document.createElement("a");
    a.href = url;
    a.download = "faculty_info.csv";
    // Trigger the download
    a.click();
    // Release the URL object
    URL.revokeObjectURL(url);
  };

  const getdata = async () => {
    let array = [];
    setFreeFacultyInfo(array);
    setFacultyValue("0");
    for (let i = 0; i < freeFaculty.length; i++) {
      try {
        const response = await axios.get(
          `/facultylist-api/faculty-data/${freeFaculty[i]}`
        );
        array.push(response.data);
      } catch (error) {
        console.log(error);
      }
    }
    if (array.length) {
      console.log(array.length);
      setFacultyValue("1");
      setFreeFacultyInfo(array);
    } else setFacultyValue("0");
    console.log(freeFacultyInfo);
  };
  useEffect(() => {
    if (freeFacultyInfo.length) setFacultyValue("1");
    else {
      setFacultyValue("0");
    }
  }, [freeFacultyInfo]);
  const handleSearch = async () => {
    // Function to subtract minutes from a given time
    function adjustTime(time, minutes) {
      const [hour, minute = "00"] = time.split(".");
      const totalMinutes = parseInt(hour) * 60 + parseInt(minute) + minutes;
      const newHour = Math.floor(totalMinutes / 60);
      const newMinute = totalMinutes % 60;
      // Format the result
      const formattedHour = String(newHour).padStart(2, "0");
      const formattedMinute = String(newMinute).padStart(2, "0");
      return `${formattedHour}.${formattedMinute}`;
    }
    //function to change format of time
    function hrtomin(time) {
      const [hours1, minutes1 = "0"] = time.split(".").map(Number);
      return parseInt(hours1) * 60 + parseInt(minutes1);
    }

    let dummysearchTime1 = adjustTime(searchTime1, -20); // 20 minutes earlier
    let dummysearchTime2 = adjustTime(searchTime2, 20); // 20 minutes later
    const start = dummysearchTime1;
    const end = dummysearchTime2;
    const [startHour, startMinute = "00"] = start.split(".");
    const [endHour, endMinute = "00"] = end.split(".");
    if (parseInt(startHour, 10) > parseInt(endHour, 10)) {
      setTrueValue("0");
      setFreeFaculty("");
      setFacultyValue("0");
    } else setTrueValue("1");
    const sh1 = startHour;
    const sm1 = "00";
    let sh2 = startHour - 1;
    const sm2 = "40";
    let eh1 = endHour;
    let eh2 = endHour;
    const em1 = "00";
    const em2 = "40";
    const startTotal1 = parseInt(sh1, 10);
    let endTotal1 = parseInt(eh1, 10);
    if (endMinute !== "00") endTotal1 += 1;
    const numParts1 = Math.floor(endTotal1 - startTotal1);
    const parts = [];
    let currentHour = startTotal1;
    for (let i = 0; i < numParts1; i++) {
      const partStartHour = Math.floor(currentHour);
      const partEndHour = Math.floor(currentHour + 1);
      let formattedPartStartHour = `${partStartHour}`;
      let formattedPartEndHour = `${partEndHour}`;
      if (formattedPartEndHour > 12)
        formattedPartEndHour = formattedPartEndHour - 12;
      if (formattedPartStartHour > 12)
        formattedPartStartHour = formattedPartStartHour - 12;
      const partString = `${formattedPartStartHour}-${formattedPartEndHour}`;
      parts.push(partString);
      currentHour += 1;
    }
    let startTotal2 = parseInt(sh2, 10);
    if (startMinute > "40") startTotal2 += 1;
    let endTotal2 = parseInt(eh2, 10);
    if (endMinute > "40") endTotal2 += 1;
    const numParts2 = Math.floor(endTotal2 - startTotal2);
    currentHour = startTotal2;
    for (let i = 0; i < numParts2; i++) {
      let partStartHour = Math.floor(currentHour);
      const partStartMinute = "40";
      let partEndHour = Math.floor(currentHour + 1);
      const partEndMinute = "40";
      if (partStartHour > 12) partStartHour = partStartHour % 12;
      if (partEndHour > 12) partEndHour = partEndHour % 12;
      let formattedPartStartHour = `${partStartHour}.${partStartMinute}`;
      let formattedPartEndHour = `${partEndHour}.${partEndMinute}`;
      const partString = `${formattedPartStartHour}-${formattedPartEndHour}`;
      parts.push(partString);
      currentHour += 1;
    }
    setDateError("");
    setst1error("");
    setst2error("");
    setSelectedOptionsError("");
    let isvalid = true;
    if (date.trim() === "") {
      setDateError("Please select a week");
      isvalid = false;
    }
    if (searchTime1.length === 0) {
      setst1error("please enter beginning time");
      isvalid = false;
    }
    if (searchTime2.length === 0) {
      setst2error("please enter ending time");
      isvalid = false;
    }
    if (hrtomin(searchTime1) > 24 * 60) {
      setst1error("please enter correct time");
      isvalid = false;
    }
    if (hrtomin(searchTime2) > 24 * 60) {
      setst2error("please enter correct time");
      isvalid = false;
    }
    if (!selectedOptions.length) {
      setSelectedOptionsError("please select any one option");
      isvalid = false;
    }
    if (hrtomin(searchTime2) <= hrtomin(searchTime1)) {
      setst2error("enter time in 24 hour format");
      isvalid = false;
    }

    if (isvalid) {
      try {
        await axios
          .get(
            `/freehours-api/freehours-get/${date}/${parts}/${selectedOptions}`
          )
          .then((response) => {
            console.log("Success:", response.data);
            setFreeFaculty(response.data);
          })
          .catch((error) => {
            console.error("Error:", error);
            setFreeFaculty(null);
          });
      } catch (error) {
        console.log(error);
      }
    } else {
      setFreeFaculty(null);
    }
  };
  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }
    getdata();
  }, [freeFaculty]);
  useEffect(() => {
    if (
      date &&
      selectedOptions.length &&
      searchTime1 !== "" &&
      searchTime2 !== ""
    )
      handleSearch();
  }, [selectedOptions, searchTime1, searchTime2, date]);

  const handleyearchange = (event) => {
    const optionId = event.target.id;
    const isChecked = event.target.checked;

    if (isChecked) {
      setSelectedOptions([...selectedOptions, optionId]);
    } else {
      setSelectedOptions(
        selectedOptions.filter((option) => option !== optionId)
      );
    }
  };
  const strobeAnimation = useSpring({
    to: async (next) => {
      await next({ opacity: 1 });
      await next({ opacity: 1 });
    },
    from: { opacity: 0 },
    config: { duration: 900 },
  });
  return (
    <animated.div style={strobeAnimation} className="p-4">
      <h1 className="p-2 m-1 text-center text-white">FREE FACULTY</h1>
      <hr />
      <div className="row p-3 m-4">
        <div className="col-lg-2 col-md-6 col-sm-12 p-1">
          <Form.Select
            className="p-3"
            value={date}
            onChange={handleOptionChange}
            isInvalid={!!dateError}
          >
            <option>-- Select day--</option>
            <option value="mon">monday</option>
            <option value="tue">tuesday</option>
            <option value="wed">wednesday</option>
            <option value="thu">thursday</option>
            <option value="fri">friday</option>
            <option value="sat">saturday</option>
            <Form.Control.Feedback type="invalid">
              {dateError}
            </Form.Control.Feedback>
          </Form.Select>
          {dateError && <div className="invalid-feedback">{dateError}</div>}
        </div>
        <div className="form-floating  col-lg-2 col-md-6 p-1">
          <FloatingLabel
            controlId="floatingInput"
            label="Enter the starting time"
            value={searchTime1}
            onChange={(e) => setSearchTime1(e.target.value)}
            isInvalid={st1error}
            style={{
              borderRadius: "7px",
              border: st1error ? "2px solid #dc3545" : "1px solid #ced4da",
            }}
          >
            <Form.Control type="text" placeholder="Enter the starting time" />
          </FloatingLabel>
          {st1error && <div className="text-danger">{st1error}</div>}
        </div>
        <div className="form-floating col-lg-2 col-md-6 p-1">
          <FloatingLabel
            controlId="floatingInput"
            label="Enter the ending time"
            value={searchTime2}
            isInvalid={!!st2error}
            onChange={(e) => setSearchTime2(e.target.value)}
            style={{
              borderRadius: "7px",
              border: st2error ? "2px solid #dc3545" : "1px solid #ced4da",
            }}
          >
            <Form.Control type="text" placeholder="Enter the ending time" />
          </FloatingLabel>
          {st2error && <div className="text-danger">{st2error}</div>}
        </div>
        <div className="col-lg-2 col-md-6 p-1">
          <Dropdown className="w-100">
            <Dropdown.Toggle
              className={`bg-white w-100 p-3`}
              variant=""
              id="dropdown-basic"
              style={{
                borderRadius: "7px",
                border: selectedOptionsError
                  ? "2px solid #dc3545"
                  : "1px solid #ced4da",
              }}
            >
              Examination Years
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Form>
                <div className="p-3">
                  <Form.Check
                    id="1"
                    label="I Year"
                    onChange={handleyearchange}
                  />
                  <Form.Check
                    id="2"
                    label="II Year"
                    onChange={handleyearchange}
                  />
                  <Form.Check
                    id="3"
                    label="III Year"
                    onChange={handleyearchange}
                  />
                  <Form.Check
                    id="4"
                    label="IV Year"
                    onChange={handleyearchange}
                  />
                  <Form.Check
                    id="0"
                    label="Others"
                    onChange={handleyearchange}
                  />
                </div>
              </Form>
            </Dropdown.Menu>
            {selectedOptionsError && (
              <div className="text-danger">{selectedOptionsError}</div>
            )}
          </Dropdown>
        </div>
        <div className="col-lg-2 col-md-6 col-sm-6 text-end">
          <Button
            onClick={handleSearch}
            className="p-3 m-1 w-100 bg-success border-success"
          >
            Search
          </Button>
        </div>
      </div>
      {truevalue === "0" && facultyvalue === "0" && (
        <div className="text-center text-danger">
          <h1>Enter Correct Timings.....!!</h1>
        </div>
      )}
      {truevalue === "1" &&
        facultyvalue === "1" &&
        freeFacultyInfo.length > 0 && (
          <div>
            <div className="row">
              <h3 className="text-primary p-2 text-center">
                Total faculty available :
                <span className="text-success text-right p-3 mx-auto">
                  {freeFacultyInfo.length}
                </span>
                <Button onClick={handleDownload} className="p-3 btn-success">
                  Download
                </Button>
              </h3>
            </div>
            <table className="m-4 mx-auto">
              <thead className="text-dark">
                <tr>
                  <th>faculty-id</th>
                  <th>faculty-name</th>
                  <th>faculty-type</th>
                </tr>
              </thead>
              <tbody>
                {freeFacultyInfo.map((row) => (
                  <tr key={row.username}>
                    <td>{row.username}</td>
                    <td>{row.name}</td>
                    <td>{row.facultytype}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
    </animated.div>
  );
}

export default FreeFaculty;
