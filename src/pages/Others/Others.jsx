import React, { useState,useEffect } from 'react';
import {Modal,Button, Tab} from "react-bootstrap";
import './Others.css';
import axios from 'axios';
let times=['9-10','10-11','11-12','12-1','12.40-1.40','1.40-2.40','2.40-3.40','3.40-4.40']
let days=['mon','tue','wed','thu','fri','sat']
let pegasus=[]
const Others = () => {
  const [searchId, setSearchId] = useState('');
  const [data, setData] = useState(null);

    const printdata=()=>{
      delete data._id;
      delete data.username;
      delete data.name;   
      console.log(data);
        for(let i=0;i<6;i++)
        {
              const b=[];
              b.push({classtype:days[i]})
              const l=data.hasOwnProperty(days[i])
              if(l){
              for(let j=0;j<8;j++)
              {
                  const a=data[days[i]].hasOwnProperty(times[j])
                  if(a){
                  b.push(data[days[i]][times[j]])
                  }
                  else{
                    const obj={name:"null",roomno:'null',subjectname:'null'}
                    b.push('')
                  }
              }}
              else{
                const obj={name:"null",roomno:'null',subjectname:'null'}
                for(let j=0;j<8;j++)
                  b.push('')
              }
              pegasus.push(b);
            }
            console.log("factt:",pegasus)

        }
  const handleSearch = async () => {
    try {
      const response = await axios.get(`/facultytimetable-api/facultytt-data/${searchId}`);
      setData(response.data);
      printdata();
    } catch (error) {
      console.log(error);
    }
  };
  const [rowactiveIndex, setrowIndex] = useState(null);
  const [colactiveIndex, setcolIndex] = useState(null);


  let [show,setShow]=useState(false);
  let showModal=()=>setShow(true);
  let closeModal=()=>setShow(false);


  const handleMouseEnter = (index) => { 
      setrowIndex(index[0]);
      setcolIndex(index[1]);
      showModal();
  }
  const handleMouseLeave=()=>{
      closeModal();
      setrowIndex(null);
      setcolIndex(null);
  }

  return (
    <div className='table-container'>
      <input
        type="text"
        value={searchId}
        onChange={(e) => setSearchId(e.target.value)}
        placeholder="Enter ID"
      />
      <button onClick={handleSearch}>Search</button>
      {data && (
        <div className='table-container'>
        <table className='m-3 mx-auto'>
      <thead>
        <tr>
          <th>Day</th>
          <th>9-10</th>
          <th>10-11</th>
          <th>11-12</th>
          <th>12-1</th>
          <th>12.40-1.40</th>
          <th>1.40-2.40</th>
          <th>2.40-3.40</th>
          <th>3.40-4.40</th>
        </tr>
      </thead>
      <tbody>
      {pegasus.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((cell, cellIndex) => (
              <td
                key={cellIndex}
                onMouseEnter={() => handleMouseEnter([rowIndex,cellIndex])}
                onMouseLeave={handleMouseLeave}
              >
                {cell && Object.keys(cell).length > 0 && (
                  <div className="cell-content">
                    {cell.classtype}
                    {rowactiveIndex === rowIndex && colactiveIndex === cellIndex &&
                      Object.keys(cell).length > 1 && cell && (
                      <Modal show={show} onHide={closeModal}
                        backdrop="true" centered className='modal'>
                      <Modal.Body>
                      <p>CLASS       :{cell.class}</p>
                      <p>ROOM-NO     :{cell.roomno}</p>
                      <p>SUBJECT-NAME:{cell.subjectname}</p>
                      </Modal.Body>
                    </Modal>
                    )}
                  </div>
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

export default Others
;
