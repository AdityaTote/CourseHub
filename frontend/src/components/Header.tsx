import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NavLink } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";
import useUserAuth from "@/hooks/useUserAuth";
import useAdminAuth from "@/hooks/useAdminAuth";
import { useWallet } from "@solana/wallet-adapter-react";

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
        <NavLink to="/user/login">Learner Login</NavLink>
      </DropdownMenuCheckboxItem>
      <DropdownMenuCheckboxItem>
        <NavLink to="/admin/login">Educator Login</NavLink>
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
        <NavLink to="/user/register">Learner Register</NavLink>
      </DropdownMenuCheckboxItem>
      <DropdownMenuCheckboxItem>
        <NavLink to="/admin/register">Educator Register</NavLink>
      </DropdownMenuCheckboxItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

export default function Header() {
  const { isAuthenticated: isUserAuthenticated, logout: userLogout } =
    useUserAuth();
  const { isAuthenticated: isAdminAuthenticated, logout: adminLogout } =
    useAdminAuth();
  const wallet = useWallet();

  const navigate = useNavigate();

  const handleLogout = async () => {
    if (isUserAuthenticated) {
      await userLogout();
      if (wallet) {
        wallet.disconnect();
      }
      navigate("/");
    }
    if (isAdminAuthenticated) {
      await adminLogout();
      if (wallet) {
        wallet.disconnect();
      }
      navigate("/");
    }
  };
  return (
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
            <nav className="flex  items-center sm:ml-0 ml-4">
              {isAdminAuthenticated ? (
                <CoursesLink to={"/admin/manage-courses"} />
              ) : (
                <div className="flex items-centre">
                  <CoursesLink to={"/courses"} />
                </div>
              )}
              {isUserAuthenticated ? (
                <div>
                  <Link
                    to={`/user/courses`}
                    className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium flex items-center"
                  >
                    Your Courses
                  </Link>
                </div>
              ) : (
                <div></div>
              )}
            </nav>
            <div className="flex items-center">
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
  );
}