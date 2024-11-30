import { Link, useNavigate } from "react-router-dom";
import useUserAuth from "@/hooks/useUserAuth";
import useAdminAuth from "@/hooks/useAdminAuth";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NavLink } from "react-router-dom";
import { useWallet } from "@solana/wallet-adapter-react";

export function Layout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated: isUserAuthenticated, logout: userLogout } =
    useUserAuth();
  const { isAuthenticated: isAdminAuthenticated, logout: adminLogout } =
    useAdminAuth();
    const wallet = useWallet();

    const navigate = useNavigate();

  const handleLogout = async() => {
    if (isUserAuthenticated) {
      await userLogout();
      if(wallet){
        wallet.disconnect();
      }
      navigate("/");
    } else if (isAdminAuthenticated) {
      await adminLogout();
      wallet.disconnect()
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div>
              <Link to="/" className="flex-shrink-0 flex items-center">
                <span className="text-2xl font-bold text-blue-600">
                  CourseHub
                </span>
              </Link>
            </div>
            <div className={"flex"}>
              <nav className="flex space-x-8 ">
                {isAdminAuthenticated ? (
                  <CoursesLink to={"/admin/manage-courses"} />
                ) : (
                  <div className="flex items-centre">
                    <CoursesLink to={"/courses"} />
                    <Link to={`/user/courses`} className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"> Your Courses</Link>
                  </div>
                )}
              </nav>
              <div className="flex items-center space-x-4">
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
                    <LoginOption />
                    <RegisterOption />
                  </>
                )}
              </div>
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

interface CoursesLinkProps {
  to: string;
}

function CoursesLink({ to }: CoursesLinkProps) {
  return (
    <Link
      to={to}
      className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
    >
      Courses
    </Link>
  );
}

const LoginOption = () => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <span className="hover:bg-gray-100 px-3 py-2 rounded-md hover:text-blue-600  font-medium cursor-pointer ">
        Login
      </span>
    </DropdownMenuTrigger>
    <DropdownMenuContent className="w-56">
      <DropdownMenuCheckboxItem>
        <NavLink to="/user/login">User Login</NavLink>
      </DropdownMenuCheckboxItem>
      <DropdownMenuCheckboxItem>
        <NavLink to="/admin/login">Admin Login</NavLink>
      </DropdownMenuCheckboxItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

const RegisterOption = () => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <span className="bg-blue-600 text-white hover:bg-blue-700 p-2 rounded-md cursor-pointer">
        Register
      </span>
    </DropdownMenuTrigger>
    <DropdownMenuContent className="w-56">
      <DropdownMenuCheckboxItem>
        <NavLink to="/user/register">User Register</NavLink>
      </DropdownMenuCheckboxItem>
      <DropdownMenuCheckboxItem>
        <NavLink to="/admin/register">Admin Register</NavLink>
      </DropdownMenuCheckboxItem>
    </DropdownMenuContent>
  </DropdownMenu>
);
