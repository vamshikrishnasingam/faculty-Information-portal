import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import axios from 'axios';
import { Button } from 'react-bootstrap';


const ExcelToJsonConverterTimeTable = () => {
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);

  const handleFile1Change = (event) => {
    const selectedFile = event.target.files[0];
    setFile1(selectedFile);
  };

  const handleFile2Change = (event) => {
    const selectedFile = event.target.files[0];
    setFile2(selectedFile);
  };
  const convertFileSToJson = () => {
    convertFile1ToJson();
    convertFile2ToJson();
    convertFile3ToJson();
  }
  const convertFile1ToJson = () => {
    convertToJson1(file1);
  };

  const convertFile2ToJson = () => {
    convertToJson2(file2);
  }

  let formattedJsonData1 = {};

  const convertFile3ToJson = () => {
    axios.post("http://localhost:5000/facultytimetable-api/facultytt-insert", formattedJsonData1)
      .then((response) => {
        console.log("insertion of faculty time table is done: ");
      })
      .catch((err) => {
        console.log("err in user login:", err)
      })
  };

  const convertToJson1 = () => {
    console.log("fil1 done")
    if (file1) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        const formattedJsonData = JSON.stringify(jsonData, null, 2);
        for (let i = 1; i < jsonData.length; i++) {
          const row = jsonData[i];
          const obj = {};
          let v;
          for (let j = 1; j < row.length; j++) {
            const key = jsonData[0][j];
            const value = row[j];
            console.log(value)
            obj[key] = value;
          }
          const mainKey = row[0];
          formattedJsonData1[mainKey] = obj;
        }
        formattedJsonData1.id = jsonData[0][0];
        console.log(jsonData)

        axios.post("http://localhost:5000/classtimetable-api/classtt-insert", formattedJsonData1)
          .then((response) => {
            console.log("insertion success : ");
          })
          .catch((err) => {
            console.log("err in user login:", err)
          })
        //  const blob = new Blob([JSON.stringify(formattedJsonData1, null, 2)], { type: 'application/json' });
        // saveAs(blob, 'data1.json');
      }
      reader.readAsArrayBuffer(file1);
    }
  }
  const convertToJson2 = () => {
    console.log("file-2 done")

    if (file2) {

      const reader = new FileReader();
      reader.onload = function (e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        const formattedJsonData = JSON.stringify(jsonData, null, 2);
        const formattedJsonData2 = {}
        for (let i = 1; i < jsonData.length; i++) {
          const row = jsonData[i];
          const obj = {};
          for (let j = 1; j < row.length; j++) {
            const key = jsonData[0][j];
            const value = row[j];
            obj[key] = value;
          }
          const mainKey = row[0];
          formattedJsonData2[mainKey] = obj;
        }
        formattedJsonData2.id = formattedJsonData1.id;
        axios.post("http://localhost:5000/classfaculty-api/cf-insert", formattedJsonData2)
          .then((response) => {
            console.log("insertion success : ");
          })
          .catch((err) => {
            console.log("err in user login:", err)
          })
        //const blob = new Blob([JSON.stringify(formattedJsonData2, null, 2)], { type: 'application/json' });
        //saveAs(blob, 'data2.json');
      };
      reader.readAsArrayBuffer(file2);
    }
    else {
      console.log("no file2 found");
    }
  };
  return (
    <div className="container p-5">
      <h1 className='text-center'>Insert Excel Sheets</h1>
      <div className='row '>
      <div className="col-lg-4 col-sm-10 p-4 mx-auto">
        <div className="form-floating">
          <input type="file" className="form-control" id="floatingInput1" onChange={handleFile1Change} />
          <label htmlFor="floatingInput1">CLASSTIMETABLE</label>
        </div>
      </div>
      <div className="col-lg-4 col-sm-10 p-4 mx-auto">
        <div className="form-floating">
          <input type="file" className="form-control" id="floatingInput2" onChange={handleFile2Change} />
          <label htmlFor='floatingInput2'>CLASS FACULTY INFO</label>
        </div>
      </div>
      <div className="col-lg-2 col-sm-10 p-3 m-3 mx-auto">
        <Button onClick={convertFileSToJson}>UPLOAD DATA</Button>
      </div>

    </div>
    </div>

  );
}
export default ExcelToJsonConverterTimeTable;
