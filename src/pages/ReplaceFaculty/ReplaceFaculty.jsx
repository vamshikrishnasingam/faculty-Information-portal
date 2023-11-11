import React, { useState } from 'react'
import Button from "react-bootstrap/Button";
const ReplaceFaculty = () => {
  
const [searchId, setSearchId]=useState('')

  return (
    <div className="table-container">
      <h3 className="mb-5">Please enter FacultyID for their Time Tables!!!</h3>
      <div className="row">
        <div className="col-lg-3 col-sm-7 p-2">
          <input
            className="form-control me-2"
            type="text"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            placeholder="Enter ID"
          />
        </div>
        <div className="col-lg-3 col-sm-5 p-2">
          <Button
            className="btn btn-success w-50"
            type="submit"
            onClick={1}
          >
            search
          </Button>
        </div>
      </div>
      0
    </div>
  );
}

export default ReplaceFaculty