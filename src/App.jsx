import './App.css';
import RootLayout from './RootLayout/RootLayout';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Professor from './pages/ProfessorsList/ProfessorsData'
import Home from './pages/Main-Home/Home'
import Profile from './pages/Profile/Profile';
import AdminMainpage from './pages/Admin-Page/AdminMain-page/AdminMainPage';
import ClassTimeTable from './pages/TimeTables/ClassTimeTables/ClassTimeTable';
import FacultyTimeTable from './pages/TimeTables/FacultyTimeTables/FacultyTimeTable';
import AdminLogin from './pages/loginPage/AdminLogin/AdminLogin'
import FacultyLogin from './pages/loginPage/FacultyLogin/FacultyLogin'
import FacultyData from './pages/FacultyPage/FacultyData'
import Update from './pages/Admin-Page/Update/Update';
import AdminHome from './pages/Admin-Page/Admin-home/AdminHome';
import FreeHoursclient from './pages/Freehours/FreeFaculty';
import ReplaceFaculty from './pages/ReplaceFaculty/ReplaceFaculty';
import Search from './pages/Others/Search';
import ErrorPage from './pages/Errorpage/ErrorPage';
import UpdatePage from './pages/Admin-Page/UpdatePage/UpdatePage'
import FacultyUpdate from './pages/Admin-Page/FacultyUpdate/FacultyUpdate'
import AdminAccess from './pages/Admin-Page/Admin-Access/AdminAccess';
import ResetPassword from './pages/loginPage/ResetPassword/ResetPassword';
import History from './pages/History/History';
function App() {
  
  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/admin-login",
          element: <AdminLogin />,
        },
        {
          path: "/faculty-login",
          element: <FacultyLogin />,
        },
        {
          path: "/adminpage",
          element: <AdminMainpage />,
          children: [
            {
              path: "",
              element: <AdminHome />,
            },
          ],
        },
        {
          path: "/updatepage",
          element: <UpdatePage />,
          children: [
            {
              path: "",
              element: <AdminHome />,
            },
          ],
        },
        {
          path: "/update",
          element: <Update />,
        },
        {
          path: "/fac-update",
          element: <FacultyUpdate />,
        },
        {
          path: "/freehours",
          element: <FreeHoursclient />,
        },
        {
          path: "/search",
          element: <Search />,
        },
        {
          path: "/facultypage",
          element: <FacultyData />,
          children: [
            {
              path: "",
              element: <AdminHome />,
            },
            {
              path: "classtt",
              element: <ClassTimeTable />,
            },
            {
              path: "userprofile",
              element: <Profile />,
            },
          ],
        },
        {
          path: "/facultytt",
          element: <FacultyTimeTable />,
        },
        {
          path: "/fac-list",
          element: <Professor />,
        },
        {
          path: "/fac-replace",
          element: <ReplaceFaculty />,
        },
        {
          path: "/classtt",
          element: <ClassTimeTable />,
        },
        {
          path: "/pw-change",
          element: <ResetPassword />,
        },
        {
          path: "/admin-access",
          element: <AdminAccess />,
        },
        {
          path: "/History",
          element: <History/>,
        },
      ],
    },
  ]);
  return (
    <div className='App'>
      <RouterProvider router={router} />
    </div>
  );
}
export default App;
