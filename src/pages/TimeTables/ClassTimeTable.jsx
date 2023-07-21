/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useContext, useEffect } from 'react'
import axios from 'axios';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Modal, Form, Button } from 'react-bootstrap'
import { loginContext } from '../../contexts/loginContext';


let times1 = ['9-10', '10-11', '11-12', '12.40-1.40', '1.40-2.40', '2.40-3.40']
let times2 = ['10-11', '11-12', '12-1', '1.40-2.40', '2.40-3.40', '3.40-4.40']
let times;

let days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat']
let phoenix = []
let setclassid;

function ClassTimeTable() {
  let [currentUser, loginUser, userLoginStatus, loginErr, logoutUser] = useContext(loginContext)
  let navigate = useNavigate();

  let [graduation, setgraduation] = useState("")
  let [year, setyear] = useState("")
  let [branch, setbranch] = useState("")
  let [sec, setsec] = useState("")
  let [classid, setclassid] = useState("")
  let [graduatevalue, setgraduatevalue] = useState(0)
  const [classdata, setDataclass] = useState(null);
  const [facultydata, setDatafaculty] = useState(null);
  const [rowactiveIndex, setrowIndex] = useState(null);
  const [colactiveIndex, setcolIndex] = useState(null);
  const [cellvalue, setcellvalue] = useState(false);
  const [cellobject, setcellobject] = useState(null)
  const [labvalue, setlabvalue] = useState(false)
  const [cellobjectlab, setlabobject] = useState(null)
  const [displayvalue, setdisplayvalue] = useState(0)
  let [show, setShow] = useState(false);
  let showModal = () => setShow(true);
  let closeModal = () => setShow(false);

  const setcellobjectvalue = async (a) => {
    const facultydatainfo = facultydata[a]
    let aa = a.trim();
    if (facultydatainfo) {
      setlabvalue(false)
      setcellobject(facultydatainfo)
      setcellvalue(true);
    }
    else if (aa.includes('lab')) {
      setlabvalue(true);
      setcellvalue(false);
      let x = aa.split(' ')
      let y = x[0].split('/')
      let arr = [facultydata[y[0]], facultydata[y[0] + ' lab'], facultydata[y[1]], facultydata[y[1] + ' lab']]
      setlabobject(arr)
    }
    else {
      setcellobject(null)
      setlabobject(null)
    }
  }

  const handleMouseEnter = (index) => {
    setrowIndex(index[0]);
    setcolIndex(index[1]);
    setcellobjectvalue(index[2]);
    showModal();
  }
  const handleMouseLeave = () => {
    closeModal();
    setrowIndex(null);
    setcolIndex(null);
    setcellobject(null);
    setlabobject(null)
    setcellvalue(false);
    setlabvalue(false);
  }

  useEffect(() => {
    // This useEffect hook will be triggered whenever the 'data' state changes
    // Call the function only if 'data' is not null (i.e., data is set)
    if (facultydata !== null && classdata !== null) {
      printdata();
    }
  }, [facultydata, classdata]);

  const printdata = () => {
    let unicorn=[]
    if (setclassid === '1')
      times = times1;
    else
      times = times2;
    for (let i = 0; i < 6; i++) {
      let b = [];
      b.push(days[i])
      const l = classdata.hasOwnProperty(days[i])
      if (l) {
        for (let j = 0; j < 6; j++) {
          const a = classdata[days[i]].hasOwnProperty(times[j])
          if (a)
            b.push(classdata[days[i]][times[j]])
          else
            b.push(b[j])
        }
      }
      unicorn.push(b);
    }
    phoenix=unicorn;
    setdisplayvalue(1);
  }

  const handleSearch = async () => {
    try {
      const response = await axios.get(`/classtimetable-api/classtt-data/${classid}`);
      setDataclass(response.data);
      setclassid = classid[0];
    }
    catch (error) {
      console.log(error);
    }
    try {
      const response = await axios.get(`/classfaculty-api/classfaculty-data/${classid}`);
      setDatafaculty(response.data);
    }
    catch (error) {
      console.log(error);
    }
  };


  const handlechangegraduation = (e) => {
    console.log(e.target.value)
    if (e.target.value === "UG")
      setgraduatevalue(1);
    else
      setgraduatevalue(0);
    setgraduation(e.target.value)
    console.log(e.target.value)
    console.log(graduation)
  }
  const handlechangeyear = (e) => {
    setyear(e.target.value);
    console.log(e.target.value)
    console.log(year)
  }
  const handlechangebranch = (e) => {
    setbranch(e.target.value);
    console.log(e.target.value)
    console.log(branch)
  }
  const handlechangesec = (e) => {
    setsec(e.target.value);
    console.log(e.target.value)
    console.log(sec)
  }
  const handlechanges = () => {
    const id = year + branch + sec;
    setclassid(id);
    console.log(year, branch, sec, classid);
    handleSearch();
  }
  const goingback = () => {
    if (userLoginStatus)
      navigate('/adminpage')
    else
      navigate('/')
  }
  return (
    <div className='container'>
      <div className='text-center m-4'>
        <h1>CLASS TIME TABLES</h1>
      </div>
      <div className='row m-2'>
        <div className='col-lg-2 col-sm-8 col-mg-8 mx-auto p-3'>
          <Form.Select value={graduation} onChange={handlechangegraduation}>
            <option>select course</option>
            <option value="UG">UG</option>
            <option value="PG">PG</option>
          </Form.Select>
        </div>
        <div className='col-lg-2 col-sm-8 col-mg-8 mx-auto p-3'>
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
        <div className='col-lg-2 col-sm-8 col-mg-8 mx-auto p-3'>
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
        <div className='col-lg-2 col-sm-8 col-mg-8 mx-auto p-3'>
          <Form.Select value={sec} onChange={handlechangesec}>
            <option>select section</option>
            <option value="1">A</option>
            <option value="2">B</option>
            <option value="3">C</option>
            <option value="4">D</option>
          </Form.Select>
        </div>
        <div className='col-lg-4 col-sm-8 col-mg-8 mx-auto p-3' >
          <Button className='col-lg-5 btn-success' style={{ marginRight: '20px' }} onClick={handlechanges}>SEARCH</Button>
          <Button className='col-lg-5  btn-danger' onClick={goingback}>GOBACK</Button>
        </div>
      </div>
      {displayvalue === 1 && (
        <div className='row'>
          <div className='container m-3'>
              <table className='mx-auto w-75 '>
                <thead>
                  <tr>
                    <th>Day</th>
                    {setclassid === '1' && (<th>9-10</th>)}
                    <th>10-11</th>
                    <th>11-12</th>
                    {setclassid !== '1' && (<th>12-1</th>)}
                    {setclassid === '1' && (<th>12.40-1.40</th>)}
                    <th>1.40-2.40</th>
                    <th>2.40-3.40</th>
                    {setclassid !== '1' && (<th>3.40-4.40</th>)}
                  </tr>
                </thead>
                <tbody>
                  {phoenix.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {row.map((cell, cellIndex) => (
                        <td
                          key={cellIndex}
                          onMouseEnter={() => handleMouseEnter([rowIndex, cellIndex, cell])}
                          onMouseLeave={handleMouseLeave}>
                          {cell}
                          {rowactiveIndex === rowIndex && colactiveIndex === cellIndex && cellobject && cellvalue && (
                            <Modal show={show} onHide={closeModal} backdrop="true" centered className='modal1'>
                              <Modal.Body>
                                <p>ID       :{cellobject.username}</p>
                                <p>name  :{cellobject.name}</p>
                              </Modal.Body>
                            </Modal>
                          )}
                          {rowactiveIndex === rowIndex && colactiveIndex === cellIndex && cellobjectlab && labvalue && (
                            <Modal show={show} onHide={closeModal} backdrop="true" centered className='modal'>
                              <Modal.Body>
                                <div className='modal2'>
                                  <div className='element'>
                                    <p>LAB-1</p>
                                    <p>ID:{cellobjectlab[0].username}</p>
                                    <p>name:{cellobjectlab[0].name}</p>
                                    <p>ID:{cellobjectlab[1].username}</p>
                                    <p>name:{cellobjectlab[1].name}</p>
                                  </div>
                                  <div className='space'></div>
                                  <div className='element'>
                                    <p>LAB-2</p>
                                    <p>ID:{cellobjectlab[2].username}</p>
                                    <p>name:{cellobjectlab[2].name}</p>
                                    <p>ID:{cellobjectlab[3].username}</p>
                                    <p>name:{cellobjectlab[3].name}</p>
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
        </div>
      )}

    </div>

  )
}

export default ClassTimeTable