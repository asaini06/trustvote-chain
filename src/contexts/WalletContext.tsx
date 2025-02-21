
import { createContext, useContext, useState, ReactNode } from "react";
import { ethers } from "ethers";

interface WalletContextType {
  walletConnected: boolean;
  provider: ethers.Provider | null;
  signer: ethers.Signer | null;
  connectWallet: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [walletConnected, setWalletConnected] = useState(false);
  const [provider, setProvider] = useState<ethers.Provider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);

  const connectWallet = async () => {
    try {
      const ethereum = window.ethereum;

      if (ethereum) {
        await ethereum.request({ method: 'eth_requestAccounts' });
        const ethersProvider = new ethers.BrowserProvider(ethereum);
        const ethersSigner = await ethersProvider.getSigner();
        
        setProvider(ethersProvider);
        setSigner(ethersSigner);
        setWalletConnected(true);
      }
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      throw error;
    }
  };

  return (
    <WalletContext.Provider value={{ walletConnected, provider, signer, connectWallet }}>
      {children}
    </WalletContext.Provider>
  );
}

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
