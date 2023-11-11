import './App.css';
import RootLayout from './RootLayout/RootLayout';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Professor from './pages/Professors/Professor'
import Others from './pages/Others/Others'
import Othersclass from './pages/Others/othersclass';
import Home from './pages/Home/Home'
import Profile from './pages/Profile/Profile';
import UserData from './pages/Admin-Page/AdminMain-page/UserData';
import ClassTimeTable from './pages/TimeTables/ClassTimeTables/ClassTimeTable';
import FacultyTimeTable from './pages/TimeTables/FacultyTimeTables/FacultyTimeTable';
import AdminLogin from './pages/loginPage/AdminLogin/AdminLogin'
import FacultyLogin from './pages/loginPage/FacultyLogin/FacultyLogin'
import FacultyData from './pages/FacultyPage/FacultyData'
import Update from './pages/Admin-Page/Update/Update';
import AdminHome from './pages/Admin-Page/AdminHome';
import FreeHoursclient from './pages/Freehours/FreeHoursClient';
import ReplaceFaculty from './pages/ReplaceFaculty/ReplaceFaculty';
import Search from './pages/Others/Search';
import ErrorPage from './pages/Errorpage/ErrorPage';
function App() {
  
  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: "/",
          element: <Home />
        },
        {
          path: "/admin-login",
          element: <AdminLogin />
        },
        {
          path: "/faculty-login",
          element: <FacultyLogin />
        },
        {
          path: "/adminpage",
          element: <UserData /> ,
          children: [
            {
              path: '',
              element: <AdminHome />
            },
          ]
        },
        {
          path: "/update",
          element: <Update />
        },
        {
          path: "/freehours",
          element: <FreeHoursclient />
        },
        {
          path: "/search",
          element: <Search />
        },
        {
          path: "/facultypage",
          element: <FacultyData />,
          children: [
            {
              path: '',
              element: <AdminHome />
            },
            {
              path: 'classtt',
              element: <ClassTimeTable />
            },
            {
              path: 'userprofile',
              element: <Profile />
            },
          ]
        },
        {
          path: "/facultytt",
          element: <Professor />,
          children: [
            {
              path: '',
              element: <AdminHome />
            },
            {
              path: "professors",
              element: <Professor />
            },
            {
              path: "replace",
              element: <ReplaceFaculty />
            },
            {
              path: "others",
              element: <Others />
            }
          ]
        },
        {
          path: '/classtt',
          element: <ClassTimeTable />,
          children: [
            {
              path: '',
              element: <AdminHome />
            },
            {
              path: 'othersclass',
              element: <Othersclass />
            },
          ]
        },

      ]
    }
  ])
  return (
    <div className='App'>
      <RouterProvider router={router} />
    </div>
  );
}
export default App;
