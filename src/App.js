import React from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './Admin/Pages/AuthContext';
import PrivateRoute from './Admin/MyComponents/PrivateRoute/PrivateRoute';
import Home from './Pages/Home';
import About from './Pages/AboutUS';
import ContactUs from './Pages/ContactUs';
import Dashboard from './Admin/Pages/Dashboard';
import AdminEnrollments from './Admin/Pages/AdminEnrollments';
import AddCourse from './Admin/MyComponents/AddCources/AddCources';
import CourseList from './Admin/Pages/CourseList';

import AdminContactSubmissions from './Admin/MyComponents/Message/AdminContactSubmissions';
import UserCourseList from './Pages/UserCourseList';
import AdminLogin from './Admin/Pages/AdminLogin';
import AdminStats from './Admin/MyComponents/AdminStats/AdminStats';

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="About" element={<About />} />
        <Route path="ContactUs" element={<ContactUs />} />
        <Route path="dashboard" element={<PrivateRoute element={Dashboard} />} />
        <Route path="login" element={<AdminLogin />} />
        <Route path="Enrollments" element={<PrivateRoute element={AdminEnrollments} />} />
        <Route path="addCourse" element={<PrivateRoute element={AddCourse} />} />
        <Route path="courselist" element={<PrivateRoute element={CourseList} />} />
        <Route path="/admin/contact-submissions" element={<PrivateRoute element={AdminContactSubmissions} />} />
        <Route path="courses" element={<UserCourseList />} />
        <Route path="adminstats" element={<PrivateRoute element={AdminStats} />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;
