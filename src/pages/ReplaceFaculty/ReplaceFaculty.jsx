import React, { useState } from 'react'

const ReplaceFaculty = () => {
  
const [searchId, setSearchId]=useState('')

  return (
    <div className='table-container'>
      <input
        type="text"
        value={searchId}
        onChange={(e) => setSearchId(e.target.value)}
        placeholder="Enter faculty ID"
      />
      <button>Search</button>
    </div>
  )
}

export default ReplaceFaculty