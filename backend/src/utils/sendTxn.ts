import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, sendAndConfirmTransaction, SystemProgram, Transaction } from "@solana/web3.js";
import { parentWalletAddress, privateKey, solanaRpcUrl } from "../constant";
import decode from "bs58";

const connection = new Connection(solanaRpcUrl, "confirmed");

export async function sendTxn(
    address: string,
    amount: number,
){
    console.log("Sending transaction to", address, "with amount", amount);
    const transaction = new Transaction().add(
        SystemProgram.transfer({
            fromPubkey: new PublicKey(parentWalletAddress !),
            toPubkey: new PublicKey(address),
            lamports: amount * LAMPORTS_PER_SOL,
        })
    )

    const keypair = Keypair.fromSecretKey(decode.decode(privateKey!))

   try {
     const signature = await sendAndConfirmTransaction(
         connection,
         transaction,
         [keypair],
     )
 
     if (!signature) {
         return {
             sign: signature,
             verify: false
         }
     }
 
     return{
         sign: signature,
         verify: true
     }
   } catch (error) {
       console.error(error);
       return {
           sign: null,
           verify: false
       };
   }
}