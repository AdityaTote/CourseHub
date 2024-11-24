import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import {
  Home,
  Courses,
  CourseDetail,
  Login,
  Register,
  Payment,
  AdminLogin,
  AdminDashboard,
  AddCourse,
  AdminRegistration,
  AdminManageCourses,
} from "./pages/index.pages";
import { RecoilRoot } from "recoil";

function App() {
  return (
    <RecoilRoot>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:id" element={<CourseDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/payment/:id" element={<Payment />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/register" element={<AdminRegistration />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/add-course" element={<AddCourse />} />
        <Route path="/admin/manage-courses" element={<AdminManageCourses />} />
        {/* <Route path="/my-courses" element={<PurchasedCourses />} /> */}
      </Routes>
    </Router>
    </RecoilRoot>
  );
}

export default App;
