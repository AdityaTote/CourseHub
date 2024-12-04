import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Layout } from "../../components/Layout";
import { Button } from "../../components/ui/button";
import useUserAuth from "@/hooks/useUserAuth";
import { useFetch } from "@/hooks/useFetch";
import { BACKEND_URL, PARENT_WALLET_ADDRESS } from "@/utils";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { ConnectWallet } from "@/components/ConnectWallet";
import {
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import axios, { AxiosError } from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CourseResponse } from "@/types";



export function Payment() {
  const { connection } = useConnection();
  const naviagte = useNavigate()
  const wallet = useWallet();
  const navigate = useNavigate();
  const { isAuthenticated } = useUserAuth();
  const { id } = useParams<{ id: string }>();
  const [message, setMessage] = useState<string>("");
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
    naviagte("/user/login");
    return null;
  }

  if (error) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[50vh]">
          <p className="text-xl text-gray-500">Something went wrong</p>
        </div>
      </Layout>
    );
  }

  if (data) {
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setMessage("");
      
      try {
        // Validate wallet connection
        if (!wallet.publicKey) {
          setMessage("Please connect your wallet first");
          return;
        }
    
        // Validate data exists
        if (!data?.id || !data.price) {
          setMessage("Invalid course data");
          return;
        }
    
        // Check if course is already purchased
        const { data: courseData }: { data: CourseResponse } = await axios.get(
          `${BACKEND_URL}/api/v1/user/course/${data.id}`,
          { withCredentials: true }
        );
    
        if (courseData.data.isPurchased) {
          setMessage("You have already purchased this course");
          return;
        }
    
        // Create and send transaction
        const transaction = new Transaction().add(
          SystemProgram.transfer({
            fromPubkey: wallet.publicKey,
            toPubkey: new PublicKey(PARENT_WALLET_ADDRESS),
            lamports: Number(data.price) * LAMPORTS_PER_SOL,
          })
        );
    
        // Send transaction
        const signature = await wallet.sendTransaction(transaction, connection);
        
        if (!signature) {
          setMessage("Transaction failed");
          return;
        }
    
        // Confirm transaction
        const confirmation = await connection.confirmTransaction(signature);
        if (!confirmation) {
          setMessage("Transaction confirmation failed");
          return;
        }
    
        // Record purchase
        const purchaseResponse = await axios.post(
          `${BACKEND_URL}/api/v1/user/purchased/${data.id}`,
          {
            address: wallet.publicKey.toString(),
            amount: data.price,
            signature,
            adminId: courseData.data.adminId,
          },
          { withCredentials: true }
        );
    
        if (purchaseResponse.data) {
          setMessage("Transaction successful!");
          // Optional: Redirect to course page
          // navigate(`/course/${data.id}`);
        } else {
          setMessage("Failed to record purchase");
        }
    
      } catch (error) {
        if (error instanceof AxiosError) {
          const errorMessage = error.response?.data?.error || "Transaction failed. Please try again.";
          console.log(errorMessage);
          setMessage(errorMessage);
        } else if (error instanceof Error) {
          // Generic Error handling
          console.log(error.message);
          setMessage(error.message);
        } else {
          // Fallback for unknown error types
          console.log("Payment error", error);
          setMessage("Transaction failed. Please try again.");
        }
      }
    };
    return (
      <Layout>
        <div className={"h-screen bg-slate-200"}>
          <div className="flex justify-center pt-4">
            <ConnectWallet wallet={wallet} />
          </div>
          {message && (
            <div className="flex justify-center">
            <Alert
              variant={"destructive"}
              className="mt-4 w-96"
            >
              <AlertTitle>{"Error"}</AlertTitle>
              <AlertDescription>{message}</AlertDescription>
            </Alert>
            </div>
          )}
            <div className="flex justify-center pt-4">
            <p className={`font-sans font-semibold text-xl`}>Complete Your Purchase</p>
            </div>
          <div className="flex justify-center p-1">

            <Card className={`w-[500px]`}>
              <CardHeader>
                <CardTitle className="text-xl">Purchasing {data.title}</CardTitle>
                <CardDescription></CardDescription>
              </CardHeader>
              <div className="400">
                <img
                  src={data.imageURL}
                  alt="course-image"
                  width={400}
                  className="h-64 w-400 object-cover mx-auto"
                />
              </div>
              <CardContent>
                <p className="text-2xl font-bold text-blue-600">
                  $ {data.price}
                </p>
                <p className="text-sm text-gray-500 py-2">
                  Created by: {data?.creater?.firstName}{" "}
                  {data?.creater?.lastName}
                </p>
              </CardContent>
              <CardFooter>
                  <Button onClick={handleSubmit} className="w-full bg-blue-600 text-white hover:bg-blue-700">
                    Pay
                  </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </Layout>
    );
  }
}

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="-mx-24">loading...</div>
    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-600"></div>
  </div>
);