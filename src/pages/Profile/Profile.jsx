import { useState, useEffect } from 'react'
import './Profile.css'
import Modal from 'react-bootstrap/Modal';
function Profile() {
    let [userData, setuserData] = useState([])
    useEffect(() => {
        fetch("http://localhost:4200/faculty")
            .then(result => result.json())
            .then(data => setuserData(data))
            .catch(error => console.log("Error is", error))
    }, [])
    const [smShow, setSmShow] = useState(false);
    return (
        <div className='m-2 border border-dark p-3 rounded'>
            {
                userData.map(userObj => <div key={userObj.id}>
                    <div className='row'>
                        <div className='b mb-2 col-lg-6 col-sm-6'>
                            <img
                                className="h-100 w-100 border rounded"
                                src={userObj.profile}
                                alt=""
                            />
                        </div>
                        <div className='col-lg-4 col-sm-6 m-5'>
                            <p className='display-4'>Name :{userObj.name}</p>
                            <p className='display-4'>Type :{userObj.faculty_type}</p>
                        </div>
                    </div>
                    {/* Table */}
                    <h1 className='mt-5 text-center'>Your Time Table</h1>
                    <table className='table mt-5'>
                        <thead>
                            <tr>
                                <th>Day</th>
                                <th>9-10</th>
                                <th>10-11</th>
                                <th>11-12</th>
                                <th>1-2</th>
                                <th>2-3</th>
                                <th>3-4</th>
                            </tr>
                        </thead>
                        {userObj.classes.map(time => <tbody>
                            <td>{time.day}</td>
                            {

                                time.timetable.map(Subject => <td key={userObj.id}>

                                    {/* {Subject.room}<br />
                            {Subject.subject}<br />
                            {Subject.class} */}
                                    <div className='bg-white bg-opacity-10'>
                                        <h4 onClick={() => setSmShow(true)} className="me-2">
                                            {Subject.class_type}<br />
                                        </h4>
                                        <Modal
                                            className="modal"
                                            show={smShow}
                                            onHide={() => setSmShow(false)}
                                        >
                                            <Modal.Header closeButton>
                                                Venue:
                                            </Modal.Header>
                                            <Modal.Body>
                                                Room No:{Subject.room} <br />
                                                Subject:{Subject.subject}<br />
                                                Class  :{Subject.class}<br />
                                            </Modal.Body>
                                        </Modal>
                                    </div>
                                </td>)
                            }
                        </tbody>)}
                    </table>
                </div>)}
        </div>
    )
}
export default Profile