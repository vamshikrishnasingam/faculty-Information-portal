import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import axios from "axios";
import { useSpring, animated } from "react-spring";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { OverlayTrigger, Popover, Form, Button } from "react-bootstrap";

function ExcelUploader() {
  const [file, setFile] = useState(null);
  const [list, setList] = useState(null);
  const [table, setTable] = useState([]);
  const [faclist, setFacList] = useState([]);
  const [delval, setdelvalue] = useState(0);
  const [graduation, setgraduation] = useState("");
  const [semester, setsemester] = useState("");
  const [academicyear, setacademicyear] = useState("");
  const [academicyearError, setAcademicyearError] = useState("");
  const [graduationError, setGraduationError] = useState("");
  const [semesterError, setSemesterError] = useState("");
  const [keys, setkeys] = useState([]);
  let len;
  let sheetcount = 0;
  let tabledata = [];

  useEffect(() => {
    const fetchkeys = async () => {
      await axios
        .get(`/classtimetable-api/academicyearkeys`)
        .then((response) => {
          setkeys(response.data);
          console.log("keys : ", response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    fetchkeys();
  }, []);
  const fadeOutSlideUpAnimation = useSpring({
    to: async (next) => {
      await next({ opacity: 1, transform: "translateY(-10px)" });
    },
    from: { opacity: 0, transform: "translateY(20px)" },
    config: { duration: 700 },
  });
  const updatedata = async (dt1, dt2) => {
    const obj = {};
    const dtp = JSON.parse(JSON.stringify(dt2));
    for (let i = 0; i < dt2.length; i++) {
      for (let j = 0; j < dt2[i].length; j++) {
        if (dt2[i][j] === -1) dtp[i][j] = dtp[i][j - 1];
      }
    }
    obj["dt1"] = dt1;
    obj["dt2"] = dtp;
    await axios
      .post("http://localhost:5000/classfaculty-api/classtt-insert", obj)
      .then((response) => {
        console.log("insertion into classtimtable api is success : ");
        
      })
      .catch((err) => {
        console.log("err in user login:", err);
        
      });
  };
  const dataupdate = async () => {
    await axios
      .post("http://localhost:5000/classtimetable-api/class-insert", table)
      .then((response) => {
        console.log("insertion into classtimtable api is success : ");
        toast.success('successfully inserted', {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      })
      .catch((err) => {
        console.log("err in user login:", err);
        toast.error('failed to insert', {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      });
  };
  const listupdate = async () => {
    await axios
      .post("http://localhost:5000/facultylist-api/facultydata", faclist)
      .then((response) => {
        console.log("insertion into classtimtable api is success : ");
        toast.success('successfully inserted', {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      })
      .catch((err) => {
        console.log("err in user login:", err);
        toast.error('failed to insert', {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      });
  };
  const handleReset = async () => {
    let response = await axios
      .delete("http://localhost:5000/facultytimetable-api/reset")
      .then((response) => {
        console.log("Updated data is reset: ");
        toast.success('successfull reset', {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      })
      .catch((err) => {
        console.log("err in resetting:", err);
        toast.error('failed reset', {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      });
  };
  const handleDelete = async () => {
    setAcademicyearError("");
    setGraduationError("");
    setSemesterError("");

    let isValid = true;

    if (!academicyear) {
      setAcademicyearError("Please select Academic year");
      isValid = false;
    }
    if (!graduation) {
      setGraduationError("Please select Course");
      isValid = false;
    }
    if (!semester) {
      setSemesterError("Please select Semester");
      isValid = false;
    }

    if (isValid) {
      await axios
        .get(
          `/classfaculty-api/delete_data/${academicyear}/${graduation}/${semester}`
        )
        .then((response) => {
          toast.success('successfully deleted', {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        })
        .catch((error) => {
          toast.error('failed to delete', {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        });
    }
  };

  useEffect(() => {
    if(table.length>0)
    dataupdate();
  }, [table]);

  useEffect(() => {
    if(faclist.length>0)
    listupdate();
  }, [faclist]);

  const handleListUpload = (e) => {
   try {
    const selectedFile = e.target.files[0];
    setList(selectedFile);
    const reader = new FileReader();
    reader.onload = (event) => {
      const fileData = event.target.result;
      const workbook = XLSX.read(fileData, { type: "binary" });
      len = workbook.SheetNames.length;
      workbook.SheetNames.forEach((sheetname) => {
        const sheet = workbook.Sheets[sheetname];
        const data = XLSX.utils.sheet_to_json(sheet, {
          range: -1,
          raw: false,
          defval: -1,
        });
        const dataArray = [];
        Object.keys(data).forEach((index) => {
          const row = data[index];
          const facObj = {};
          if (index !== "0") {
            // Assuming you want to skip the first row
            Object.keys(row).forEach((col) => {
              facObj[data[0][col]] = row[col].toUpperCase();
            });
            dataArray.push(facObj);
          }
        });
        setFacList(dataArray);
      });
    };
    reader.readAsBinaryString(selectedFile);  
  } catch (error) {
    console.log(error)
    toast.error('errors in the list inserted', {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
   }
  };

  const handleFileUpload = (e) => {
   try {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    const reader = new FileReader();
    reader.onload = (event) => {
      const fileData = event.target.result;
      const workbook = XLSX.read(fileData, { type: "binary" });
      len = workbook.SheetNames.length;
      workbook.SheetNames.forEach((sheetname) => {
        sheetcount += 1;
        const sheet = workbook.Sheets[sheetname];
        const data = XLSX.utils.sheet_to_json(sheet, {
          range: -1,
          raw: false,
          defval: -1,
        });
        const dataArray = [];
        const td = data.slice(0, 3);
        const dt = td.map((rowData) => {
          return Object.values(rowData).slice(0, 1);
        });
        const td1 = data.slice(4, 11);
        const dt1 = td1.map((rowData) => {
          return Object.values(rowData).slice(0, 7);
        });
        const td2 = data.slice(12);
        const dt2 = td2.map((rowData) => {
          return Object.values(rowData).slice(0, 4);
        });
        updatedata(dt, dt1);
        dataArray.push(dt, dt1, dt2);
        tabledata.push({ sheetname, data: dataArray });
        if (len === sheetcount) setTable(tabledata);
      });
    };
    reader.readAsBinaryString(selectedFile);
  } catch (error) {
    toast.error('errors in the file uploaded', {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
   }   
  };

  const handlechangegraduation = (e) => {
    setgraduation(e.target.value);
    setGraduationError("");
  };
  const handlechangesem = (e) => {
    setsemester(e.target.value);
    setSemesterError("");
  };
  const handlechangeacademicyear = (e) => {
    setacademicyear(e.target.value);
    setAcademicyearError("");
  };

  return (
    <>
    <ToastContainer />
    <animated.div style={fadeOutSlideUpAnimation} className="row">
      <div className="col-sm-12 col-lg-6 col-md-6">
        <h1>Insert the class Data</h1>
        <div className="row ">
          <input type="file" accept=".xlsx" onChange={handleFileUpload} />
        </div>
        <h1>Inser the faculty list</h1>
        <div className="row ">
          <input type="file" accept=".xlsx" onChange={handleListUpload} />
        </div>
        <h1> Delete the list inserted</h1>
        <div className="row ">
          <div className="col-lg-4 col-sm-12 col-md-4 p-3">
            <Form.Select
              value={academicyear}
              onChange={handlechangeacademicyear}
              isInvalid={!!academicyearError}
            >
              <option>Academic year</option>
              {keys.map((key, index) => (
                <option key={index} value={key}>
                  {key}
                </option>
              ))}
              <Form.Control.Feedback type="invalid">
                {academicyearError}
              </Form.Control.Feedback>
            </Form.Select>
          </div>
          <div className="col-lg-4 col-sm-12 col-md-4 p-3">
            <Form.Select
              value={graduation}
              onChange={handlechangegraduation}
              isInvalid={!!graduationError}
            >
              <option>select course</option>
              <option value="Btech">UG</option>
              <option value="Mtech">PG</option>
              <Form.Control.Feedback type="invalid">
                {graduationError}
              </Form.Control.Feedback>
            </Form.Select>
          </div>
          <div className="col-lg-4 col-sm-12 col-md-4 p-3">
            <Form.Select
              value={semester}
              onChange={handlechangesem}
              isInvalid={!!semesterError}
            >
              <option>select sem</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <Form.Control.Feedback type="invalid">
                {semesterError}
              </Form.Control.Feedback>
            </Form.Select>
          </div>
          <div className="p-2">
            <Button
              variant="secondary"
              className="col-sm-3 col-lg-3 col-md-4"
              onClick={handleDelete}
            >
              Delete data
            </Button>
          </div>
        </div>
      </div>
      <div className="col-sm-12 col-lg-6 col-md-6">
        <h1 className="p-2">Reset the updated data</h1>
        <div className="p-2">
          <Button
            variant="secondary"
            className="col-sm-3 col-lg-3 col-md-4"
            onClick={handleReset}
          >
            Reset Data
          </Button>
        </div>
      </div>
    </animated.div></>
  );
}

export default ExcelUploader;
