import React, { useState, useEffect } from "react";
import { Modal, Button, Tab } from "react-bootstrap";
import "./othersclass.css";
import Search from "./Search";
import axios from "axios";
let times1 = ["9-10", "10-11", "11-12", "12.40-1.40", "1.40-2.40", "2.40-3.40"];
let times2 = ["10-11", "11-12", "12-1", "1.40-2.40", "2.40-3.40", "3.40-4.40"];
let times;

let days = ["mon", "tue", "wed", "thu", "fri", "sat"];
let phoenix = [];
let setclassid;
const Others = () => {
  const [searchId, setSearchId] = useState("");
  const [functionvalue, setfunction] = useState(0);
  const enterfunction = () => {
    setfunction(1);
  };
  
  const [classdata, setDataclass] = useState(null);
  const [facultydata, setDatafaculty] = useState(null);

  const printdata = () => {
    if (setclassid === "1") times = times1;
    else times = times2;
    for (let i = 0; i < 6; i++) {
      let b = [];
      b.push(days[i]);
      const l = classdata.hasOwnProperty(days[i]);
      if (l) {
        for (let j = 0; j < 6; j++) {
          const a = classdata[days[i]].hasOwnProperty(times[j]);
          if (a) b.push(classdata[days[i]][times[j]]);
          else b.push(b[j]);
        }
      }
      phoenix.push(b);
    }
  };
  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `/classtimetable-api/classtt-data/${searchId}`
      );
      setDataclass(response.data);
      setclassid = searchId[0];
      printdata();
    } catch (error) {
      console.log(error);
    }
    try {
      const response = await axios.get(
        `/classfaculty-api/classfaculty-data/${searchId}`
      );
      setDatafaculty(response.data);
    } catch (error) {
      console.log(error);
    }
    setdisplayvalue(1);
  };
  const [rowactiveIndex, setrowIndex] = useState(null);
  const [colactiveIndex, setcolIndex] = useState(null);
  const [cellvalue, setcellvalue] = useState(false);
  const [cellobject, setcellobject] = useState(null);
  const [labvalue, setlabvalue] = useState(false);
  const [cellobjectlab, setlabobject] = useState(null);
  const [displayvalue, setdisplayvalue] = useState(0);

  const setcellobjectvalue = async (a) => {
    const facultydatainfo = facultydata[a];
    let aa = a.trim();
    if (facultydatainfo) {
      setlabvalue(false);
      setcellobject(facultydatainfo);
      setcellvalue(true);
    } else if (aa.includes("lab")) {
      setlabvalue(true);
      setcellvalue(false);
      let x = aa.split(" ");
      let y = x[0].split("/");
      let arr = [
        facultydata[y[0]],
        facultydata[y[0] + " lab"],
        facultydata[y[1]],
        facultydata[y[1] + " lab"],
      ];
      let array = [];
      setlabobject(arr);
    } else {
      setcellobject(null);
      setlabobject(null);
    }
  };

  let [show, setShow] = useState(false);
  let showModal = () => setShow(true);
  let closeModal = () => setShow(false);

  const handleMouseEnter = (index) => {
    setrowIndex(index[0]);
    setcolIndex(index[1]);
    setcellobjectvalue(index[2]);
    showModal();
  };
  const handleMouseLeave = () => {
    closeModal();
    setrowIndex(null);
    setcolIndex(null);
    setcellobject(null);
    setlabobject(null);
    setcellvalue(false);
    setlabvalue(false);
  };

  return (
    <div className="table-container">
      <div className="row">
        <div className="col-lg-5">
          <input
            className="form-control me-2"
            type="text"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            placeholder="Enter ID"
          />
        </div>
        <div className="col-lg">
          <Button
            className="btn btn-success"
            type="submit"
            onClick={handleSearch}
          >
            search
          </Button>
        </div>
      </div>
      {displayvalue === 1 && (
        <div className="table-container row">
          <table className="col-lg-10 col-md-10 col-sm-8">
            <thead>
              <tr>
                <th>Day</th>
                {setclassid === "1" && <th>9-10</th>}
                <th>10-11</th>
                <th>11-12</th>
                {setclassid !== "1" && <th>12-1</th>}
                {setclassid === "1" && <th>12.40-1.40</th>}
                <th>1.40-2.40</th>
                <th>2.40-3.40</th>
                {setclassid !== "1" && <th>3.40-4.40</th>}
              </tr>
            </thead>
            <tbody>
              {phoenix.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <td
                      key={cellIndex}
                      onMouseEnter={() =>
                        handleMouseEnter([rowIndex, cellIndex, cell])
                      }
                      onMouseLeave={handleMouseLeave}
                    >
                      {cell}
                      {rowactiveIndex === rowIndex &&
                        colactiveIndex === cellIndex &&
                        cellobject &&
                        cellvalue && (
                          <Modal
                            show={show}
                            onHide={closeModal}
                            backdrop="true"
                            centered
                            className="modal1"
                          >
                            <Modal.Body>
                              <p>ID :{cellobject.username}</p>
                              <p>name :{cellobject.name}</p>
                            </Modal.Body>
                          </Modal>
                        )}
                      {rowactiveIndex === rowIndex &&
                        colactiveIndex === cellIndex &&
                        cellobjectlab &&
                        labvalue && (
                          <Modal
                            show={show}
                            onHide={closeModal}
                            backdrop="true"
                            centered
                            className="modal"
                          >
                            <Modal.Body>
                              <div className="modal2">
                                <div className="element">
                                  <p> LAB-1</p>
                                  <p> ID:{cellobjectlab[0].username}</p>
                                  <p> name:{cellobjectlab[0].name}</p>
                                  <p> ID:{cellobjectlab[1].username}</p>
                                  <p> name:{cellobjectlab[1].name}</p>
                                </div>
                                <div className="space"></div>
                                <div className="element">
                                  <p> LAB-2</p>
                                  <p> ID:{cellobjectlab[2].username}</p>
                                  <p> name:{cellobjectlab[2].name}</p>
                                  <p> ID:{cellobjectlab[3].username}</p>
                                  <p> name:{cellobjectlab[3].name}</p>
                                </div>
                              </div>
                            </Modal.Body>
                          </Modal>
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
