import { useState } from "react";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Shield,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Cpu,
  Lightbulb,
} from "lucide-react";

interface PredictionResultProps {
  prediction: "fraud" | "legitimate";
  probability: number;
  txnId: string;
  amount: number;
  riskLevel: "low" | "medium" | "high";
  engineeredFeatures: Record<string, number>;
  riskInsights: string[];
}

const featureLabels: Record<string, string> = {
  log_amount: "Log Amount",
  hour: "Hour",
  day: "Day of Month",
  month: "Month",
  weekend_flag: "Weekend",
  night_flag: "Night Transaction",
  high_amount_flag: "High Amount",
  transaction_hash: "Transaction Hash",
};

const PredictionResult = ({
  prediction,
  probability,
  txnId,
  amount,
  riskLevel,
  engineeredFeatures,
  riskInsights,
}: PredictionResultProps) => {
  const [showFeatures, setShowFeatures] = useState(false);
  const isFraud = prediction === "fraud";
  const percentage = Math.round(probability * 100);

  const riskLabels = {
    low: "Low Risk",
    medium: "Medium Risk",
    high: "High Risk",
  };

  return (
    <div
      className="glass-card-elevated overflow-hidden relative"
      style={{ animation: "slideUp 0.5s ease-out" }}
    >
      {/* Background Glow */}
      <div
        className={`absolute inset-0 opacity-10 ${
          isFraud
            ? "bg-gradient-to-br from-destructive to-transparent"
            : "bg-gradient-to-br from-success to-transparent"
        }`}
      />

      {/* Animated pulse ring for fraud */}
      {isFraud && (
        <div className="absolute top-4 right-4 z-20">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-destructive"></span>
          </span>
        </div>
      )}

      <div className="relative z-10 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Analysis Result</h3>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium border ${
              riskLevel === "low"
                ? "risk-low"
                : riskLevel === "medium"
                ? "risk-medium"
                : "risk-high"
            }`}
          >
            {riskLabels[riskLevel]}
          </span>
        </div>

        {/* Main Result */}
        <div className="flex items-center gap-4 mb-6">
          <div
            className={`p-4 rounded-2xl ${
              isFraud ? "bg-destructive/20" : "bg-success/20"
            }`}
          >
            {isFraud ? (
              <XCircle className="h-10 w-10 text-destructive" />
            ) : (
              <CheckCircle className="h-10 w-10 text-success" />
            )}
          </div>
          <div>
            <p
              className={`text-3xl font-bold ${
                isFraud ? "text-destructive" : "text-success"
              }`}
            >
              {isFraud ? "Fraud Detected" : "Legitimate"}
            </p>
            <p className="text-sm text-muted-foreground">
              Transaction {txnId}
            </p>
          </div>
        </div>

        {/* Probability Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">Fraud Probability</span>
            <span className="font-mono font-semibold">{percentage}%</span>
          </div>
          <div className="relative h-3 rounded-full bg-secondary overflow-hidden">
            <div
              className={`absolute inset-y-0 left-0 rounded-full transition-all duration-1000 ease-out ${
                percentage < 30
                  ? "bg-success"
                  : percentage < 70
                  ? "bg-warning"
                  : "bg-destructive"
              }`}
              style={{
                width: `${percentage}%`,
                animation: "progressFill 1.2s ease-out",
              }}
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-4 rounded-lg bg-secondary/50">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <TrendingUp className="h-4 w-4" />
              <span className="text-xs">Amount</span>
            </div>
            <p className="text-xl font-bold font-mono">
              ${amount.toFixed(2)}
            </p>
          </div>
          <div className="p-4 rounded-lg bg-secondary/50">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Shield className="h-4 w-4" />
              <span className="text-xs">Confidence</span>
            </div>
            <p className="text-xl font-bold font-mono">
              {isFraud ? percentage : 100 - percentage}%
            </p>
          </div>
        </div>

        {/* Risk Insights */}
        {riskInsights && riskInsights.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="h-4 w-4 text-warning" />
              <h4 className="text-sm font-semibold">Risk Insights</h4>
            </div>
            <div className="space-y-2">
              {riskInsights.map((insight, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 px-3 py-2 rounded-lg bg-secondary/30 text-sm"
                  style={{
                    animation: `slideUp 0.3s ease-out ${i * 0.1}s both`,
                  }}
                >
                  <span className="text-muted-foreground leading-relaxed">
                    {insight}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Warning for fraud */}
        {isFraud && (
          <div className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/30 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-destructive">Action Required</p>
              <p className="text-sm text-muted-foreground">
                This transaction has been flagged as potentially fraudulent.
                Review immediately and consider blocking the transaction.
              </p>
            </div>
          </div>
        )}

        {/* Engineered Features (Collapsible) */}
        {engineeredFeatures && (
          <div className="border border-border/50 rounded-lg overflow-hidden">
            <button
              onClick={() => setShowFeatures(!showFeatures)}
              className="w-full flex items-center justify-between px-4 py-3 text-sm text-muted-foreground hover:bg-secondary/30 transition-colors"
            >
              <span className="flex items-center gap-2">
                <Cpu className="h-4 w-4" />
                Engineered Features (Debug)
              </span>
              {showFeatures ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>

            {showFeatures && (
              <div className="px-4 pb-4 border-t border-border/50">
                <div className="grid grid-cols-2 gap-2 mt-3">
                  {Object.entries(engineeredFeatures).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex items-center justify-between px-3 py-2 rounded-md bg-secondary/30 text-xs"
                    >
                      <span className="text-muted-foreground">
                        {featureLabels[key] || key}
                      </span>
                      <span className="font-mono font-medium">
                        {typeof value === "number" ? value.toFixed(4) : value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Inline keyframe styles */}
      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes progressFill {
          from {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
};

export default PredictionResult;
