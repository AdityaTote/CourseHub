import dotenv from "dotenv";

dotenv.config();

export const DBSTRING = process.env.DB_STRING;
export const port = process.env.PORT;
export const userJwtSecret = process.env.USER_JWT_SECERET_KEY;
export const adminJwtSecret = process.env.ADMIN_JWT_SECERET_KEY;
export const cloudName = process.env.CLOUD_NAME;
export const cloudApiKey = process.env.CLOUD_API_KEY;
export const cloudApiSecret = process.env.CLOUD_API_SECRET;
export const solanaRpcUrl = process.env.SOLANA_RPC_URL !;
export const parentWalletAddress = process.env.PARENT_WALLET_ADDRESS;
export const privateKey = process.env.PRIVATE_KEY;