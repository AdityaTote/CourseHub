import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Layout } from "../../components/Layout";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";
import useUserAuth from "@/hooks/useUserAuth";
import { useFetch } from "@/hooks/useFetch";
import { BACKEND_URL, PARENT_WALLET_ADDRESS } from "@/utils";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { ConnectWallet } from "@/components/ConnectWallet";
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import axios from "axios";

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="-mx-24">loading...</div>
    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-600"></div>
  </div>
);

export function Payment() {
  const { connection } = useConnection();
  const wallet = useWallet();
  const navigate = useNavigate();
  const { isAuthenticated } = useUserAuth();
  const { id } = useParams<{ id: string }>();
  const [ message, setMessage ] = useState<string>("")
  const [paymentMethod, setPaymentMethod] = useState("ethereum");
  const { data, loading, error } = useFetch(
    `${BACKEND_URL}/api/v1/course/preview/${id}`
  );

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/user/login");
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return null; // or a message indicating the user is being redirected
  }

  if (data) {
    const handleSubmit = async(e: React.FormEvent) => {
      e.preventDefault();
      if(!wallet.publicKey){
        setMessage(`Wallet is not connected!`)
        return;
      }

      const resOne = await axios.get(`${BACKEND_URL}/api/v1/course/${data.id}`,{
        withCredentials: true,
      })

      if(resOne.data.data.isPurchased === true){
        const transaction = new Transaction().add(
          SystemProgram.transfer({
            fromPubkey: wallet.publicKey,
            toPubkey: new PublicKey(PARENT_WALLET_ADDRESS),
            lamports: Number(data.price) * LAMPORTS_PER_SOL,
          })
        );
  
        const response = await wallet.sendTransaction(transaction, connection);
  
        if (response) {
          const resTwo = await axios.post(`${BACKEND_URL}/api/v1/course/purchased/${data.id}`,{
            address: wallet.publicKey.toString(),
            amount: data.price,
            signature: response,
            adminId: resOne.data.data.adminId
          },{ withCredentials: true })

          if(resTwo){
            alert("Transaction successful!")
            setMessage(`Transaction successful!`)
            return;
          }
        } else {
          setMessage("Transaction failed");
          return;
        }  
      } else {
        setMessage(`You have already purchased this course!`)
        return;
      }

    };
    return (
      <Layout>
        <div className="flex justify-center p-10">
          <ConnectWallet wallet={wallet} />
        </div>
        <div className="max-w-3xl mx-auto px-4  sm:px-6 lg:px-">
          <div className="bg-white shadow rounded-lg p-8">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-6">
              Payment for {data.title}
            </h1>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Amount Due
              </h2>
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
