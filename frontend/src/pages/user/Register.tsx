import React, { useRef, useState } from "react";
import axios, {AxiosError} from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Layout } from "../../components/Layout";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert";
import useUserAuth from "@/hooks/useUserAuth";
import { BACKEND_URL } from "@/utils";

export function Register() {
  const { isAuthenticated } = useUserAuth();
  const navigate = useNavigate();
  const [message, setMessage] = useState<string>("");
  const [isError, setIsError] = useState<boolean>(false);
  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  if (isAuthenticated) {
    navigate("/admin");
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const firstName = firstNameRef.current?.value;
    const lastName = lastNameRef.current?.value;
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/user/register`,
        {
          firstName: firstName,
          lastName: lastName,
          email: email,
          password: password,
        }
      );

      if (response.status === 201) {
        setMessage(response.data.message);
        setIsError(false);
        navigate("/user/login");
      } else {
        setMessage(response.data.error);
        setIsError(true);
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
    <Layout>
      <div className="max-w-md mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div className="bg-white p-8 shadow rounded-lg">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">
            Create an account
          </h2>
          {message && (
            <Alert
              variant={isError ? "destructive" : "default"}
              className="mb-4"
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
                autoComplete="name"
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
                autoComplete="name"
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
                ref={passwordRef}
              />
            </div>
            <div>
              <Button
                type="submit"
                className="w-full bg-blue-600 text-white hover:bg-blue-700"
              >
                Sign up
              </Button>
            </div>
          </form>
          <div className="mt-4 text-center">
            <Link to="/user/login" className="text-sm text-blue-600 hover:underline">
              Already have an account? Log in
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
