import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import TransactionForm from "@/components/dashboard/TransactionForm";
import PredictionResult from "@/components/dashboard/PredictionResult";
import RecentTransactions from "@/components/dashboard/RecentTransactions";
import { Activity, Shield, TrendingUp, AlertTriangle } from "lucide-react";
import { useFraudPrediction } from "@/hooks/useFraudPrediction";
import { useTransactionHistory } from "@/contexts/TransactionHistoryContext";
import type { TransactionFormData } from "@/types/prediction";

interface Transaction {
  id: string;
  txnId: string;
  amount: number;
  prediction: "fraud" | "legitimate";
  probability: number;
  timestamp: string;
}

const Dashboard = () => {
  const { isLoading, result: currentResult, error, predict } = useFraudPrediction();
  const { addTransaction } = useTransactionHistory();
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const handleSubmit = async (data: TransactionFormData) => {
    const result = await predict(data);

    if (result) {
      const now = new Date();
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        txnId: result.txnId,
        amount: result.amount,
        prediction: result.prediction,
        probability: result.probability,
        timestamp: now.toLocaleString(),
      };
      setTransactions((prev) => [newTransaction, ...prev]);

      // Also save to persistent history
      addTransaction({
        id: newTransaction.id,
        txnId: result.txnId,
        date: data.date,
        time: data.time,
        amount: result.amount,
        prediction: result.prediction,
        probability: result.probability,
        timestamp: now.toLocaleString(),
      });
    }
  };

  // Stats
  const totalAnalyzed = transactions.length;
  const fraudDetected = transactions.filter((t) => t.prediction === "fraud").length;
  const legitimateCount = transactions.filter((t) => t.prediction === "legitimate").length;
  const avgProbability = transactions.length > 0
    ? transactions.reduce((acc, t) => acc + t.probability, 0) / transactions.length
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">
              Fraud Detection <span className="gradient-text">Dashboard</span>
            </h1>
            <p className="text-muted-foreground">
              Real-time transaction analysis powered by XGBoost ML pipeline
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { icon: Activity, label: "Total Analyzed", value: totalAnalyzed, color: "text-primary" },
              { icon: AlertTriangle, label: "Fraud Detected", value: fraudDetected, color: "text-destructive" },
              { icon: Shield, label: "Legitimate", value: legitimateCount, color: "text-success" },
              { icon: TrendingUp, label: "Avg. Probability", value: `${Math.round(avgProbability * 100)}%`, color: "text-warning" },
            ].map((stat, i) => (
              <div key={i} className="stat-card">
                <stat.icon className={`h-6 w-6 ${stat.color} mb-2`} />
                <p className="text-2xl font-bold font-mono">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Form */}
            <div className="space-y-6">
              <TransactionForm onSubmit={handleSubmit} isLoading={isLoading} />
              
              {/* Error Message */}
              {error && (
                <div className="glass-card p-4 border-destructive/50">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-destructive">Error</p>
                      <p className="text-sm text-muted-foreground">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Recent Transactions - Mobile/Tablet */}
              <div className="lg:hidden">
                <RecentTransactions transactions={transactions} />
              </div>
            </div>

            {/* Right Column - Result & Recent */}
            <div className="space-y-6">
              {currentResult ? (
                <PredictionResult
                  prediction={currentResult.prediction}
                  probability={currentResult.probability}
                  txnId={currentResult.txnId}
                  amount={currentResult.amount}
                  riskLevel={currentResult.riskLevel}
                  engineeredFeatures={currentResult.engineeredFeatures}
                  riskInsights={currentResult.riskInsights}
                />
              ) : (
                <div className="glass-card p-12 text-center">
                  <Shield className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Ready to Analyze</h3>
                  <p className="text-muted-foreground">
                    Submit a transaction to see fraud detection results
                  </p>
                </div>
              )}

              {/* Recent Transactions - Desktop */}
              <div className="hidden lg:block">
                <RecentTransactions transactions={transactions} />
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
