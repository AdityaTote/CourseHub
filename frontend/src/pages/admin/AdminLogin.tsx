import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Layout } from "../../components/Layout";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert";
import axios from "axios";
import useAdminAuth from "@/hooks/useAdminAuth";

export function AdminLogin() {
  const { isAuthenticated } = useAdminAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [isError, setIsError] = useState<boolean>(false);

  if(isAuthenticated) {
    navigate("/admin");
}

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3030/api/v1/admin/login",
        {
          email: email,
          password: password,
        },
        { withCredentials: true }
      );

      if (response.status === 200 || response.status === 204) {
        setEmail("");
        setPassword("");
        setMessage(response.data.message || "Login successful");
        setIsError(false);
        navigate("/admin");
      } else {
        console.log(response.data.error);
        setMessage(response.data.error || "An error occurred");
        setIsError(true);
      }
    } catch (error: any) {
      console.log(error.response?.data?.error);
      setMessage(error.response?.data?.error || "An error occurred");
      setIsError(true);
    }
  };

  return (
    <Layout login="/admin/login" register="/admin/register">
      <div className="max-w-md mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
            <Link to="/admin/register" className="text-sm text-blue-600 hover:underline">
              Admin Register
            </Link>
          </div>
          <div className="mt-4 text-center">
            <Link to="/login" className="text-sm text-blue-600 hover:underline">
              User Login
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
