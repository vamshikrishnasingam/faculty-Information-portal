import React, { useEffect, useState } from 'react'
import { Button, Form, Dropdown } from "react-bootstrap";
import axios from 'axios';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import './History.css'
import { useSpring, animated } from "react-spring";

function History() {

  const [years, setSelectedYears] = useState([])
  const [factype, setfactype] = useState("");
  const [classtt, setclasstt] = useState([])
  const [availabledata, setad] = useState([])
  const [nonavailabledata, setnad] = useState([])
  const [classtimetables, sctt] = useState([])
  const [graduation, setgraduation] = useState("")
  const [academicyear, setacademicyear] = useState("")
  const [branches, setbranches] = useState([])
  const [secs, setsecs] = useState([])
  const [sem, setsem] = useState("")
  const [type, settype] = useState("")
  const [classvalue, setclassvalue] = useState(0)
  const [facvalue, setfacvalue] = useState(0)
  const [dv, setavailabledv] = useState(0)
  const [ndv, setnonavailabledv] = useState(0)
  const [filtervlaue, setfilter] = useState(0);
  const [factypearray, settypes] = useState([]);
  const [facultyData, setFacultyData] = useState([]);//etw4ye
  const [sortedfacultyData, setSortedFacultyData] = useState([]);
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedResult, setSelectedResult] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [downloaddata, setdownloaddata] = useState([]);
  const [filterbranches, setbranchesfilter] = useState([])
  const [DisplayData, setDisplayData] = useState([]);
  const [academicyearError, setAcademicyearError] = useState("");
  const [semesterError, setSemesterError] = useState("");
  const [factypeError, setFactypeError] = useState('');
  const [filterbranchesError, setFilterbranchesError] = useState('');
  const [keys,setkeys]=useState([]);
  const branchesList = ['aiml', 'cse', 'csbs', 'civil', 'ds', 'aids', 'ece', 'eee', 'eie', 'it', 'mech'];
  const filterList = ['aiml', 'cse', 'csbs', 'civil', 'ds', 'aids', 'ece', 'eee', 'eie', 'it', 'mech'];
  const factypes = ['PROF &HOD', 'PROFESSOR', 'ASST. PROF', 'ASSOC.PROF'];
  const yearlist = ['1', '2', '3', '4']
  const seclist = ['1', '2', '3', '4']

  useEffect(()=>{
    const fetchkeys=async()=>{
      await axios
      .get(
        `/classtimetable-api/academicyearkeys`
      )
      .then((response) => {
        setkeys(response.data);
        console.log('keys : ',response.data)
      })
      .catch((error) => {
        console.log(error);
      });
    }
    fetchkeys();
  },[])
  useEffect(() => {
    if (type === "" || sem === "" || academicyear === "") {
      setclassvalue(0)
      setfacvalue(0)
    }
    else if (type === "class") {
      setclassvalue(1)
      setfacvalue(0)
    }
    else if (type === 'faculty') {
      setclassvalue(0)
      setfacvalue(1)
    }
  }, [type, sem, academicyear])
  useEffect(() => {
    if (classtt.hasOwnProperty('returnarray')) {
      sctt(classtt.returnarray)
      setad(classtt.fa)
      setnad(classtt.nfa)
    }
    else {
      sctt([])
      setad([])
      setnad([])
    }
  }, [classtt])
  useEffect(() => {
    if (availabledata.length > 0)
      setavailabledv(1)
    else
      setavailabledv(0)
    if (nonavailabledata.length > 0)
      setnonavailabledv(1)
    else
      setnonavailabledv(0)
  }, [availabledata, nonavailabledata])
  useEffect(() => {
    handleDownloadclass();
  }, [years, branches, secs, academicyear, graduation, sem])
  const handleToggleAllSections = (isChecked) => {
    setsecs(isChecked ? [...seclist] : []);
  };
  const handlechangesec = (event) => {
    const optionId = event.target.id;
    const isChecked = event.target.checked;

    if (optionId === 'selectAll') {
      handleToggleAllSections(isChecked);
    } else {
      setsecs((prevsecs) => {
        if (isChecked && !prevsecs.includes(optionId)) {
          return [...prevsecs, optionId];
        } else if (!isChecked) {
          return prevsecs.filter((option) => option !== optionId);
        }
        return prevsecs;
      });
    }
  }
  const handleToggleAllyears = (isChecked) => {
    setSelectedYears(isChecked ? [...yearlist] : []);
  };
  const handleyearchange = (event) => {
    const optionId = event.target.id;
    const isChecked = event.target.checked;

    if (optionId === 'selectAll') {
      handleToggleAllyears(isChecked);
    } else {
      setSelectedYears((prevYears) => {
        if (isChecked && !prevYears.includes(optionId)) {
          return [...prevYears, optionId];
        } else if (!isChecked) {
          return prevYears.filter((option) => option !== optionId);
        }
        return prevYears;
      });
    }
  }
  const handlechangegraduation = (e) => {
    setgraduation(e.target.value)
  };
  const handlechangesem = (e) => {
    setsem(e.target.value)
    setSemesterError("");

  }
  const handlechangetype = (e) => {
    settype(e.target.value)
    setbranches("")
  }
  const handlechangeacademicyear = (e) => {
    setacademicyear(e.target.value)
    setAcademicyearError("");
  }
  const handleDownloadclass = async () => {
    let classkeys = []
    years.forEach(year => {
      branches.forEach(branch => {
        secs.forEach(sec => {
          classkeys.push(year + branch + sec)
        })
      })
    });
    const key = `${academicyear}.${graduation}.${sem}`
    await axios.get(`/classfaculty-api/classtt-data/${classkeys}/${key}`)
      .then((response) => {
        setclasstt(response.data)
      })
      .catch((error) => {
        setclasstt(null)
      });
  };
  const fun = async () => {
    // Create a workbook
    const wb = XLSX.utils.book_new();

    for (const key in classtimetables) {
      const sheetName = Object.keys(classtimetables[key])[0];
      const sheetData = classtimetables[key][sheetName];

      // Add a sheet to the workbook
      const headers = [[`CLASS : ${sheetName}`], [`SEMESTER : ${sem}`], [`COURSE : ${graduation}`], [`ACADEMIC YEAR : ${academicyear}`], , []]; // Add your extra headers here
      sheetData.unshift(...headers);
      sheetData.shift([]);
      const ws = XLSX.utils.aoa_to_sheet(sheetData);
      XLSX.utils.book_append_sheet(wb, ws, sheetName);
    }

    // Create an ArrayBuffer for the entire workbook
    const excelArrayBuffer = await XLSX.write(wb, {
      bookType: 'xlsx',
      type: 'array',
      mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    // Create a Blob from the ArrayBuffer
    const excelBlob = new Blob([excelArrayBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    // Create a link element for downloading
    const a = document.createElement("a");
    a.href = URL.createObjectURL(excelBlob);
    a.download = "combined_timetables.xlsx";

    // Trigger the download
    a.click();

    // Release the URL object
    URL.revokeObjectURL(a.href);
  };
  /////////////////////////////////////////////////////
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/facultytimetable-api/faculty-data-total`);
        setSearchResults(response.data);
      } catch (error) {
      }
    };

    fetchData();
  }, []);
  useEffect(() => {
    sortFacultyData();
  }, [selectedRows]);
  useEffect(() => {
    setAcademicyearError("");
    setSemesterError("");
    let isValid = true;

    if (!academicyear) {
      setAcademicyearError("Please select Academic year");
      isValid = false;
    }
    if (!sem) {
      setSemesterError("Please select Semester");
      isValid = false;
    }

  }, [type])
  useEffect(() => {
    handleTypeFilter();
  }, [filterbranches])
  const facultyTypeOrder = {
    'PROF &HOD': 1,
    'PROFESSOR': 2,
    'ASST. PROF': 3,
    'ASSOC.PROF': 4,
  };
  const sortFacultyData = () => {
    const sortedData = [...selectedRows].sort((a, b) => {
      const facultyTypeComparison = facultyTypeOrder[a.facultytype] - facultyTypeOrder[b.facultytype];
      if (facultyTypeComparison !== 0) {
        return facultyTypeComparison;
      }
      return a.username.localeCompare(b.username);
    });
    setSortedFacultyData(sortedData);
  };
  const isSelected = (username) => {
    return selectedRows.some((selectedRow) => selectedRow.username === username);
  };
  const handleCheckboxChange = (username, row) => {
    if (isSelected(username)) {
      setSelectedRows(selectedRows.filter((selectedRow) => selectedRow.username !== username));
    } else {
      setSelectedRows([...selectedRows, row]);
    }
  };
  const handleSelectAll = () => {
    if (selectedRows.length === facultyData.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows([...facultyData]);
    }
  };
  const handleSelectedFaculty = async () => {
    const wb = XLSX.utils.book_new();
    const sheetData = [];
    const times = ["9-10", "10-11", "11-12", "12-1", "12_40-1_40", "1_40-2_40", "2_40-3_40", "3_40-4_40"];
    const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    for (const key in sortedfacultyData) {
      let a = [];
      a.push('*');
      for (const t in times)
        a.push(times[t]);
      const sheetfacultyData = [];
      sheetfacultyData.push(a);
      if (sortedfacultyData[key][academicyear]) {
        if (sortedfacultyData[key][academicyear][sem]) {
          for (const day of days) {
            const row = [];
            row.push(day)
            for (const time of times) {
              if (sortedfacultyData[key][academicyear][sem][day] && sortedfacultyData[key][academicyear][sem][day][time]) {
                row.push(sortedfacultyData[key][academicyear][sem][day][time].subject + '(' + sortedfacultyData[key][academicyear][sem][day][time].class + ')');
              } else {
                row.push('-');
              }
            }
            sheetfacultyData.push(row);
          }
        }
      }
      // Add data
      let headers = [[`USERNAME : ${sortedfacultyData[key].username}`], [`NAME : ${sortedfacultyData[key].name}`], []];
      sheetfacultyData.unshift(...headers);
      sheetData.push(...sheetfacultyData);
      let emptyarray = [[], []]
      sheetData.push(...emptyarray)
    }
    const ws = XLSX.utils.aoa_to_sheet(sheetData);
    XLSX.utils.book_append_sheet(wb, ws, "timetables");
    // Create an ArrayBuffer for the entire workbook
    const excelArrayBuffer = await XLSX.write(wb, {
      bookType: 'xlsx',
      type: 'array',
      mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    // Create a Blob from the ArrayBuffer
    const excelBlob = new Blob([excelArrayBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(excelBlob);
    a.download = `${factype}_timetables.xlsx`;
    a.click();
    URL.revokeObjectURL(a.href);
  }
  const handleTypeSubmit = async (e) => {
    e.preventDefault();
    if (!type) {
      setMessage("Please select a faculty type.");
      setFacultyData([]);
      setDisplayData([]);
    } else {
      try {
        const response = await axios.get(
          `/facultytimetable-api/faculty-typearraydata/${factypearray}`
        );
        console.log("hi : ", response.data);
        if (response.data.length > 0) {
          setFacultyData(response.data);
          setDisplayData(response.data)
          setMessage("");
          setfilter(1);
        } else {
          setFacultyData([]);
          setDisplayData([]);
          setMessage("No data found for the selected faculty type.");
        }
      } catch (error) {
        setFacultyData([]);
        setDisplayData([]);
        setMessage("Error occurred while fetching data.");
      }
    }
  };
  const filteredResults = searchResults.filter(
    (item) =>
      item.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.facultytype.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const handlechangefactype = (e) => {
    const optionId = e.target.id;
    const isChecked = e.target.checked;
    if (optionId === 'selectAll') {
      handleToggleAlltypes(isChecked);
      setFactypeError('');
    } else {
      settypes((prevtypes) => {
        setFactypeError(isChecked ? '' : 'Please select at least one faculty type.');
        if (isChecked && !prevtypes.includes(optionId)) {
          return [...prevtypes, optionId];
        } else if (!isChecked) {
          return prevtypes.filter((option) => option !== optionId);
        }
        return prevtypes;
      });
    }
  };
  ////////////////////////////
  const handleToggleAllbranches = (isChecked) => {
    setbranches(isChecked ? [...branchesList] : []);
  };
  const handlechangebranch = (e) => {
    const optionId = e.target.id;
    const isChecked = e.target.checked;
    if (optionId === 'selectAll') {
      handleToggleAllbranches(isChecked);
    } else {
      setbranches((prevBranches) => {
        if (isChecked && !prevBranches.includes(optionId)) {
          return [...prevBranches, optionId];
        } else if (!isChecked) {
          return prevBranches.filter((option) => option !== optionId);
        }
        return prevBranches;
      });
    }
  };
  const handleToggleAllfilters = (isChecked) => {
    setbranchesfilter(isChecked ? [...filterList] : []);
  };
  const handlechangefilter = (e) => {
    const optionId = e.target.id;
    const isChecked = e.target.checked;
    if (optionId === 'selectAll') {
      handleToggleAllfilters(isChecked);
    } else {
      setbranchesfilter((prevBranches) => {
        if (isChecked && !prevBranches.includes(optionId)) {
          return [...prevBranches, optionId];
        } else if (!isChecked) {
          return prevBranches.filter((option) => option !== optionId);
        }
        return prevBranches;
      });
    }
  };
  //////////////////////////////////////////////////
  const handleTypeFilter = async () => {
    const filteredData = facultyData.filter((faculty) =>
      filterbranches.some((keyword) =>
        faculty.username.toLowerCase().includes(keyword.toLowerCase())
      )
    );
    setDisplayData(filteredData);
  };
  const handleToggleAlltypes = (isChecked) => {
    settypes(isChecked ? [...factypes] : []);
  };
  const diagonalSlideAnimation = useSpring({
    to: { transform: "translateX(10px) translateY(10px)" },
    from: { transform: "translateX(-5px) translateY(-5px)" },
    config: { duration: 400 },
  });

  return (
    <animated.div style={diagonalSlideAnimation} className="container p-3 m-1">
      <div className="container">
        <h1 className="p-2 text-center text-white">HISTORY</h1>
        <hr />
        <div className="container row p-3">
          <div className="col-lg-4 col-sm-12 col-md-4 p-3">
            <Form.Select
              value={academicyear}
              onChange={handlechangeacademicyear} isInvalid={!!academicyearError}
            >
              <option>Academic year</option>
              {keys.map((key, index) => (
              <option key={index} value={key}>
                {key}
              </option>
            ))}
              <Form.Control.Feedback type="invalid">{academicyearError}</Form.Control.Feedback>
            </Form.Select>
          </div>
          <div className="col-lg-4 col-sm-12 col-md-4 p-3">
            <Form.Select value={sem} onChange={handlechangesem} isInvalid={!!semesterError}>
              <option>select sem</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <Form.Control.Feedback type="invalid">{semesterError}</Form.Control.Feedback>
            </Form.Select>
          </div>
          <div className="col-lg-4 col-sm-12 col-md-4 p-3">
            <Form.Select value={type} onChange={handlechangetype}>
              <option>select type</option>
              <option value="class">class time table</option>
              <option value="faculty">faculty time table</option>
            </Form.Select>
          </div>
        </div>
        {classvalue === 1 && (
          <div>
            <div className="container row p-3">
              <h1 className="text-center text-white m-3">CLASS TIME TABLES</h1>
              <div className="col-lg-3 col-sm-12 col-md-4 p-3 ">
                <Form.Select
                  value={graduation}
                  onChange={handlechangegraduation}
                  className="text-center"
                >
                  <option>select course</option>
                  <option value="Btech">BTech</option>
                  <option value="Mtech">MTech</option>
                </Form.Select>
              </div>
              <div className="col-lg-3 col-md-4 col-sm-12  p-3">
                <Dropdown>
                  <Dropdown.Toggle
                    className="border border-secondary border-opacity-25 bg-white w-100"
                    variant=""
                    id="dropdown-basic"
                  >
                    YEAR
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Form>
                      <div className="p-3">
                        <Form.Check
                          id="selectAll"
                          label="Select All"
                          onChange={(e) => handleyearchange(e)}
                          checked={years.length === yearlist.length}
                        />
                        {yearlist.map((year) => (
                          <Form.Check
                            key={year}
                            id={year}
                            label={year.toUpperCase()}
                            onChange={(e) => handleyearchange(e)}
                            checked={years.includes(year)}
                          />
                        ))}
                      </div>
                    </Form>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
              <div className="col-lg-3 col-sm-12 col-md-4 p-3">
                <Dropdown>
                  <Dropdown.Toggle
                    className="border border-secondary border-opacity-25 bg-white w-100"
                    variant=""
                    id="dropdown-basic"
                  >
                    BRANCH
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Form>
                      <div className="p-3">
                        <Form.Check
                          id="selectAll"
                          label="Select All"
                          onChange={(e) => handlechangebranch(e)}
                          checked={branches.length === branchesList.length}
                        />
                        {branchesList.map((branch) => (
                          <Form.Check
                            key={branch}
                            id={branch}
                            label={branch.toUpperCase()}
                            onChange={(e) => handlechangebranch(e)}
                            checked={branches.includes(branch)}
                          />
                        ))}
                      </div>
                    </Form>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
              <div className="col-lg-3 col-sm-12 col-md-4 p-3">
                <Dropdown>
                  <Dropdown.Toggle
                    className="border border-secondary border-opacity-25 bg-white w-100"
                    variant=""
                    id="dropdown-basic"
                  >
                    SECTIONS
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Form>
                      <div className="p-3">
                        <Form.Check
                          id="selectAll"
                          label="Select All"
                          onChange={(e) => handlechangesec(e)}
                          checked={secs.length === seclist.length}
                        />
                        {seclist.map((sec) => (
                          <Form.Check
                            key={sec}
                            id={sec}
                            label={sec.toUpperCase()}
                            onChange={(e) => handlechangesec(e)}
                            checked={secs.includes(sec)}
                          />
                        ))}
                      </div>
                    </Form>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
              <div
                className="col-lg-2 col-sm-12 col-md-4 p-3"
                style={{ position: "relative" }}
              >
                <Button
                  onClick={fun}
                  className="fw-bold text-white w-100 btn btn-success"
                >
                  Download
                </Button>
              </div>
            </div>
            {(availabledata.length > 0 || nonavailabledata.length > 0) && (
              <div className="row m-2">
                <div className="col-sm-12 col-md-12 col-lg-6">
                  <h1 className="text-white text-center p-2">
                    DOWNLOADED DATA
                  </h1>
                  <div
                    className="container m-3 history-results"
                    style={{ "overflow-x": "auto" }}
                  >
                    {dv === 1 && (
                      <div>
                        <table>
                          <thead>
                            <tr>
                              <th style={{ width: "40%", padding: "8px" }}>
                                Academic Year
                              </th>
                              <th style={{ width: "20%", padding: "8px" }}>
                                Course
                              </th>
                              <th style={{ width: "20%", padding: "8px" }}>
                                Semester
                              </th>
                              <th style={{ width: "20%", padding: "8px" }}>
                                Class
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {availabledata.map((cell, cellindex) => (
                              <tr key={cellindex}>
                                <td>{cell[0]}</td>
                                <td>{cell[1]}</td>
                                <td>{cell[2]}</td>
                                <td>{cell[3]}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) 
                    // : (
                    //   <div className="border p-4 border-4 border-white text-white text-center container" style={{width : "50%" , overflowY: "auto", fontSize: "2rem"}}>
                    //     No data found
                    //   </div>
                    // )
                    }
                  </div>
                </div>
                <div className="col-sm-12 col-lg-6 col-md-12">
                  <h1 className="text-white text-center p-2">
                    UNAVAILABLE DATA
                  </h1>
                  <div
                    className="container m-3 history-results"
                    style={{ "overflow-x": "auto" }}
                  >
                    {ndv === 1 && (
                      <div style={{ "overflow-y": "auto" }}>
                        <table style={{ width: "100%" }}>
                          <thead>
                            <tr>
                              <th style={{ width: "40%", padding: "8px" }}>
                                Academic Year
                              </th>
                              <th style={{ width: "20%", padding: "8px" }}>
                                Course
                              </th>
                              <th style={{ width: "20%", padding: "8px" }}>
                                Semester
                              </th>
                              <th style={{ width: "20%", padding: "8px" }}>
                                Class
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {nonavailabledata.map((cell, cellindex) => (
                              <tr key={cellindex}>
                                <td>{cell[0]}</td>
                                <td>{cell[1]}</td>
                                <td>{cell[2]}</td>
                                <td>{cell[3]}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>)
                    // ) : (
                    //   <div className='border p-4 border-4 border-white text-white text-center container' style={{width : "50%" , overflowY: "auto", fontSize: "2rem"}}>
                    //     No data found
                    //   </div>
                    // )
                  }
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        {facvalue === 1 && (
          <div className="row p-3">
            <h1 className="text-white p-2 text-center ">FACULTY TIME TABLES</h1>
            <div className="row">
              <div className="col-lg-4 col-sm-12 col-md-6 p-3">
                <Dropdown>
                  <Dropdown.Toggle
                    className="border border-secondary border-opacity-25 bg-white w-100"
                    variant=""
                    id="dropdown-basic"
                  >
                    FACULTY TYPE
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Form>
                      <div className="p-3">
                        <Form.Check
                          id="selectAll"
                          label="Select All"
                          onChange={handlechangefactype}
                          checked={factypearray.length === factypes.length}
                          isInvalid={factypeError !== ''}
                        />
                        {factypes.map((type) => (
                          <Form.Check
                            key={type}
                            id={type}
                            label={type}
                            onChange={handlechangefactype}
                            checked={factypearray.includes(type)}
                          />
                        ))}
                        <Form.Control.Feedback type="invalid">{factypeError}</Form.Control.Feedback>
                      </div>
                    </Form>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
              <div className="col-lg-2 col-sm-12 col-md-6 p-3">
                <Button
                  onClick={handleTypeSubmit}
                  className="fw-bold btn text-white btn-success w-100"
                >
                  FETCH
                </Button>
              </div>
              {filtervlaue === 1 && (
                <div className="col-lg-2 col-sm-6 col-md-12 p-3">
                  <Dropdown>
                    <Dropdown.Toggle
                      className="border border-secondary border-opacity-25 bg-white w-100"
                      variant=""
                    >
                      FILTER
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Form>
                        <div className="p-3">
                          <Form.Check
                            id="selectAll"
                            label="Select All"
                            onChange={handlechangefilter}
                            checked={filterbranches.length === filterList.length}
                            isInvalid={filterbranchesError !== ''}
                          />
                          {filterList.map((filter) => (
                            <Form.Check
                              key={filter}
                              id={filter}
                              label={filter.toUpperCase()}
                              onChange={handlechangefilter}
                              checked={filterbranches.includes(filter)}
                            />
                          ))}
                          <Form.Control.Feedback type="invalid">{filterbranchesError}</Form.Control.Feedback>
                        </div>
                      </Form>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              )}
            </div>
            <div className="row m-2">
              {message && <h3>{message}</h3>}
              {DisplayData.length > 0 ? (
                <div>
                  <div className="col-lg-12 col-sm-12 col-md-12">
                    <div
                      className="container m-3 history-results"
                      style={{ overflowX: "auto" }}
                    >
                      <div>
                        <table className="mx-auto w-75">
                          <thead>
                            <tr>
                              <th>Faculty-Id</th>
                              <th>Faculty-Name</th>
                              <th>
                                <input
                                  type="checkbox"
                                  onChange={handleSelectAll}
                                  checked={
                                    selectedRows.length === facultyData.length
                                  }
                                />
                                Select All
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {DisplayData.length > 0 &&
                              DisplayData.map((row) => (
                                <tr key={row.username}>
                                  <td>{row.username}</td>
                                  <td>{row.name}</td>
                                  <td>
                                    <input
                                      type="checkbox"
                                      onChange={() =>
                                        handleCheckboxChange(row.username, row)
                                      }
                                      checked={isSelected(row.username)}
                                    />
                                  </td>
                                </tr>
                              ))}
                            {DisplayData.length === 0 && <h1>NO DATA FOUND</h1>}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                  <div className="" style={{ position: "relative" }}>
                    <Button
                      onClick={handleSelectedFaculty}
                      className="p-3 btn-secondary"
                    >
                      Download
                    </Button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        )}
      </div>
      <div></div>
    </animated.div>
  );
}

export default History

