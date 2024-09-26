import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Layout } from "../../components/Layout";
import { Button } from "../../components/ui/button";
import useAdminAuth from "@/hooks/useAdminAuth";

export function AdminDashboard() {

  const { isAuthenticated } = useAdminAuth();
  const navigate = useNavigate();
  
  if(!isAuthenticated){
    navigate("/admin/login")
  }

  return (
    <Layout login="/admin/login" register="/admin/register">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">
          Admin Dashboard
        </h1>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Link to="/admin/add-course">
            <Button className="w-full h-32 text-xl">Add New Course</Button>
          </Link>
          <Link to="/admin/manage-courses">
            <Button className="w-full h-32 text-xl">Manage Courses</Button>
          </Link>
          <Link to="/admin/manage-users">
            <Button className="w-full h-32 text-xl">Manage Users</Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
}