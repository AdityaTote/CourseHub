import { WalletContextState } from "@solana/wallet-adapter-react"
import { WalletDisconnectButton, WalletMultiButton } from "@solana/wallet-adapter-react-ui"

export const ConnectWallet = ({wallet}: {wallet: WalletContextState}) =>{
    return(
        <div>
          {wallet.publicKey ?<WalletDisconnectButton /> : <WalletMultiButton /> }
        </div>
    )
}