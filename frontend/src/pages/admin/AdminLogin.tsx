import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert";
import axios from "axios";
import useAdminAuth from "@/hooks/useAdminAuth";
import { useWallet } from "@solana/wallet-adapter-react";
import { AdminLayout } from "@/components/AdminLayout";

export function AdminLogin() {
  const { isAuthenticated } = useAdminAuth();
  const navigate = useNavigate();
  const emailRef = useRef<HTMLInputElement>(null);
  const passRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<string>("");
  const [isError, setIsError] = useState<boolean>(false);
  const wallet = useWallet();

  if (isAuthenticated) {
    navigate("/admin");
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wallet.publicKey) {
      setMessage(`Wallet is not Connected!`);
      setIsError(true);
      return;
    }
    const address = wallet.publicKey?.toString();
    console.log(address)
    try {
      const response = await axios.post(
        "http://localhost:3030/api/v1/admin/login",
        {
          email: emailRef.current?.value,
          password: passRef.current?.value,
          address: address,
        },
        { withCredentials: true }
      );

      if (response.status === 200 || response.status === 204) {
        setMessage(response.data.message || "Login successful");
        setIsError(false);
        navigate("/admin");
      } else {
        console.log(response.data.error);
        setMessage(response.data.error || "An error occurred");
        setIsError(true);
      }
    } catch (error: any) {
      console.error(error.response?.data?.error);
      setMessage(error.response?.data?.error || "An error occurred");
      setIsError(true);
    }
  };

  return (
    <AdminLayout>
      
      <div className="max-w-md mx-auto py-16 px-4 sm:py-4 sm:px-6 lg:px-8">
        <div className="bg-white p-8 shadow rounded-lg">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">
            Admin Login
          </h2>
          {message && (
            <Alert
              className={`mb-6 ${
                isError
                  ? "bg-red-100 text-red-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              <AlertTitle>{isError ? "Error" : "Success"}</AlertTitle>
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-1"
                ref={emailRef}
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="mt-1"
                ref={passRef}
              />
            </div>
            <div>
              <Button
                type="submit"
                className="w-full bg-blue-600 text-white hover:bg-blue-700"
              >
                Log in as Admin
              </Button>
            </div>
          </form>
          <div className="mt-4 text-center">
            <Link
              to="/admin/register"
              className="text-sm text-blue-600 hover:underline"
            >
              Admin Register
            </Link>
          </div>
          <div className="mt-4 text-center">
            <Link to="/user/login" className="text-sm text-blue-600 hover:underline">
              User Login
            </Link>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
