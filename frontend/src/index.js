import React from 'react';
import * as ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';
import Home from './Screen/Admin/Home/Home';
import App from './App';
import AddStud from './Screen/Admin/Student/AddStudent/AddStudent';
import AddTeacher from './Screen/Admin/Teacher/AddTeacher/AddTeacher';
import StudPage from './Screen/Admin/Student/StudPage/StudPage';
import Classes from './Screen/Admin/Student/Classes/Classes';
import Department from './Screen/Admin/Student/Department/Department';
import StdDetails from './Screen/Admin/Student/StdDetails/StdDetails';
import TeacherList from './Screen/Admin/Teacher/TeacherList/TeacherList';
import Course from './Screen/Admin/Teacher/Course/Course';
import TDepartment from './Screen/Admin/Teacher/DepartmentT/DepartmentT';
import ClassesT from './Screen/Admin/Teacher/ClassesT/ClassesT';
import TeacherClass from './Screen/Admin/Teacher/TeacherClass/TeacherClass';
import AdminLogin from './Components/AdminLogin/AdminLogin';
import ProtectedRoute from './Components/ProtectedRoute';
import SelectCourse from './Screen/Teacher/SelectCourse/SelectCourse';
import SelectDept from './Screen/Teacher/SelectDept/SelectDept';
import THome from './Screen/Teacher/Home/THome';
import TCLass from './Screen/Teacher/TClass/TCLass';
import TakeAttendance from './Screen/Teacher/TakeAttendance/TakeAttendance';
import SelectSeries from './Screen/Teacher/SelectSeries/SelectSeries';
import EnterMark from './Screen/Teacher/EnterMark/EnterMark';
import ViewAttendance from './Screen/Teacher/ViewAttendance/ViewAttendance';
import SelectTestforMark from './Screen/Teacher/SelectTestForMark/SelectTestForMark';
import ViewMark from './Screen/Teacher/ViewMark/ViewMark';
import ViewInternalMark from './Screen/Teacher/ViewInternalMark/ViewInternalMark';
import SHome from './Screen/Student/Home/SHome';
import SAttendance from './Screen/Student/SAttendance/SAttendance';
import SelectTestStudent from './Screen/Student/SelectTestStudent/SelectTestStudent';
import StudentMark from './Screen/Student/StudentMark/StudentMark';
import ViewDayAttendance from './Screen/Student/ViewDayAttendance/ViewDayAttendance';
import StudentInternalMark from './Screen/Student/StudentInternalmark/StudentInternalmark';
import EnterLabMark from './Screen/Teacher/EnterLabMark/EnterLabMark';
import ViewLabInternalMark from './Screen/Teacher/LabViewInternalMark/LabViewInternalMark';
import EditAttendance from './Screen/Teacher/EditAttendance/EditAttendance';
import CreateQuestion from './Screen/Teacher/CreateQuestion/CreateQuestion';
import LabInternalMark from './Screen/Student/LabIntenalMark/LabInternalMark';
import ClassTutor from './Screen/Admin/ClassTutor/ClassTutor';
import CoursePlan from './Screen/Teacher/CoursePlan/CoursePlan';
import ClassTutorHome from './Screen/Teacher/ClassTutor/ClassTutorHome/ClassTutorHome';
import CTselectSub from './Screen/Teacher/ClassTutor/CTselectSub/CTselectSub';
import CTselectMarksub from './Screen/Teacher/ClassTutor/CTselectMarksub/CTselectMarksub';
import CTSubject from './Screen/Teacher/ClassTutor/CTSubject/CTSubject';
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/admin',
    element: <AdminLogin />,
  },
  {
    path: '/adminHome',
    element: (
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    ),
  },
  {
    path: '/addstudent',
    element: (
      <ProtectedRoute>
        <AddStud />
      </ProtectedRoute>
    ),
  },
  {
    path: '/addteacher',
    element: (
      <ProtectedRoute>
        <AddTeacher />
      </ProtectedRoute>
    ),
  },
  {
    path: '/studentPage',
    element: (
      <ProtectedRoute>
        <StudPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/classes',
    element: (
      <ProtectedRoute>
        <Classes />
      </ProtectedRoute>
    ),
  },
  {
    path: '/department/:course',
    element: (
      <ProtectedRoute>
        <Department />
      </ProtectedRoute>
    ),
  },
  {
    path: '/StudentDetails',
    element: (
      <ProtectedRoute>
        <StdDetails />
      </ProtectedRoute>
    ),
  },
  {
    path: '/teacherList',
    element: (
      <ProtectedRoute>
        <TeacherList />
      </ProtectedRoute>
    ),
  },
  {
    path: '/course',
    element: (
      <ProtectedRoute>
        <Course />
      </ProtectedRoute>
    ),
  },
  {
    path: '/Tdepartment/:course',
    element: (
      <ProtectedRoute>
        <TDepartment />
      </ProtectedRoute>
    ),
  },
  {
    path: '/ClassesT',
    element: (
      <ProtectedRoute>
        <ClassesT />
      </ProtectedRoute>
    ),
  },
  {
    path: '/TeacherClass',
    element: (
      <ProtectedRoute>
        <TeacherClass />
      </ProtectedRoute>
    ),
  },
  {
    path: '/classtutor',
    element: (
      <ProtectedRoute>
        <ClassTutor />
      </ProtectedRoute>
    ),
  },
  {
    path: '/teacher',
    element: <SelectCourse />,
  },
  {
    path: '/selectDept',
    element: <SelectDept />,
  },
  {
    path: '/selectClass',
    element: <THome />,
  },
  {
    path: '/TClass',
    element: <TCLass />,
  },
  {
    path: '/takeAttendance',
    element: <TakeAttendance/>,
  },
  {
    path: '/selectSeriesT',
    element: <SelectSeries/>,
  },
  {
    path: '/enterMark',
    element: <EnterMark/>,
  },
  {
    path: '/viewAttendance',
    element: <ViewAttendance/>,
  },  
  {
    path: '/selectTestforMark',
    element: <SelectTestforMark/>,
  }, 
  {
    path: '/viewMark',
    element: <ViewMark/>,
  }, 
  {
    path: '/viewInternalMark',
    element: <ViewInternalMark/>,
  }, 
  {
    path: '/student',
    element: <SHome/>,
  },
  {
    path: '/student-attendance',
    element: <SAttendance/>,
  },
  {
    path: '/selectTestStudent',
    element: <SelectTestStudent/>,
  },
  {
    path: '/studentMark',
    element: <StudentMark/>,
  },
  {
    path: '/viewDayAttendance',
    element: <ViewDayAttendance/>,
  },
  {
    path: '/studentInternalMark',
    element: <StudentInternalMark/>,
  },
  {
    path: '/enterMarkforLab',
    element: <EnterLabMark/>,
  },
  {
    path: '/viewMarkforLab',
    element: <ViewLabInternalMark/>,
  },
  {
    path: '/editAttendance',
    element: <EditAttendance/>,
  },
  {
    path: '/createQuestionPaper',
    element: <CreateQuestion/>,
  },
  {
    path: '/studentLabInternalmark',
    element: <LabInternalMark/>,
  },
  {
    path: '/coursePlan',
    element: <CoursePlan/>,
  },
  {
    path: '/classTutorHome',
    element: <ClassTutorHome/>,
  },
  {
    path: '/selectSubjectAttenCT',
    element: <CTselectSub/>,
  },
  {
    path: '/selectSubjectTestCT',
    element: <CTselectMarksub/>,
  },
  {
    path: '/subjectCT',
    element: <CTSubject/>,
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
