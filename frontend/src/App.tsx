import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import "@solana/wallet-adapter-react-ui/styles.css";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
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
    <ConnectionProvider endpoint={"https://api.devnet.solana.com"}>
      <WalletProvider wallets={[]} autoConnect>
        <WalletModalProvider>
          <RecoilRoot>
            <Router>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/courses" element={<Courses />} />
                <Route path="/courses/:id" element={<CourseDetail />} />
                <Route path="/payment/:id" element={<Payment />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/register" element={<AdminRegistration />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/add-course" element={<AddCourse />} />
                <Route
                  path="/admin/manage-courses"
                  element={<AdminManageCourses />}
                />
                <Route path="/user/login" element={<Login />} />
                <Route path="/user/register" element={<Register />} />
              </Routes>
            </Router>
          </RecoilRoot>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;
