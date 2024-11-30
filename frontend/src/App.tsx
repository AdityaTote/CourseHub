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
import { SOLANA_RPC_URL } from "./utils/index";
import { PurchasedCourse } from "./pages/user/PurchasedCourse";
import { AdminPayout } from "./pages/admin/AdminPayout";
import Transactions from "./pages/user/Transactions";

function App() {
  console.log(SOLANA_RPC_URL)
  return (
    <ConnectionProvider endpoint={SOLANA_RPC_URL}>
      <WalletProvider wallets={[]} autoConnect>
        <WalletModalProvider>
          <RecoilRoot>
            <Router>
              <Routes>
                <Route path="/" element={<Home />} />
                {/* admin routes */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/register" element={<AdminRegistration />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/add-course" element={<AddCourse />} />
                <Route path="/admin/manage-courses" element={<AdminManageCourses />}/>
                <Route path="/admin/manage-payout" element={<AdminPayout />}/>
                {/* common routes */}
                <Route path="/courses" element={<Courses />} />
                <Route path="/courses/:id" element={<CourseDetail />} />
                {/* user routes */}
                <Route path="/user/login" element={<Login />} />
                <Route path="/user/register" element={<Register />} />
                <Route path="/user/courses" element={<PurchasedCourse />} />
                <Route path="/payment/:id" element={<Payment />} />
                <Route path="/user/transactions" element={<Transactions />} />
              </Routes>
            </Router>
          </RecoilRoot>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;
