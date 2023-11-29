/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useContext, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSpring, animated } from "react-spring";
import { OverlayTrigger, Popover, Form, Button } from "react-bootstrap";
import { loginContext } from "../../../contexts/loginContext";
let times1 = ["9-10", "10-11", "11-12", "12.40-1.40", "1.40-2.40", "2.40-3.40"];
let times2 = ["10-11", "11-12", "12-1", "1.40-2.40", "2.40-3.40", "3.40-4.40"];
let times;
let days = ["mon", "tue", "wed", "thu", "fri", "sat"];
function ClassTimeTable() {
  const [currentUser, loginUser, userLoginStatus, loginErr, logoutUser] =
    useContext(loginContext);
  const navigate = useNavigate();
  const [checkid, setcheckid] = useState("");
  const [graduation, setgraduation] = useState("");
  const [year, setyear] = useState("");
  const [branch, setbranch] = useState("");
  const [sec, setsec] = useState("");
  const [classid, setclassid] = useState("");
  const [academicyear, setacademicyear] = useState("");
  const [sem, setsem] = useState("");
  const [graduatevalue, setgraduatevalue] = useState(0);
  const [phoenix, setphoenix] = useState([]);
  const [classdata, setDataclass] = useState(null);
  const [displayvalue, setdisplayvalue] = useState(0);
  const [errorvalue, seterrorvalue] = useState(0);
  const [semester, setsemester] = useState("");

  let mainKeys = [];
  let columnKeys = [];

  const initialRender = useRef(true);

  useEffect(() => {
    // Skip the effect on the initial render
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }
    if (classdata !== null) {
      printdata();
    } else {
      setdisplayvalue(0);
      seterrorvalue(1);
    }
  }, [classdata]);

  useEffect(() => {
    if (phoenix !== null) {
      setdisplayvalue(1);
      seterrorvalue(0);
    } else {
      setdisplayvalue(0);
      seterrorvalue(1);
    }
  }, [phoenix]);

  // Rest of your component cod
  const MyPopoverContent = (cell) => (
    <Popover id="popover-basic">
      <Popover.Body>
        {cell.hasOwnProperty("class") && !cell.subject.includes("/") && (
          <div>
            {cell.subject.toUpperCase().includes("PE-") && (
              <p>PROFESSIONAL ELECTIVE</p>
            )}
            {cell.subject.toUpperCase().includes("OE-") && <p>OPEN ELECTIVE</p>}
            {!cell.subject.toUpperCase().includes("PE-") &&
              !cell.subject.toUpperCase().includes("OE-") && (
                <div>
                  <p>ID :{cell.username}</p>
                  <p>NAME :{cell.name}</p>
                  <p>ROOM NO :{cell.roomno}</p>
                </div>
              )}
          </div>
        )}
        {cell.subject.includes("/") && cell.hasOwnProperty("labA") && (
          <div>
            <div>
              <p>LAB : {cell["labA"].subject}</p>
              <p>ID :{cell["labA"].username}</p>
              <p>NAME :{cell["labA"].name}</p>
              <p>ROOM NO :{cell["labA"].roomno}</p>
            </div>
            <div>
              <p>------------------------</p>
            </div>
            <div>
              <p>LAB : {cell["labB"].subject}</p>
              <p>ID :{cell["labB"].username}</p>
              <p>NAME :{cell["labB"].name}</p>
              <p>ROOM NO :{cell["labB"].roomno}</p>
            </div>
          </div>
        )}
      </Popover.Body>
    </Popover>
  );

  const handlechangeacademicyear = (e) => {
    setacademicyear(e.target.value);
  };

  const handlechangeyear = (e) => {
    setyear(e.target.value);
    setcheckid(e.target.value);
  };

  const handlechangebranch = (e) => {
    setbranch(e.target.value);
  };

  const handlechangesec = (e) => {
    setsec(e.target.value);
  };

  const handlechangesem = (e) => {
    setsemester(e.target.value);
  };

  useEffect(() => {
    const handlechanges = () => {
      const id = year + branch + sec;
      setclassid(id);
    };
    handlechanges();
  }, [semester, year, sec, academicyear, graduation, branch]);

  useEffect(() => {
    if (semester !== "" && year !== "") {
      let x = year + "-" + semester;
      setsem(x);
    }
  }, [semester, year]);

  useEffect(() => {
    if (phoenix.length > 0) setdisplayvalue(1);
    else setdisplayvalue(0);
  }, [phoenix]);

  const printdata = () => {
    if (checkid === "1") times = times1;
    else times = times2;
    const classdt = classdata[classid][academicyear][graduation][sem];
    const mainKeysextra = Object.keys(classdt);
    mainKeys = mainKeysextra;
    const columnKeysextra = mainKeys.length > 0 ? Object.keys(classdt[mainKeys[0]]) : [];
    columnKeys = columnKeysextra;
    let b = [];
    for (let i = 0; i < 6; i++) b.push(columnKeys[i]);
    let unicorn = [];
    for (let i = 0; i < 6; i++) {
      b = [];
      b.push({ subject: mainKeys[i] });
      for (let j = 0; j < 6; j++) {
        b.push(classdt[mainKeys[i]][columnKeys[j]]);
      }
      unicorn.push(b);
    }
    seterrorvalue(0);
    setphoenix(unicorn);
  };

  const handleSearch = async () => {
    await axios
      .get(
        `/classtimetable-api/classtt-data/${classid}/${academicyear}/${graduation}/${sem}`
      )
      .then((response) => {
        console.log("api call : ", response.data);
        setDataclass(response.data);
      })
      .catch((error) => {
        setDataclass(null);
        console.log(error);
      });
  };

  const handlechangegraduation = (e) => {
    if (e.target.value === "Btech") setgraduatevalue(1);
    else setgraduatevalue(0);
    setgraduation(e.target.value);
  };

  const goingback = () => {
    if (userLoginStatus) navigate("/adminpage");
    else navigate("/");
  };

  const textProps = useSpring({
    from: { width: "50%" },
    to: { width: "100%" },
    config: { duration: 1000 },
  });
  const props = useSpring({
    opacity: 1,
    transform: "translateY()",
    from: { opacity: 0, transform: "translateY()" },
    config: { duration: 1000 },
  });
  return (
    <animated.div style={props} className="container text-white p-4">
      <h1 className="p-2 m-1 text-center">CLASS TIME TABLES</h1>
      <hr />
      <div className="row m-2">
        <div className="col-lg-2 col-sm-12 col-md-4 p-3">
          <Form.Select value={academicyear} onChange={handlechangeacademicyear}>
            <option>Academic year</option>
            <option value="2023-2024">2023-2024</option>
            <option value="2024-2025">2024-2025</option>
          </Form.Select>
        </div>
        <div className="col-lg-2 col-sm-12 col-md-4 p-3">
          <Form.Select value={graduation} onChange={handlechangegraduation}>
            <option>select course</option>
            <option value="Btech">UG</option>
            <option value="Mtech">PG</option>
          </Form.Select>
        </div>
        <div className="col-lg-2 col-sm-12 col-md-4 p-3">
          <Form.Select value={year} onChange={handlechangeyear}>
            <option>select year</option>
            <option value="1">I</option>
            <option value="2">II</option>
            {graduatevalue === 1 && (
              <>
                <option value="3">III</option>
                <option value="4">IV</option>
              </>
            )}
          </Form.Select>
        </div>
        <div className="col-lg-2 col-sm-12 col-md-4 p-3">
          <Form.Select value={branch} onChange={handlechangebranch}>
            <option>select branch</option>
            <option value="aiml">AIML</option>
            <option value="cse">CSE</option>
            <option value="csbs">CSBS</option>
            <option value="it">IT</option>
            <option value="ds">DS</option>
            <option value="aids">AIDS</option>
            <option value="ece">ECE</option>
            <option value="eee">EEE</option>
            <option value="eie">EIE</option>
            <option value="civil">CIVIL</option>
            <option value="mech">MECH</option>
          </Form.Select>
        </div>
        <div className="col-lg-2 col-sm-12 col-md-4 p-3">
          <Form.Select value={semester} onChange={handlechangesem}>
            <option>select sem</option>
            <option value="1">1</option>
            <option value="2">2</option>
          </Form.Select>
        </div>
        <div className="col-lg-2 col-sm-12 col-md-4 p-3">
          <Form.Select value={sec} onChange={handlechangesec}>
            <option>select section</option>
            <option value="1">A</option>
            <option value="2">B</option>
            <option value="3">C</option>
            <option value="4">D</option>
          </Form.Select>
        </div>

        <div
          className="col-lg-2 col-sm-12 col-md-4 p-3"
        >
          <Button
            className="w-100 btn-success"
            onClick={handleSearch}
          >
            SEARCH
          </Button>
          {/* <Button className='col-lg-5  btn-danger' onClick={goingback}>GOBACK</Button> */}
        </div>
      </div>
      {displayvalue === 1 && errorvalue == 0 && (
        <div className="row">
          <div className="container m-3" style={{ "overflow-x": "auto" }}>
            <table className="mx-auto w-75 ">
              <thead>
                <tr>
                  <th>Day</th>
                  {checkid === "1" && <th>9-10</th>}
                  <th>10-11</th>
                  <th>11-12</th>
                  {checkid !== "1" && <th>12-1</th>}
                  {checkid === "1" && <th>12.40-1.40</th>}
                  <th>1.40-2.40</th>
                  <th>2.40-3.40</th>
                  {checkid !== "1" && <th>3.40-4.40</th>}
                </tr>
              </thead>
              <tbody>
                {phoenix.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex}>
                        {cell && Object.keys(cell).length === 1 && (
                          <div className="cell-content">
                            <p>{cell.subject}</p>
                          </div>
                        )}
                        {cellIndex !== 0 &&
                          cell &&
                          Object.keys(cell).length !== 1 && (
                            <div className="cell-content">
                              <OverlayTrigger
                                trigger="hover"
                                placement="right"
                                overlay={MyPopoverContent(cell)}
                              >
                                <p className="popover-button">{cell.subject}</p>
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
        </div>
      )}
      {errorvalue === 1 && <div>no data found</div>}
    </animated.div>
  );
}

export default ClassTimeTable;
