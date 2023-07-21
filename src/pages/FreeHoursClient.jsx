import React, { useState } from 'react';
import axios from 'axios';
import { Button } from 'react-bootstrap';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import DropdownWithCheckboxes from './DropdownwithCheckboxes';

function FreeHoursclient() {
  const [searchTime1, setSearchTime1] = useState('');
  const [searchTime2, setSearchTime2] = useState('');
  const [freeFaculty, setFreeFaculty] = useState('');
  const [truevalue, setTrueValue] = useState('');
  const [facultyvalue, setFacultyValue] = useState('');
  const [freeFacultyInfo, setFreeFacultyInfo] = useState('');
  const [date, setSelectedOption] = useState('');
  const options = ['Option 1', 'Option 2', 'Option 3', 'Option 4'];


  // Step 4: Event handler function for checkbox changes
  // Step 4: Event handler function for checkbox changes
  const handleSelect = (selectedOptions) => {
    // Do something with the selected options
    console.log('Selected options:', selectedOptions);
  };

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  }

  const getdata = async () => {
    let array = [];
    for (let i = 0; i < freeFaculty.length; i++) {
      try {
        const response = await axios.get(`/facultylist-api/faculty-data/${freeFaculty[i]}`)
        array.push(response.data)
      } catch (error) {
        console.log(error);
      }
    }
    setFreeFacultyInfo(array);
    if (array)
      setFacultyValue('1')
    else
      setFacultyValue('0')
    console.log("free faculty : ", array);
    handleSearch();
  }

  const handleSearchTime = async () => {
    setSearchTime1(searchTime1);
    setSearchTime2(searchTime2)
    getdata();
  }

  const handleSearch = async () => {
    const start = searchTime1;
    const end = searchTime2;
    const [startHour, startMinute = "00"] = start.split(".");
    const [endHour, endMinute = "00"] = end.split(".");
    if (parseInt(startHour, 10) > parseInt(endHour, 10)) {
      setTrueValue('0')
      setFreeFaculty('');
      setFacultyValue('0')
    }
    else
      setTrueValue('1')
    const sh1 = startHour;
    const sm1 = '00';
    let sh2 = startHour - 1;
    const sm2 = '40';
    let eh1 = endHour;
    let eh2 = endHour;
    const em1 = '00';
    const em2 = '40';
    const startTotal1 = parseInt(sh1, 10);
    let endTotal1 = parseInt(eh1, 10);
    if (endMinute != '00')
      endTotal1 += 1;
    const numParts1 = Math.floor((endTotal1 - startTotal1));
    const parts = [];
    let currentHour = startTotal1;
    for (let i = 0; i < numParts1; i++) {
      const partStartHour = Math.floor(currentHour);
      const partEndHour = Math.floor(currentHour + 1);
      let formattedPartStartHour = `${partStartHour}`;
      let formattedPartEndHour = `${partEndHour}`;
      if (formattedPartEndHour > 12)
        formattedPartEndHour = formattedPartEndHour - 12;
      if (formattedPartStartHour > 12)
        formattedPartStartHour = formattedPartStartHour - 12;
      const partString = `${formattedPartStartHour}-${formattedPartEndHour}`;
      parts.push(partString);
      currentHour += 1;
    }
    let startTotal2 = parseInt(sh2, 10);
    if (startMinute > '40')
      startTotal2 += 1
    let endTotal2 = parseInt(eh2, 10);
    if (endMinute > '40')
      endTotal2 += 1
    const numParts2 = Math.floor((endTotal2 - startTotal2));
    currentHour = startTotal2;
    for (let i = 0; i < numParts2; i++) {
      let partStartHour = Math.floor(currentHour);
      const partStartMinute = '40';
      let partEndHour = Math.floor(currentHour + 1);
      const partEndMinute = '40';
      if (partStartHour > 12)
        partStartHour = partStartHour % 12;
      if (partEndHour > 12)
        partEndHour = partEndHour % 12;
      let formattedPartStartHour = `${partStartHour}.${partStartMinute}`;
      let formattedPartEndHour = `${partEndHour}.${partEndMinute}`;
      const partString = `${formattedPartStartHour}-${formattedPartEndHour}`;
      parts.push(partString);
      currentHour += 1;
    }
    try {
      const response = await axios.get(`/freehours-api/freehours-get/${date}/${parts}`)
      setFreeFaculty(response.data)
    }
    catch (error) {
      console.log(error);
    }
  }
  return (
    <div className='container mt-5'>
      <div className='row '>
        <div className='form-floating col-lg-3 col-md-8 p-4 mx-auto'>
          <Form.Select value={date} onChange={handleOptionChange}>
            <option className='m-4'>-- Select day--</option>
            <option value="mon">monday</option>
            <option value="tue">tuesday</option>
            <option value="wed">wednesday</option>
            <option value="thu">thursday</option>
            <option value="fri">friday</option>
            <option value="sat">saturday</option>
          </Form.Select>
        </div>
        <div className='form-floating  col-lg-3 col-md-8 p-4 mx-auto'>
          <FloatingLabel
            controlId="floatingInput"
            label="Enter the starting time"
            className="mb-3"
            value={searchTime1}
            onChange={(e) => setSearchTime1(e.target.value)}>
            <Form.Control type="text" placeholder="Enter the starting time" />
          </FloatingLabel>
        </div>
        <div className='col-lg-3 col-lg-3 col-md-8 p-4 mx-auto'>
          <FloatingLabel
            controlId="floatingInput"
            label="Enter the ending time"
            className="mb-3"
            value={searchTime2}
            onChange={(e) => setSearchTime2(e.target.value)}>
            <Form.Control type="text" placeholder="Enter the ending time" />
          </FloatingLabel>
        </div>
        <div className='col-lg-3 col-lg-3 col-md-8 p-4 mx-auto'>
        <DropdownWithCheckboxes options={options} onSelect={handleSelect} />
        </div>
        <div className='col-lg-3 col-md-8 col-sm-6 p-4'>
          <Button onClick={handleSearchTime} className='bg-success border-success'>Search</Button>
        </div>
        {truevalue === '0' && facultyvalue === '0' && (
          <div>
            <h1>Enter correct timings</h1>
          </div>
        )}
        {truevalue === '1' && facultyvalue === '1' && (
          <table>
            <thead>
              <tr>
                <th>faculty-id</th>
                <th>faculty-name</th>
                <th>faculty-type</th>
              </tr>
            </thead>
            <tbody>
              {freeFacultyInfo.map((row) =>
                <tr key={row.username}>
                  <td>{row.username}</td>
                  <td>{row.name}</td>
                  <td>{row.facultytype}</td>
                </tr>
              )}
            </tbody>
          </table>)}
      </div>

    </div >
  )

}

export default FreeHoursclient