
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, CheckCircle, Wallet } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { ethers } from "ethers";
import { SENTIMENT_VOTING_ABI, CONTRACT_ADDRESS } from "../utils/contracts";

interface VoteOption {
  id: number;
  title: string;
  description: string;
  votes: number;
  sentiment: number;
}

const Vote = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const [provider, setProvider] = useState<ethers.Provider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);

  const voteOptions: VoteOption[] = [
    {
      id: 1,
      title: "Positive Sentiment",
      description: "Support implementing new environmental policies (Vote for Alice)",
      votes: 150,
      sentiment: 1
    },
    {
      id: 2,
      title: "Negative Sentiment",
      description: "Against implementing new policies (Vote for Bob)",
      votes: 120,
      sentiment: -1
    },
    {
      id: 3,
      title: "Neutral Sentiment",
      description: "Maintain current regulations (Vote for Charlie)",
      votes: 80,
      sentiment: 0
    }
  ];

  const connectWallet = async () => {
    try {
      const ethereum = window.ethereum;

      if (ethereum) {
        await ethereum.request({ method: 'eth_requestAccounts' });
        const ethersProvider = new ethers.BrowserProvider(ethereum);
        const ethersSigner = await ethersProvider.getSigner();
        const votingContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          SENTIMENT_VOTING_ABI,
          ethersSigner
        );

        setProvider(ethersProvider);
        setSigner(ethersSigner);
        setContract(votingContract);
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

  const handleVote = async () => {
    if (!walletConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first.",
        variant: "destructive",
      });
      return;
    }

    if (selectedOption === null) {
      toast({
        title: "Please select an option",
        description: "You must select an option to cast your vote.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (!contract) throw new Error("Contract not initialized");

      toast({
        title: "Processing Vote",
        description: "Please confirm the transaction in your wallet...",
      });

      // Update sentiment score first
      const selectedSentiment = voteOptions.find(opt => opt.id === selectedOption)?.sentiment ?? 0;
      const updateTx = await contract.updateSentiment(selectedSentiment);
      await updateTx.wait();

      // Then cast the vote
      const voteTx = await contract.vote();
      await voteTx.wait();

      setHasVoted(true);
      toast({
        title: "Vote Recorded",
        description: "Your vote has been successfully recorded on the blockchain.",
      });
    } catch (error) {
      toast({
        title: "Voting Failed",
        description: "There was an error processing your vote.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="w-full py-6 px-4 border-b backdrop-blur-sm sticky top-0 z-50 bg-white/80">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <Shield className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-semibold">SecureVote</h1>
          </div>
          {!walletConnected && (
            <button
              onClick={connectWallet}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Wallet className="w-4 h-4" />
              Connect Wallet
            </button>
          )}
        </div>
      </header>

      <main className="container mx-auto py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Cast Your Vote</h1>
          
          <div className="space-y-6">
            {voteOptions.map((option) => (
              <div
                key={option.id}
                className={`glass-card hover-card p-6 rounded-lg cursor-pointer ${
                  selectedOption === option.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => !hasVoted && setSelectedOption(option.id)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{option.title}</h3>
                    <p className="text-gray-600">{option.description}</p>
                  </div>
                  {selectedOption === option.id && (
                    <CheckCircle className="w-6 h-6 text-primary" />
                  )}
                </div>
                <div className="mt-4">
                  <div className="text-sm text-gray-500">
                    Current Votes: {option.votes}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {!hasVoted ? (
            <button
              onClick={handleVote}
              disabled={!walletConnected}
              className={`mt-8 w-full py-3 ${
                walletConnected 
                  ? 'bg-primary hover:bg-primary/90' 
                  : 'bg-gray-400 cursor-not-allowed'
              } text-white rounded-lg transition-colors`}
            >
              {walletConnected ? 'Confirm Vote' : 'Connect Wallet to Vote'}
            </button>
          ) : (
            <div className="mt-8 text-center">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-green-700">Vote Successfully Recorded</h3>
              <p className="text-gray-600 mt-2">Thank you for participating in the voting process.</p>
              <button
                onClick={() => navigate('/')}
                className="mt-4 px-6 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors"
              >
                Return Home
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Vote;
