/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useContext, useEffect } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { OverlayTrigger, Popover, Form, Button } from 'react-bootstrap'
import { loginContext } from '../../../contexts/loginContext';
let times1 = ['9-10', '10-11', '11-12', '12.40-1.40', '1.40-2.40', '2.40-3.40']
let times2 = ['10-11', '11-12', '12-1', '1.40-2.40', '2.40-3.40', '3.40-4.40']
let times;
let days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat']
function ClassTimeTable() {

  const [currentUser, loginUser, userLoginStatus, loginErr, logoutUser] = useContext(loginContext)
  const navigate = useNavigate();
  const [checkid, setcheckid] = useState("")
  const [graduation, setgraduation] = useState("")
  const [year, setyear] = useState("")
  const [branch, setbranch] = useState("")
  const [sec, setsec] = useState("")
  const [classid, setclassid] = useState("")
  const [academicyear, setacademicyear] = useState("");
  const [sem, setsem] = useState("")
  let [graduatevalue, setgraduatevalue] = useState(0)
  const [phoenix, setphoenix] = useState([])

  const [classdata, setDataclass] = useState(null);
  const [facultydata, setfacultydata] = useState(null);
  const [rowactiveIndex, setrowIndex] = useState(null);
  const [colactiveIndex, setcolIndex] = useState(null);
  const [cellvalue, setcellvalue] = useState(false);
  const [cellobject, setcellobject] = useState(null)
  const [labvalue, setlabvalue] = useState(false)
  const [cellobjectlab, setlabobject] = useState(null)
  const [displayvalue, setdisplayvalue] = useState(0)
  const [errorvalue,seterrorvalue]=useState(0)
  const [semester, setsemester] = useState("")
  let mainKeys = []
  let columnKeys = []

  let [show, setShow] = useState(false);
  let showModal = () => setShow(true);
  let closeModal = () => setShow(false);
  const [showText, setShowText] = useState(false)
  const handleenter = e => {
    setShowText(true)
  }
  const handleLeave = e => {
    setShowText(false)
  }
  const setcellobjectvalue = async (a) => {
    let aa = a.trim();
    const facultydatainfo = facultydata[aa]
    if (aa.includes('lab')) {
      let x = aa.split(' ')
      let y = x[0].split('/')
      let arr = [facultydata[y[0]], facultydata[y[0] + ' lab'], facultydata[y[1]], facultydata[y[1] + ' lab']]
      setlabobject(arr)
      setlabvalue(true);
      setcellvalue(false);
    }
    else if (facultydatainfo) {
      setlabvalue(false)
      setcellobject(facultydatainfo)
      setcellvalue(true);
    }
    else {
      const obj = {};
      obj.username = ' ';
      obj.name = ' ';
      setcellobject(obj)
      setlabobject([obj, obj, obj, obj]);
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

  const MyPopoverContent = (cell) => (
    <Popover id="popover-basic">
      <Popover.Body>
        {/* <p>SUBJECT-NAME: {cell.subjectname}</p> */}
        {!cell.subject.includes('/') && (
          <div>
         <p>ID :{cell.username}</p>
          <p>NAME :{cell.name}</p>
          </div>
        )}
        {cell.subject.includes('/') && (
          <p>lab data not available yet..!!</p>
        )}
      </Popover.Body>
    </Popover>
  );

  useEffect(() => {
    if (classid !== "" && sem !== "" && academicyear !== "")
      handleSearch();
  }, [classid, sem, academicyear, graduation]);

  useEffect(() => {
    if (classdata !== null) {
      printdata();
    }
    else{
      setdisplayvalue(0);
    }
  }, [classdata]);

  useEffect(() => {
    if (phoenix.length > 0)
      setdisplayvalue(1);
    else
      setdisplayvalue(0)
  }, [phoenix])

  const printdata = () => {
    if (checkid === '1')
      times = times1;
    else
      times = times2;
    const classdt = classdata[classid][academicyear][graduation][sem]  
      const mainKeysextra = Object.keys(classdt);
      mainKeys = mainKeysextra;
      const columnKeysextra = mainKeys.length > 0 ? Object.keys(classdt[mainKeys[0]]) : [];
      columnKeys = columnKeysextra
      console.log(classdt, mainKeys, columnKeys)
      let b = [];
      for (let i = 0; i < 6; i++)
        b.push(columnKeys[i]);
      let unicorn = [];
      for (let i = 0; i < 6; i++) {
        b = [];
        b.push({ 'subject': mainKeys[i] })
        for (let j = 0; j < 6; j++) {
          b.push(classdt[mainKeys[i]][columnKeys[j]])
        }
        unicorn.push(b);
      }
      setphoenix(unicorn);
  }


  const handleSearch = async () => {
    console.log(academicyear, classid, sem, graduation)
    console.log('api call')
      await axios.get(`/classtimetable-api/classtt-data/${classid}/${academicyear}/${graduation}/${sem}`)
      .then((response) => {
        console.log('api ca;; : ',response.data)
        setDataclass(response.data)
      })
      .catch((error) => {
        setDataclass(null)
        console.log(error)
      });
  };

  const handlechangegraduation = (e) => {
    console.log(e.target.value)
    if (e.target.value === "Btech")
      setgraduatevalue(1);
    else
      setgraduatevalue(0);
    setgraduation(e.target.value)
  }

  const handlechangeacademicyear = (e) => {
    setacademicyear(e.target.value);
  }

  const handlechangeyear = (e) => {
    setyear(e.target.value);
    setcheckid(e.target.value);
  }

  const handlechangebranch = (e) => {
    setbranch(e.target.value);
  }

  const handlechangesec = (e) => {
    setsec(e.target.value);
  }

  const handlechangesem = (e) => {
    let x = e.target.value
    x = year + "-" + x
    setsem(x);
    setsemester(e.target.value)
  }

  const handlechanges = () => {
    const id = year + branch + sec;
    setclassid(id);
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
          <Form.Select value={academicyear} onChange={handlechangeacademicyear}>
            <option>Academic year</option>
            <option value='2023-2024'>2023-2024</option>
            <option value='2024-2025'>2024-2025</option>
          </Form.Select>
        </div>
        <div className='col-lg-2 col-sm-8 col-mg-8 mx-auto p-3'>
          <Form.Select value={graduation} onChange={handlechangegraduation}>
            <option>select course</option>
            <option value="Btech">UG</option>
            <option value="Mtech">PG</option>
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
          <Form.Select value={semester} onChange={handlechangesem}>
            <option>select sem</option>
            <option value="1">1</option>
            <option value="2">2</option>
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

        <div className='col-lg-4 col-sm-8 col-mg-8 mx-auto p-3' style={{ position: 'relative' }} >
          <Button
            onMouseEnter={handleenter}
            onMouseLeave={handleLeave}
            className=' col-lg-5 btn-success' style={{ marginRight: '20px' }} onClick={handlechanges}>SEARCH</Button>
          {/* <Button className='col-lg-5  btn-danger' onClick={goingback}>GOBACK</Button> */}
        </div>
      </div>
      {displayvalue === 1 && errorvalue==0 && (
        <div className='row'>
          <div className='container m-3' style={{ "overflow-x": 'auto' }}>
            <table className='mx-auto w-75 '>
              <thead>
                <tr>
                  <th>Day</th>
                  {checkid === '1' && (<th>9-10</th>)}
                  <th>10-11</th>
                  <th>11-12</th>
                  {checkid !== '1' && (<th>12-1</th>)}
                  {checkid === '1' && (<th>12.40-1.40</th>)}
                  <th>1.40-2.40</th>
                  <th>2.40-3.40</th>
                  {checkid !== '1' && (<th>3.40-4.40</th>)}
                </tr>
              </thead>
              <tbody>
                {phoenix.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {console.log(row)}
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex}>
                      {cellIndex === 0 && cell && Object.keys(cell).length > 0 && (
                        <div className="cell-content">
                          <p>{cell.subject}</p>
                        </div>
                      )}
                      {cellIndex !== 0 && cell && Object.keys(cell).length > 0 && (
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
                      // <td
                      //   key={cellIndex}
                      // // onMouseEnter={() => handleMouseEnter([rowIndex, cellIndex, cell])}
                      // // onMouseLeave={handleMouseLeave}
                      // >
                      //   <tr>{cell.subjectname}</tr>
                      //   {/* {rowactiveIndex === rowIndex && colactiveIndex === cellIndex && cellobject && cellvalue && (
                      //     <Modal show={show} onHide={closeModal} backdrop="true" centered className='modal1'>
                      //       <Modal.Body >
                      //       <p>ID       :{cellobject.username}</p>
                      //         <p>name  :{cellobject.name}</p>
                      //       </Modal.Body>
                      //     </Modal>
                      //   )}
                      //   {rowactiveIndex === rowIndex && colactiveIndex === cellIndex && cellobjectlab && labvalue && (
                      //     <Modal
                      //       show={show} onHide={closeModal} backdrop="true"  centered className='modal'>
                      //       <Modal.Body>
                      //         <div className='modal2'>
                      //           <div className='element'>
                      //             <p>LAB-1</p>
                      //             <p>ID:{cellobjectlab[0].username}</p>
                      //             <p>name:{cellobjectlab[0].name}</p>
                      //             <p>ID:{cellobjectlab[1].username}</p>
                      //             <p>name:{cellobjectlab[1].name}</p>
                      //           </div>
                      //           <div className='space'></div>
                      //           <div className='element'>
                      //             <p>LAB-2</p>
                      //             <p>ID:{cellobjectlab[2].username}</p>
                      //             <p>name:{cellobjectlab[2].name}</p>
                      //             <p>ID:{cellobjectlab[3].username}</p>
                      //             <p>name:{cellobjectlab[3].name}</p>
                      //           </div>
                      //         </div>
                      //       </Modal.Body>
                      //     </Modal>
                      //   )} */}
                      // </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {errorvalue ===1 && (
        <div>no data found</div>
      )}

    </div>

  )
}

export default ClassTimeTable;