
import { Shield } from "lucide-react";

const Header = () => {
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
          <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
            Connect Wallet
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
