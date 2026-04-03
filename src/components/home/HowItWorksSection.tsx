import { UserPlus, FileText, Cpu, CheckCircle } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    step: "01",
    title: "Create Account",
    description: "Sign up with your email to access the fraud detection dashboard.",
  },
  {
    icon: FileText,
    step: "02",
    title: "Submit Transaction",
    description: "Enter transaction details or use advanced mode for PCA features.",
  },
  {
    icon: Cpu,
    step: "03",
    title: "ML Analysis",
    description: "XGBoost model analyzes the transaction against trained patterns.",
  },
  {
    icon: CheckCircle,
    step: "04",
    title: "Get Results",
    description: "Receive fraud probability, risk level, and clear prediction.",
  },
];

const HowItWorksSection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            How It <span className="gradient-text">Works</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Simple four-step process to analyze your transactions for potential fraud
          </p>
        </div>

        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent -translate-y-1/2" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((item, i) => (
              <div
                key={i}
                className="relative group"
              >
                <div className="glass-card p-6 text-center relative z-10 h-full hover:border-primary/50 transition-all duration-300">
                  {/* Step Number */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                    {item.step}
                  </div>
                  
                  {/* Icon */}
                  <div className="p-4 rounded-2xl bg-primary/10 w-fit mx-auto mb-4 mt-2 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                    <item.icon className="h-8 w-8 text-primary" />
                  </div>
                  
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
