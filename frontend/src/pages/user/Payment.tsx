import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Layout } from "../../components/Layout";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";
import useUserAuth from "@/hooks/useUserAuth";
import {
  WalletDisconnectButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import { useFetch } from "@/hooks/useFetch";
import { BACKEND_URL } from "@/utils";

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="-mx-24">loading...</div>
    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-600"></div>
  </div>
);

export function Payment() {
  const navigate = useNavigate();
  const { isAuthenticated } = useUserAuth();
  const { id } = useParams<{ id: string }>();
  const [paymentMethod, setPaymentMethod] = useState("ethereum");
  const { data, loading, error } = useFetch(`${BACKEND_URL}/api/v1/course/preview/${id}`);

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

  if(data){
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      // Handle payment logic here
    };
    return (
      <Layout>
        <div className="flex justify-between p-4">
          <div className="">
            <WalletMultiButton />
          </div>
          <WalletDisconnectButton />
        </div>
        <div className="max-w-3xl mx-auto py-16 px-4 sm:py-16 sm:px-6 lg:px-">
          <div className="bg-white shadow rounded-lg p-8">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-6">
              Payment for {data.title}
            </h1>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Amount Due</h2>
              <p className="text-3xl font-bold text-blue-600">
                {data.price} SOL
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
}
