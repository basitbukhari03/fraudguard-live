import { Brain, Gauge, History, Shield, Code, Cpu } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "XGBoost ML Model",
    description: "State-of-the-art gradient boosting algorithm trained on real credit card fraud data with optimized hyperparameters.",
  },
  {
    icon: Gauge,
    title: "Real-time Analysis",
    description: "Get instant fraud probability scores and risk assessments within milliseconds of submission.",
  },
  {
    icon: History,
    title: "Transaction History",
    description: "Track and review all your past transaction analyses with detailed prediction logs.",
  },
  {
    icon: Shield,
    title: "High Accuracy",
    description: "99.72% accuracy with 0.981 ROC-AUC score, outperforming Random Forest and Neural Networks.",
  },
  {
    icon: Code,
    title: "REST API Access",
    description: "Integrate fraud detection into your systems with our secure API endpoints and authentication.",
  },
  {
    icon: Cpu,
    title: "PCA Features Support",
    description: "Advanced mode supporting V1-V28 PCA-transformed features for precise predictions.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Powered by <span className="gradient-text">Machine Learning</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our fraud detection system leverages advanced ML techniques trained on the Kaggle Credit Card Dataset
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <div
              key={i}
              className="glass-card p-6 group hover:border-primary/50 transition-all duration-300"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="p-3 rounded-xl bg-primary/10 w-fit mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
