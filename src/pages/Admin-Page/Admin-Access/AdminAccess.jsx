import React from 'react'
import { loginContext } from "../../../contexts/loginContext";
import { useContext } from "react";
import SuperAdmin from './SuperAdmin';
import Admin from './Admin';

  function AdminAccess() {
    const [currentUser,,,,] = useContext(loginContext);
    return (
      <div>
        {(currentUser.type === 'super-admin') ? (
          <div>
            <Admin/>
            <SuperAdmin/>
          </div>
          ):
          (currentUser.type === 'admin') ? (
            <Admin/>
          ):
          (
            <div>
              <h1>User is not an Admin/Super Admin</h1>
            </div>
          )
        }
      </div>
    )
  }

  export default AdminAccess;