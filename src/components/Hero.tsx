
import { Vote } from "lucide-react";

const Hero = () => {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto text-center animate-fadeIn">
        <div className="mb-8">
          <Vote className="w-16 h-16 mx-auto text-primary mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Secure Blockchain Voting System
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Transform democratic participation with our cutting-edge blockchain voting platform. 
            Ensure transparency, security, and trust in every vote.
          </p>
        </div>
        <div className="flex gap-4 justify-center">
          <button className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
            Start Voting
          </button>
          <button className="px-6 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors">
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
