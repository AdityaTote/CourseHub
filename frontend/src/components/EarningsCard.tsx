import { MouseEvent, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useFetch } from "@/hooks/useFetch";
import { BACKEND_URL } from "@/utils";
import { useWallet } from "@solana/wallet-adapter-react";
import axios from "axios";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Loader2 } from "lucide-react";
import { useRecoilState } from "recoil";
import { balanceAtom } from "@/store/atom";

const EarningsCard: React.FC = () => {
	const wallet = useWallet();
	const [message, setMessage] = useState<{
		type: "success" | "error";
		text: string;
	} | null>(null);
	const { data, error, loading } = useFetch(
		`${BACKEND_URL}/api/v1/admin/balance`,
		true
	);
	const [balance, setBalance] = useRecoilState(balanceAtom);

	useEffect(() => {
		if (data) {
			setBalance(data);
		}
	}, [data, setBalance]);

	const handlePayout = async (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		try {
			if (!wallet.publicKey) {
				setMessage({
					type: "error",
					text: "Please connect your wallet first!",
				});
				return;
			}
			const response = await axios.post(
				`${BACKEND_URL}/api/v1/admin/payout`,
				{
					address: wallet.publicKey.toString(),
					amount: balance?.pendingAmount,
				},
				{ withCredentials: true }
			);

			if (response.data.success) {
				setMessage({ type: "success", text: "Payout initiated successfully!" });
				// Fetch updated balance data
				const balanceResponse = await axios.get(
					`${BACKEND_URL}/api/v1/admin/balance`,
					{ withCredentials: true }
				);
				setBalance(balanceResponse.data);
			} else {
				setMessage({ type: "error", text: "Failed to initiate payout!" });
			}
		} catch (err) {
			console.log(err);
			setMessage({ type: "error", text: "An error occurred during payout" });
		}
	};

	if (loading) {
		return (
			<div className="flex justify-center items-center h-48">
				<Loader2 className="h-8 w-8 animate-spin" />
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex justify-center">
				<Alert variant="destructive" className="mt-4 w-96">
					<AlertTitle>Error</AlertTitle>
					<AlertDescription>Failed to load earnings data</AlertDescription>
				</Alert>
			</div>
		);
	}

	return (
		<div className="flex flex-col items-center gap-4">
			{message && (
				<Alert
					variant={message.type === "success" ? "default" : "destructive"}
					className="w-96"
				>
					<AlertTitle>
						{message.type === "success" ? "Success" : "Error"}
					</AlertTitle>
					<AlertDescription>{message.text}</AlertDescription>
				</Alert>
			)}

			{balance && (
				<Card className="bg-white shadow-lg">
					<div className="flex space-x-20">
						<div>
							<CardContent>
								<CardHeader>
									<CardTitle className="text-primary">
										Current Earnings
									</CardTitle>
								</CardHeader>
								<p className="text-4xl font-bold text-primary text-center">
									{balance.pendingAmount} SOL
								</p>
							</CardContent>
							<div className="flex justify-center pb-4">
								<Button
									onClick={handlePayout}
									disabled={balance.pendingAmount < 0}
									className="bg-blue-600 hover:bg-blue-800 hover:text-black text-white"
								>
									Initiate Payout
								</Button>
							</div>
						</div>
						<div>
							<CardContent>
								<CardHeader>
									<CardTitle className="text-primary">
										Total Withdrawal
									</CardTitle>
								</CardHeader>
								<p className="text-4xl font-bold text-primary text-center">
									{balance.lockedAmount} SOL
								</p>
							</CardContent>
						</div>
					</div>
				</Card>
			)}
		</div>
	);
};

export default EarningsCard;

// function BalanceSkelton(){
//   return(
//     <div>

//     </div>
//   )
// }
