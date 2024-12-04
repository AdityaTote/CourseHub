import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import useAdminAuth from "@/hooks/useAdminAuth";
import { AdminLayout } from "@/components/AdminLayout";

export function AdminDashboard() {

  const { isAuthenticated } = useAdminAuth();
  const navigate = useNavigate();

    if(!isAuthenticated){
      navigate("/admin/login")
    }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto py-16 px-4 sm:py-4 sm:px-6 lg:px-8">
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
          <Link to="/admin/manage-payout">
            <Button className="w-full h-32 text-xl">Manage Payouts</Button>
          </Link>
        </div>
      </div>
    </AdminLayout>
  );
}