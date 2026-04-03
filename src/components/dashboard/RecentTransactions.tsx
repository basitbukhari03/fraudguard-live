import { CheckCircle, XCircle, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface Transaction {
  id: string;
  txnId: string;
  amount: number;
  prediction: "fraud" | "legitimate";
  probability: number;
  timestamp: string;
}

interface RecentTransactionsProps {
  transactions: Transaction[];
}

const RecentTransactions = ({ transactions }: RecentTransactionsProps) => {
  if (transactions.length === 0) {
    return (
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Analyses</h3>
        <div className="text-center py-8">
          <Clock className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
          <p className="text-muted-foreground">No transactions analyzed yet</p>
          <p className="text-sm text-muted-foreground/70">
            Submit a transaction to see results here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Recent Analyses</h3>
        <Link to="/history">
          <Button variant="ghost" size="sm">
            View All
          </Button>
        </Link>
      </div>

      <div className="space-y-3">
        {transactions.slice(0, 5).map((txn) => (
          <div
            key={txn.id}
            className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${
                txn.prediction === "fraud" ? "bg-destructive/20" : "bg-success/20"
              }`}>
                {txn.prediction === "fraud" ? (
                  <XCircle className="h-4 w-4 text-destructive" />
                ) : (
                  <CheckCircle className="h-4 w-4 text-success" />
                )}
              </div>
              <div>
                <p className="font-medium text-sm">{txn.txnId}</p>
                <p className="text-xs text-muted-foreground">{txn.timestamp}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-mono font-medium">${txn.amount.toFixed(2)}</p>
              <p className={`text-xs ${
                txn.prediction === "fraud" ? "text-destructive" : "text-success"
              }`}>
                {Math.round(txn.probability * 100)}% fraud
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentTransactions;
