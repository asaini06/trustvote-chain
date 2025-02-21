
import { Lock, Users, Vote } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: <Lock className="w-10 h-10 text-primary" />,
      title: "Secure & Immutable",
      description: "Every vote is cryptographically secured and permanently recorded on the blockchain.",
    },
    {
      icon: <Users className="w-10 h-10 text-primary" />,
      title: "Transparent Voting",
      description: "Real-time verification and auditing of all voting activities.",
    },
    {
      icon: <Vote className="w-10 h-10 text-primary" />,
      title: "Anonymous Voting",
      description: "Cast your vote with complete privacy while ensuring authentication.",
    },
  ];

  return (
    <section id="features" className="py-20 px-4 bg-gray-50">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose SecureVote?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="glass-card hover-card rounded-xl p-6 text-center"
            >
              <div className="mb-4 flex justify-center">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
