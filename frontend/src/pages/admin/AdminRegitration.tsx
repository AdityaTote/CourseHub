import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import axios, { AxiosError } from "axios";
import useAdminAuth from "@/hooks/useAdminAuth";
import { useWallet } from "@solana/wallet-adapter-react";
import { BACKEND_URL } from "@/utils";
import { AdminLayout } from "@/components/AdminLayout";

export function AdminRegistration() {
  const { isAuthenticated } = useAdminAuth();
  const navigate = useNavigate();

  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passRef = useRef<HTMLInputElement>(null);
  const confirmPassRef = useRef<HTMLInputElement>(null);
  const wallet = useWallet();

  const [message, setMessage] = useState<string>("");
  const [isError, setIsError] = useState<boolean>(false);

  if (isAuthenticated) {
    navigate("/admin");
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wallet.publicKey) {
      setMessage(`Wallet is not Connected!`);
    }
    const firstName = firstNameRef.current?.value;
    const lastName = lastNameRef.current?.value;
    const email = emailRef.current?.value;
    const password = passRef.current?.value;
    const confirmPassword = confirmPassRef.current?.value;

    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      setIsError(true);
      return;
    }

    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/admin/register`,
        {
          firstName: firstName,
          lastName: lastName,
          email: email,
          address: wallet.publicKey?.toString(),
          password: confirmPassword,
        }
      );

      if (response) {
        setMessage(response.data.message);
        setIsError(false);
        navigate("/admin/login");
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage = error.response?.data?.error || "An error occurred.";
        console.log(errorMessage);
        setMessage(errorMessage);
        setIsError(true);
      } else if (error instanceof Error) {
        // Generic Error handling
        console.log(error.message);
        setMessage(error.message);
        setIsError(true);
      } else {
        // Fallback for unknown error types
        console.log("Unexpected error", error);
        setMessage("An unexpected error occurred.");
        setIsError(true);
      }
    }
  };

  return (
    <AdminLayout>
     
      <div className="max-w-md mx-auto py-16 px-4 sm:py-4 sm:px-6 lg:px-8">
        <div className="bg-white p-8 shadow rounded-lg">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">
            Educator Registration
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
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                name="firstName"
                type="text"
                required
                className="mt-1"
                ref={firstNameRef}
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                name="lastName"
                type="text"
                required
                className="mt-1"
                ref={lastNameRef}
              />
            </div>
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
                autoComplete="new-password"
                required
                className="mt-1"
                ref={passRef}
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                className="mt-1"
                ref={confirmPassRef}
              />
            </div>
            <div>
              <Button
                type="submit"
                className="w-full bg-blue-600 text-white hover:bg-blue-700"
              >
                Register as Educator
              </Button>
            </div>
          </form>
          <div className="mt-4 text-center">
            <Link
              to="/admin-login"
              className="text-sm text-blue-600 hover:underline"
            >
              Already have an Educator account? Log in
            </Link>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
