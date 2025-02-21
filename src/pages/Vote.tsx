
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, CheckCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface VoteOption {
  id: number;
  title: string;
  description: string;
  votes: number;
}

const Vote = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasVoted, setHasVoted] = useState(false);

  const voteOptions: VoteOption[] = [
    {
      id: 1,
      title: "Option A",
      description: "Support implementing new environmental policies",
      votes: 150,
    },
    {
      id: 2,
      title: "Option B",
      description: "Maintain current environmental regulations",
      votes: 120,
    },
  ];

  const handleVote = () => {
    if (selectedOption === null) {
      toast({
        title: "Please select an option",
        description: "You must select an option to cast your vote.",
        variant: "destructive",
      });
      return;
    }

    // Simulating blockchain transaction
    toast({
      title: "Processing Vote",
      description: "Your vote is being recorded on the blockchain...",
    });

    setTimeout(() => {
      setHasVoted(true);
      toast({
        title: "Vote Recorded",
        description: "Your vote has been successfully recorded on the blockchain.",
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="w-full py-6 px-4 border-b backdrop-blur-sm sticky top-0 z-50 bg-white/80">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <Shield className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-semibold">SecureVote</h1>
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
              className="mt-8 w-full py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Confirm Vote
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
