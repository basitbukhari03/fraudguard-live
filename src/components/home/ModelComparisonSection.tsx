import { CheckCircle2, XCircle } from "lucide-react";

const models = [
  {
    name: "Random Forest",
    accuracy: "99.68%",
    rocAuc: "0.975",
    selected: false,
  },
  {
    name: "XGBoost",
    accuracy: "99.72%",
    rocAuc: "0.981",
    selected: true,
    highlight: true,
  },
  {
    name: "Neural Network",
    accuracy: "99.65%",
    rocAuc: "0.972",
    selected: false,
  },
  {
    name: "Isolation Forest",
    accuracy: "97.80%",
    rocAuc: "0.942",
    selected: false,
  },
];

const ModelComparisonSection = () => {
  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Model <span className="gradient-text">Comparison</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We evaluated multiple algorithms and selected XGBoost for its superior performance
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="glass-card-elevated overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-4 gap-4 p-4 border-b border-border/50 bg-secondary/30">
              <div className="font-semibold text-sm">Model</div>
              <div className="font-semibold text-sm text-center">Accuracy</div>
              <div className="font-semibold text-sm text-center">ROC-AUC</div>
              <div className="font-semibold text-sm text-center">Selected</div>
            </div>
            
            {/* Rows */}
            {models.map((model, i) => (
              <div
                key={i}
                className={`grid grid-cols-4 gap-4 p-4 border-b border-border/30 last:border-0 transition-colors ${
                  model.highlight ? "bg-primary/5" : "hover:bg-secondary/20"
                }`}
              >
                <div className="flex items-center gap-2">
                  {model.highlight && (
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  )}
                  <span className={model.highlight ? "font-semibold text-primary" : ""}>
                    {model.name}
                  </span>
                </div>
                <div className="text-center font-mono">{model.accuracy}</div>
                <div className="text-center font-mono">{model.rocAuc}</div>
                <div className="flex justify-center">
                  {model.selected ? (
                    <CheckCircle2 className="h-5 w-5 text-success" />
                  ) : (
                    <XCircle className="h-5 w-5 text-muted-foreground/50" />
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <p className="text-center text-sm text-muted-foreground mt-6">
            Dataset: Kaggle Credit Card Fraud Detection (284,807 transactions)
          </p>
        </div>
      </div>
    </section>
  );
};

export default ModelComparisonSection;
