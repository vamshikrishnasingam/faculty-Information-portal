/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { useAsyncValue, useNavigate } from "react-router-dom";
import { Modal, Form, Button } from "react-bootstrap";
import { loginContext } from "../../contexts/loginContext";
import Search from "../Others/Search";
import Others from "../Others/othersclass";

let times1 = ["9-10", "10-11", "11-12", "12.40-1.40", "1.40-2.40", "2.40-3.40"];
let times2 = ["10-11", "11-12", "12-1", "1.40-2.40", "2.40-3.40", "3.40-4.40"];
let times;

let days = ["mon", "tue", "wed", "thu", "fri", "sat"];
let phoenix = [];
let setclassid;

function Professors() {
  let [currentUser, loginUser, userLoginStatus, loginErr, logoutUser] =
    useContext(loginContext);
  let navigate = useNavigate();

  // let [branch, setbranch] = useState("")
  let [type, settype] = useState("");
  const [facultyvalue, setFacultyValue] = useState("");
  const [searchValue, setsearchValue] = useState("");
  const [facultydata, setDatafaculty] = useState("");
  const [searchId, setSearchId] = useState("");

  const handleSearch = async () => {
    let array = [];
    try {
      const response = await axios.get(
        `/facultytimetable-api/classfaculty-data/${searchId}`
      );
      setDatafaculty(response.data);
      console.log(response.data);
      array.push(response.data);
    } catch (error) {
      console.log(error);
    }
    if (array) {
      setsearchValue("1");
      setFacultyValue("0")
    }
    else setsearchValue("0");
  };

  const handlechangetype = (e) => {
    settype(e.target.value);
  };
  const handlechanges = async () => {
    let array = [];
    try {
      const response = await axios.get(
        `/facultytimetable-api/faculty-data/${type}`
      );
      setDatafaculty(response.data);
      array.push(response.data);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
    if (array) { 
    setFacultyValue("1");
    setsearchValue("0")
   }
    else setFacultyValue("0");
  };
  const goingback = () => {
    if (userLoginStatus) navigate("/adminpage");
    else navigate("/");
  };
  return (
    <div className="container mx-auto">
      <div className="row m-4">
        <div className="col-lg-8 col-sm-10 col-md-3 p-3">
          <h1>FACULTY INFO</h1>
        </div>
        {/* <div className='col-lg-3 col-sm-10 col-md-3 ms-auto p-3'>
          <Others/>
        </div> */}
        <div className="col-lg-4 col-sm-10 col-md-3 p-3">
          <div className="row">
            <div className="col-lg-7">
              <input
                className="form-control me-2"
                type="text"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder="Search by ID"
              />
            </div>
            <div className="col-lg-5">
              <Button
                className="btn btn-success w-100"
                type="submit"
                onClick={handleSearch}
              >
                search
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="row m-2">
        <div className="col-lg-4 col-sm-10 col-md-3 p-3">
          <Form.Select value={type} onChange={handlechangetype}>
            <option>select Type</option>
            <option value="Professor">Professors</option>
            <option value="Asst. Prof">Assistent Professors</option>
            <option value="Assoc.Prof">Associate Professors</option>
          </Form.Select>
        </div>
        <div className="col-lg-8 col-sm-10 col-mg-8 mx-auto p-3">
          <Button
            className="col-lg-2 col-sm-6  btn-success"
            style={{ marginRight: "30px" }}
            onClick={handlechanges}
          >
            FETCH
          </Button>
          <Button className="col-lg-2 col-sm-5  btn-danger" onClick={goingback}>
            GOBACK
          </Button>
        </div>
      </div>
      <div className="container">
        {searchValue === "1" && (
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
                <tr key={facultydata.username}>
                  <td>{facultydata.username}</td>
                  <td>{facultydata.name}</td>
                  <td>{facultydata.facultytype}</td>
                  <td>
                    <Button className="btn-success" onClick={handleSearch}>
                      Timetable
                    </Button>
                  </td>
                </tr>
            </tbody>
          </table>
        )}
      </div>
      <div className="container">
        {facultyvalue === "1" && (
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
              {facultydata.map((row) => (
                <tr key={row.username}>
                  <td>{row.username}</td>
                  <td>{row.name}</td>
                  <td>{row.facultytype}</td>
                  <td>
                    <Button className="btn-success" onClick={handleSearch}>
                      Timetable
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Professors;
