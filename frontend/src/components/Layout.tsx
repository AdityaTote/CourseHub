import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import useUserAuth from "@/hooks/useUserAuth";
import useAdminAuth from "@/hooks/useAdminAuth";

export function Layout({ children, login, register }: { children: React.ReactNode, login: string, register: string }) {
  const { isAuthenticated: isUserAuthenticated, logout: userLogout } = useUserAuth();
  const { isAuthenticated: isAdminAuthenticated, logout: adminLogout } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (isUserAuthenticated) {
      userLogout();
    } else if (isAdminAuthenticated) {
      adminLogout();
    }
  };

  const handleCourse = () => {
    if (isAdminAuthenticated) {
      navigate("/admin/manage-courses");
    } else {
      navigate("/courses");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-blue-600">
                LearnHub
              </span>
            </Link>
            <nav className="hidden sm:flex sm:space-x-8">
              <button
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                onClick={handleCourse}
              >
                Courses
              </button>
            </nav>
            <div className="hidden sm:flex sm:items-center sm:space-x-4">
              {isUserAuthenticated || isAdminAuthenticated ? (
                <Button
                  variant="ghost"
                  className="text-gray-700 hover:text-blue-600"
                  onClick={handleLogout}
                >
                  Log out
                </Button>
              ) : (
                <>
                  <Link to={login}>
                    <Button
                      variant="ghost"
                      className="text-gray-700 hover:text-blue-600"
                    >
                      Log in
                    </Button>
                  </Link>
                  <Link to={register}>
                    <Button className="bg-blue-600 text-white hover:bg-blue-700">
                      Sign up
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>
      <main className="flex-grow">{children}</main>
      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} EduCrypto. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}