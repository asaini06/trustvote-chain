
import { Shield, Wallet } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { ethers } from "ethers";

const Header = () => {
  const [walletConnected, setWalletConnected] = useState(false);
  const { toast } = useToast();

  const connectWallet = async () => {
    try {
      const ethereum = window.ethereum;

      if (ethereum) {
        await ethereum.request({ method: 'eth_requestAccounts' });
        const ethersProvider = new ethers.BrowserProvider(ethereum);
        await ethersProvider.getSigner();
        
        setWalletConnected(true);
        toast({
          title: "Wallet Connected",
          description: "Your wallet has been successfully connected.",
        });
      } else {
        toast({
          title: "Metamask Required",
          description: "Please install Metamask to use this feature.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Failed to connect to your wallet.",
        variant: "destructive",
      });
    }
  };

  return (
    <header className="w-full py-6 px-4 border-b backdrop-blur-sm sticky top-0 z-50 bg-white/80">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-8 h-8 text-primary" />
          <h1 className="text-2xl font-semibold">SecureVote</h1>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <a href="#features" className="text-gray-600 hover:text-primary transition-colors">
            Features
          </a>
          <a href="#how-it-works" className="text-gray-600 hover:text-primary transition-colors">
            How it Works
          </a>
          {!walletConnected ? (
            <button 
              onClick={connectWallet}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Wallet className="w-4 h-4" />
              Connect Wallet
            </button>
          ) : (
            <button 
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg cursor-default"
            >
              <Wallet className="w-4 h-4" />
              Connected
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
