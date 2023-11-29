import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import axios from "axios";
import { useSpring, animated } from 'react-spring'

function ExcelUploader() {
  const [file, setFile] = useState(null);
  const [list, setList] = useState(null);
  const [table, setTable] = useState([]);
  const [faclist, setFacList] = useState([]);
  let len;
  let sheetcount = 0;
  let tabledata = [];

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
        if (dt2[i][j] === -1)
          dtp[i][j] = dtp[i][j - 1]
      }
    }
    obj['dt1'] = dt1
    obj['dt2'] = dtp
    await axios
      .post("http://localhost:5000/classfaculty-api/classtt-insert", obj)
      .then((response) => {
        console.log("insertion into classtimtable api is success : ");
      })
      .catch((err) => {
        console.log("err in user login:", err);
      });
  }
  const dataupdate = async () => {
    await axios
      .post("http://localhost:5000/classtimetable-api/class-insert", table)
      .then((response) => {
        console.log("insertion into classtimtable api is success : ");
      })
      .catch((err) => {
        console.log("err in user login:", err);
      });
  };

  const listupdate = async () => {
    await axios
      .post("http://localhost:5000/facultylist-api/facultydata", faclist)
      .then((response) => {
        console.log("insertion into classtimtable api is success : ");
      })
      .catch((err) => {
        console.log("err in user login:", err);
      });
  };

  useEffect(() => {
    dataupdate();
  }, [table]);

  useEffect(() => {
    listupdate();
  }, [faclist]);

  const handleListUpload = (e) => {
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
  };

  const handleFileUpload = (e) => {
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
  };
  return (
    <animated.div style={fadeOutSlideUpAnimation}>
      <h1>Insert the class Data</h1>
      <div className="row ">
        <input type="file" accept=".xlsx" onChange={handleFileUpload} />
      </div>
      <h1>Inser the faculty list</h1>
      <div className="row ">
        <input type="file" accept=".xlsx" onChange={handleListUpload} />
      </div>
    </animated.div>
  );
}

export default ExcelUploader;
