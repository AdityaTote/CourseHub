import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Layout } from "../../components/Layout";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";
import useUserAuth from "@/hooks/useUserAuth";

const course = {
  id: 1,
  title: "Blockchain Fundamentals",
  price: 0.1,
};

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="-mx-24">loading...</div>
    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-600"></div>
  </div>
);

export function Payment() {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useUserAuth();
  const { id } = useParams<{ id: string }>();
  const [paymentMethod, setPaymentMethod] = useState("ethereum");

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return null; // or a message indicating the user is being redirected
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle payment logic here
  };

  return (
    <Layout login="/login" register="/register">
      <div className="max-w-3xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-6">
            Payment for {course.title}
          </h1>
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Amount Due</h2>
            <p className="text-3xl font-bold text-blue-600">
              {course.price} ETH
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label className="text-lg font-medium text-gray-900">
                Select Payment Method
              </Label>
              <RadioGroup
                value={paymentMethod}
                onValueChange={setPaymentMethod}
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="ethereum" id="ethereum" />
                  <Label htmlFor="ethereum">Ethereum (ETH)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="bitcoin" id="bitcoin" />
                  <Label htmlFor="bitcoin">Bitcoin (BTC)</Label>
                </div>
              </RadioGroup>
            </div>
            <div>
              <Label htmlFor="wallet-address">Your Wallet Address</Label>
              <Input
                id="wallet-address"
                name="wallet-address"
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
                Confirm Payment
              </Button>
            </div>
          </form>
          <div className="mt-6">
            <p className="text-sm text-gray-500">
              By clicking "Confirm Payment", you agree to our terms of service
              and privacy policy.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
