import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Layout } from "../../components/Layout";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";

export function AdminRegistration() {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [isError, setIsError] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle admin registration logic here
  };

  return (
    <Layout login="/admin/login" register="/admin/register">
      <div className="max-w-md mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div className="bg-white p-8 shadow rounded-lg">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">
            Admin Registration
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="firstName">Full Name</Label>
              <Input
                id="firstName"
                name="firstName"
                type="text"
                required
                className="mt-1"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="lastName">Full Name</Label>
              <Input
                id="lastName"
                name="lastName"
                type="text"
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
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="adminCode">Admin Registration Code</Label>
              <Input
                id="adminCode"
                name="adminCode"
                type="text"
                required
                className="mt-1"
              />
            </div>
            <div>
              <Button
                type="submit"
                className="w-full bg-blue-600 text-white hover:bg-blue-700"
              >
                Register as Admin
              </Button>
            </div>
          </form>
          <div className="mt-4 text-center">
            <Link
              to="/admin-login"
              className="text-sm text-blue-600 hover:underline"
            >
              Already have an admin account? Log in
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
