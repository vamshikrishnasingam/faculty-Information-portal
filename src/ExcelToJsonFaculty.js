import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import axios from 'axios';

const ExcelToJsonConverteFaculty = () => {
const [file, setFile] = useState(null);

const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };

  const convertFileToJson = () => {
    convertToJson(file);
  };

  const convertToJson =() => {
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        const formattedJson = JSON.stringify(jsonData, null, 2);
        const formattedJsonData={};
            for (let i = 1; i < jsonData.length; i++) {
              const row = jsonData[i];
              const obj = {};
              for (let j = 1; j < row.length; j++) {
                const key = jsonData[0][j]; 
                const value = row[j];
                obj[key] = value;
              }
              const mainKey = row[0]; 
              formattedJsonData[mainKey] = obj;
            }
            axios.post("http://localhost:5000/facultylist-api/facultylist-insert",formattedJsonData)
            .then((response)=>{
                console.log("insertion success : ");
            })
            .catch((err)=>{
                console.log("err in user login:",err)
            })
          //  const blob = new Blob([JSON.stringify(formattedJsonData1, null, 2)], { type: 'application/json' });
       // saveAs(blob, 'data1.json');
          }
          reader.readAsArrayBuffer(file);
        }}

        return(
            <div>
                <input type="file" onChange={handleFileChange} />
                <button onClick={convertFileToJson}>Convert File to JSON</button>
            </div>
        );
}
export default ExcelToJsonConverteFaculty;