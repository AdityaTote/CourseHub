import { Connection } from "@solana/web3.js";
import { parentWalletAddress, solanaRpcUrl } from "../constant";

const connection = new Connection(solanaRpcUrl, "confirmed");

export async function verifyTransaction(
  signature: string,
  address: string,
): Promise<boolean> {
  try {
    const transaction = await connection.getTransaction(signature,{
      maxSupportedTransactionVersion: 2,
    });
    console.log(transaction);

    if (!transaction) {
      console.log("Transaction not found");
      return false;
    }

    const accountKeys = transaction.transaction.message.getAccountKeys().staticAccountKeys;
    const txPayerKey = accountKeys[0].toString();
    const txPaidKey = accountKeys[1]?.toString();
    
    if (!transaction.meta?.preBalances || !transaction.meta?.postBalances) {
      console.log("Balance information missing");
      return false;
    }

    console.log("Parent address:", parentWalletAddress);
    console.log("Transaction details:", {
      payer: txPayerKey,
      recipient: txPaidKey,
    });

    if (txPayerKey === address && txPaidKey === parentWalletAddress) {
      console.log("Address match verified");
      return true;
    }
    console.log("Address mismatch");
    return false;
  } catch (e) {
    console.log(e);
    return false;
  }
}
