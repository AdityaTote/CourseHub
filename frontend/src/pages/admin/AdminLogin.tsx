import React from "react";
import { Link } from "react-router-dom";
import { Layout } from "../../components/Layout";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";

export function AdminLogin() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle admin login logic here
  };

  return (
    <Layout login="/admin/login" register="/admin/register">
      <div className="max-w-md mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div className="bg-white p-8 shadow rounded-lg">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">
            Admin Login
          </h2>
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
            <Link to="/login" className="text-sm text-blue-600 hover:underline">
              User Login
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
