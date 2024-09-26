import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Layout } from "../../components/Layout";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert";
import useUserAuth from "@/hooks/useUserAuth";

export function Register() {
  const { isAuthenticated } = useUserAuth();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [isError, setIsError] = useState<boolean>(false);

  if (isAuthenticated) {
    navigate("/admin");
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3030/api/v1/auth/user/register",
        {
          firstName: firstName,
          lastName: lastName,
          email: email,
          password: password,
        }
      );

      if (response.status === 201) {
        setEmail("");
        setPassword("");
        setFirstName("");
        setLastName("");
        setMessage(response.data.message);
        setIsError(false);
        navigate("/login");
      } else {
        setMessage(response.data.error);
        setIsError(true);
      }
    } catch (error: any) {
      console.log(error.response?.data?.error);
      setMessage(error.response?.data?.error);
      setIsError(true);
    }
  };

  return (
    <Layout login="/login" register="/register">
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
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
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
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
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
                autoComplete="new-password"
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
                Sign up
              </Button>
            </div>
          </form>
          <div className="mt-4 text-center">
            <Link to="/login" className="text-sm text-blue-600 hover:underline">
              Already have an account? Log in
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
