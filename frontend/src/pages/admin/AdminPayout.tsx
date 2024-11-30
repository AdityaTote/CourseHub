import AdminEarningsPage from "@/components/AdminEarningsPage";
import { ConnectWallet } from "@/components/ConnectWallet";
import { Layout } from "@/components/Layout";
import { useWallet } from "@solana/wallet-adapter-react";

export function AdminPayout(){
    const wallet = useWallet();
return <Layout>
        <ConnectWallet wallet={wallet} />
        <AdminEarningsPage/>
    </Layout>
}