
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, CheckCircle, Wallet } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { ethers } from "ethers";
import { SENTIMENT_VOTING_ABI, CONTRACT_ADDRESS } from "../utils/contracts";
import { useWallet } from "@/contexts/WalletContext";
import { Button } from "@/components/ui/button";

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
  const { walletConnected, signer, connectWallet } = useWallet();
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

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

  const handleConnectWallet = async () => {
    try {
      setIsConnecting(true);
      await connectWallet();
      if (signer) {
        const votingContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          SENTIMENT_VOTING_ABI,
          signer
        );
        setContract(votingContract);
      }
      toast({
        title: "Ready to Vote!",
        description: "Your wallet is connected. You can now cast your vote.",
      });
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Please make sure MetaMask is installed and try again.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleVote = async () => {
    if (!walletConnected) {
      toast({
        title: "Connect Your Wallet",
        description: "Please connect your wallet to vote.",
        variant: "destructive",
      });
      return;
    }

    if (selectedOption === null) {
      toast({
        title: "Select an Option",
        description: "Please select a voting option before proceeding.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (!contract) throw new Error("Contract not initialized");

      toast({
        title: "Confirming Vote",
        description: "Please confirm the transaction in your wallet...",
      });

      const selectedSentiment = voteOptions.find(opt => opt.id === selectedOption)?.sentiment ?? 0;
      const updateTx = await contract.updateSentiment(selectedSentiment);
      await updateTx.wait();

      const voteTx = await contract.vote();
      await voteTx.wait();

      setHasVoted(true);
      toast({
        title: "Success!",
        description: "Your vote has been recorded on the blockchain.",
      });
    } catch (error) {
      toast({
        title: "Voting Failed",
        description: "There was an error while processing your vote. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!walletConnected) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <header className="w-full py-6 px-4 border-b backdrop-blur-sm sticky top-0 z-50 bg-white/80">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
              <Shield className="w-8 h-8 text-primary" />
              <h1 className="text-2xl font-semibold">SecureVote</h1>
            </div>
          </div>
        </header>

        <div className="flex-1 flex items-center justify-center">
          <div className="text-center p-8 max-w-md">
            <Wallet className="w-16 h-16 text-primary mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-4">Connect Your Wallet to Vote</h2>
            <p className="text-gray-600 mb-8">
              To participate in voting, you'll need to connect your Ethereum wallet. This ensures secure and transparent voting on the blockchain.
            </p>
            <Button
              onClick={handleConnectWallet}
              className="w-full flex items-center justify-center gap-2"
              disabled={isConnecting}
            >
              {isConnecting ? (
                "Connecting..."
              ) : (
                <>
                  <Wallet className="w-4 h-4" />
                  Connect Wallet to Vote
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="w-full py-6 px-4 border-b backdrop-blur-sm sticky top-0 z-50 bg-white/80">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <Shield className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-semibold">SecureVote</h1>
          </div>
          <div className="flex items-center gap-2 text-sm text-green-600">
            <Wallet className="w-4 h-4" />
            Wallet Connected
          </div>
        </div>
      </header>

      <main className="container mx-auto py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Cast Your Vote</h1>
          
          <div className="space-y-6">
            {voteOptions.map((option) => (
              <div
                key={option.id}
                className={`p-6 rounded-lg cursor-pointer border transition-all ${
                  selectedOption === option.id 
                    ? 'ring-2 ring-primary border-primary bg-primary/5' 
                    : 'border-gray-200 hover:border-primary/50'
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
            <Button
              onClick={handleVote}
              className="mt-8 w-full py-6 text-lg"
              disabled={selectedOption === null}
            >
              {selectedOption === null ? "Select an Option to Vote" : "Confirm Vote"}
            </Button>
          ) : (
            <div className="mt-8 text-center">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-green-700">Vote Successfully Recorded</h3>
              <p className="text-gray-600 mt-2">Thank you for participating in the voting process.</p>
              <Button
                onClick={() => navigate('/')}
                className="mt-4"
                variant="outline"
              >
                Return Home
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Vote;
