import React, { useEffect, useState } from 'react'
import { Button, Form, Dropdown } from "react-bootstrap";
import axios from 'axios';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

function History() {

  const [years, setSelectedYears] = useState("")
  const [factype, setfactype] = useState("");
  const [classtt, setclasstt] = useState([])
  const [availabledata, setad] = useState([])
  const [nonavailabledata, setnad] = useState([])
  const [classtimetables, sctt] = useState([])
  const [graduation, setgraduation] = useState("")
  const [academicyear, setacademicyear] = useState("")
  const [branches, setbranches] = useState("")
  const [secs, setsecs] = useState("")
  const [sem, setsem] = useState("")
  const [type, settype] = useState("")
  const [classvalue, setclassvalue] = useState(0)
  const [facvalue, setfacvalue] = useState(0)
  const [dv, setavailabledv] = useState(0)
  const [ndv, setnonavailabledv] = useState(0)
  const [facultyData, setFacultyData] = useState([]);
  const [sortedfacultyData, setSortedFacultyData] = useState([]);
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedResult, setSelectedResult] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [downloaddata, setdownloaddata] = useState([]);
  const branchesList = ['cse', 'aiml', 'it', 'csbs', 'ds', 'aids', 'ece', 'eee', 'eie', 'civil', 'mech'];
  const yearlist = ['1', '2', '3', '4']
  const seclist = ['1', '2', '3', '4']

  useEffect(() => {
    if (type === "") {
      setclassvalue(0)
      setfacvalue(0)
    }
    if (type === "class") {
      setclassvalue(1)
      setfacvalue(0)
    }
    if (type === 'faculty') {
      setclassvalue(0)
      setfacvalue(1)
    }
  }, [type])
  useEffect(() => {
    if (classtt.hasOwnProperty('returnarray')) {
      sctt(classtt.returnarray)
      setad(classtt.fa)
      setnad(classtt.nfa)
    }
  }, [classtt])
  useEffect(() => {
    console.log('data : ', availabledata)
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
    if (classtimetables.length > 0)
      fun();
  }, [classtimetables])
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
  const handleToggleAllbraches = (isChecked) => {
    setbranches(isChecked ? [...branchesList] : []);
  };
  const handlechangebranch = (e) => {
    const optionId = e.target.id;
    const isChecked = e.target.checked;
    if (optionId === 'selectAll') {
      handleToggleAllbraches(isChecked);
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
  const handlechangegraduation = (e) => {
    setgraduation(e.target.value)
  };
  const handlechangesem = (e) => {
    setsem(e.target.value)
  }
  const handlechangetype = (e) => {
    settype(e.target.value)
  }
  const handlechangeacademicyear = (e) => {
    setacademicyear(e.target.value)
  }
  const handleDownloadclass = async () => {
    console.log(years, graduation, academicyear, sem, secs, branches)
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
        console.log('api call : ', response.data)
        setclasstt(response.data)
      })
      .catch((error) => {
        setclasstt(null)
        console.log(error)
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
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  useEffect(() => {
    sortFacultyData();
  }, [selectedRows]);
  useEffect(()=>{

  })
  const facultyTypeOrder = {
    'Prof &HOD': 1,
    'Professor': 2,
    'Asst. Prof': 3,
    'Assoc.Prof': 4,
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
    let t =    ['*', ...times];
    const times = ["9-10", "10-11", "11-12", "12-1", "12.40-1.40", "1.40-2.40", "2.40-3.40", "3.40-4.40"];
    const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    for (const key in sortedfacultyData) {
      let a=[];
      a.push('*');
      for(const t in times)
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
                console.log(sortedfacultyData[key][academicyear][sem][day][time])
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
      let headers = [[`USERNAME : ${sortedfacultyData[key].username}`],[`NAME : ${sortedfacultyData[key].name}`],[]];
      sheetfacultyData.unshift(...headers);
      sheetData.push(...sheetfacultyData);
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
    } else {
      try {
        const response = await axios.get(
          `/facultytimetable-api/faculty-data/${factype}`
        );
        if (response.data.length > 0) {
          setFacultyData(response.data);
          setMessage("");
        } else {
          setFacultyData([]);
          setMessage("No data found for the selected faculty type.");
        }
      } catch (error) {
        console.error(error);
        setFacultyData([]);
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

  return (
    <div>
      <div className="row p-4 container">
        <h1 className="m-3 text-white">HISTORY </h1>
        <hr />
        <div className="row m-2">
          <div className="col-lg-2 col-sm-8 col-mg-8 mx-auto p-3">
            <Form.Select
              value={academicyear}
              onChange={handlechangeacademicyear}
            >
              <option>Academic year</option>
              <option value="2023-2024">2023-2024</option>
              <option value="2024-2025">2024-2025</option>
            </Form.Select>
          </div>
          <div className="col-lg-2 col-sm-8 col-mg-8 mx-auto p-3">
            <Form.Select value={sem} onChange={handlechangesem}>
              <option>select sem</option>
              <option value="1">1</option>
              <option value="2">2</option>
            </Form.Select>
          </div>
          <div className="col-lg-2 col-sm-8 col-mg-8 mx-auto p-3">
            <Form.Select value={type} onChange={handlechangetype}>
              <option>select type</option>
              <option value="class">class time table</option>
              <option value="faculty">faculty time table</option>
            </Form.Select>
          </div>
        </div>
        {classvalue === 1 && (
          <div>
            <div className="row">
              <h1 className="text-center">CLASS TIME TABLES</h1>
              <div className="col-lg-2 col-sm-8 col-mg-8 mx-auto p-3">
                <Form.Select value={type} onChange={handlechangegraduation}>
                  <option>select course</option>
                  <option value="Btech">Btech</option>
                  <option value="Mtech">MTech</option>
                </Form.Select>
              </div>
              <div className="col-lg-3 col-md-6 p-3">
                <Dropdown>
                  <Dropdown.Toggle
                    className="border border-secondary border-opacity-25 bg-white w-100 p-3"
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
              <div className="col-lg-3 col-md-6 p-3">
                <Dropdown>
                  <Dropdown.Toggle
                    className="border border-secondary border-opacity-25 bg-white w-100 p-3"
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
              <div className="col-lg-3 col-md-6 p-3">
                <Dropdown>
                  <Dropdown.Toggle
                    className="border border-secondary border-opacity-25 bg-white w-100 p-3"
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
              <div className="" style={{ position: "relative" }}>
                <Button
                  onClick={handleDownloadclass}
                  className="p-3 btn-secondary"
                >
                  Download
                </Button>
              </div>
            </div>
            <div style={{ display: "flex", gap: "20px" }}>
              {dv === 1 && (
                <div>
                  <table style={{ width: "100%" }}>
                    <thead>
                      <tr>
                        <th style={{ width: "40%", padding: "8px" }}>
                          Column 1
                        </th>
                        <th style={{ width: "20%", padding: "8px" }}>
                          Column 2
                        </th>
                        <th style={{ width: "20%", padding: "8px" }}>
                          Column 3
                        </th>
                        <th style={{ width: "20%", padding: "8px" }}>
                          Column 4
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
              )}

              {ndv === 1 && (
                <div>
                  <table style={{ width: "100%" }}>
                    <thead>
                      <tr>
                        <th style={{ width: "40%", padding: "8px" }}>
                          Column 1
                        </th>
                        <th style={{ width: "20%", padding: "8px" }}>
                          Column 2
                        </th>
                        <th style={{ width: "20%", padding: "8px" }}>
                          Column 3
                        </th>
                        <th style={{ width: "20%", padding: "8px" }}>
                          Column 4
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
                </div>
              )}
            </div>
          </div>
        )}
        {facvalue === 1 && (
          <div>
            <h1>FACULTY TIME TABLES</h1>
            <div className="row">
              <div className="col-lg-4 col-sm-12 col-md-6 p-3">
                <Form.Select
                  value={factype}
                  onChange={(e) => setfactype(e.target.value)}
                >
                  <option value="">Select Type</option>
                  <option value="Professor">Professors</option>
                  <option value="Asst. Prof">Assistant Professors</option>
                  <option value="Assoc.Prof">Associate Professors</option>
                </Form.Select>
              </div>
              <div className="" style={{ position: "relative" }}>
                <Button
                  onClick={handleTypeSubmit}
                  className="p-3 btn-secondary"
                >
                  FETCH
                </Button>
              </div>
            </div>
            <div className="row">
              {message && <h3>{message}</h3>}
              {facultyData.length > 0 ? (
                <div>
                  <div className="container m-3" style={{ overflowX: "auto" }}>
                    <table className="mx-auto w-75">
                      <thead>
                        <tr>
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
                          <th>Faculty-Id</th>
                          <th>Faculty-Name</th>
                        </tr>
                      </thead>
                      <tbody>
                        {facultyData.map((row) => (
                          <tr key={row.username}>
                            <td>
                              <input
                                type="checkbox"
                                onChange={() =>
                                  handleCheckboxChange(row.username, row)
                                }
                                checked={isSelected(row.username)}
                              />
                            </td>
                            <td>{row.username}</td>
                            <td>{row.name}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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
    </div>
  );
}

export default History

