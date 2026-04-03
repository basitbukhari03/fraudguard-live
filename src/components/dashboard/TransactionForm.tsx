import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Send, Zap, Calendar, Clock, DollarSign, Hash } from "lucide-react";

interface TransactionFormProps {
  onSubmit: (data: {
    txnId: string;
    date: string;
    time: string;
    amount: number;
  }) => void;
  isLoading: boolean;
}

const TransactionForm = ({ onSubmit, isLoading }: TransactionFormProps) => {
  const [txnId, setTxnId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [amount, setAmount] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!txnId.trim()) {
      newErrors.txnId = "Transaction ID is required";
    }

    if (!amount.trim()) {
      newErrors.amount = "Amount is required";
    } else if (isNaN(parseFloat(amount)) || parseFloat(amount) < 0) {
      newErrors.amount = "Enter a valid positive amount";
    }

    if (!date) {
      newErrors.date = "Date is required";
    }

    if (!time) {
      newErrors.time = "Time is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    onSubmit({
      txnId: txnId.trim(),
      date,
      time,
      amount: parseFloat(amount),
    });
  };

  return (
    <div className="glass-card p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20">
          <Zap className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">Analyze Transaction</h2>
          <p className="text-sm text-muted-foreground">
            Enter transaction details — AI pipeline handles the rest
          </p>
        </div>
      </div>

      {/* Pipeline Indicator */}
      <div className="flex items-center gap-1.5 mb-6 px-3 py-2 rounded-lg bg-secondary/50 text-xs text-muted-foreground overflow-x-auto">
        <span className="whitespace-nowrap font-medium text-primary">Input</span>
        <span>→</span>
        <span className="whitespace-nowrap">Validate</span>
        <span>→</span>
        <span className="whitespace-nowrap">Engineer</span>
        <span>→</span>
        <span className="whitespace-nowrap">Scale</span>
        <span>→</span>
        <span className="whitespace-nowrap">XGBoost</span>
        <span>→</span>
        <span className="whitespace-nowrap font-medium text-primary">Result</span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Transaction ID & Amount */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="txnId" className="flex items-center gap-2">
              <Hash className="h-3.5 w-3.5 text-muted-foreground" />
              Transaction ID
            </Label>
            <Input
              id="txnId"
              placeholder="TXN-2026-001"
              value={txnId}
              onChange={(e) => {
                setTxnId(e.target.value);
                if (errors.txnId) setErrors((prev) => ({ ...prev, txnId: "" }));
              }}
              className={errors.txnId ? "border-destructive" : ""}
            />
            {errors.txnId && (
              <p className="text-xs text-destructive">{errors.txnId}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount" className="flex items-center gap-2">
              <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
              Amount ($)
            </Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              placeholder="150.00"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                if (errors.amount) setErrors((prev) => ({ ...prev, amount: "" }));
              }}
              className={errors.amount ? "border-destructive" : ""}
            />
            {errors.amount && (
              <p className="text-xs text-destructive">{errors.amount}</p>
            )}
          </div>
        </div>

        {/* Date & Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="date" className="flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
              Date
            </Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                if (errors.date) setErrors((prev) => ({ ...prev, date: "" }));
              }}
              className={errors.date ? "border-destructive" : ""}
            />
            {errors.date && (
              <p className="text-xs text-destructive">{errors.date}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="time" className="flex items-center gap-2">
              <Clock className="h-3.5 w-3.5 text-muted-foreground" />
              Time
            </Label>
            <Input
              id="time"
              type="time"
              value={time}
              onChange={(e) => {
                setTime(e.target.value);
                if (errors.time) setErrors((prev) => ({ ...prev, time: "" }));
              }}
              className={errors.time ? "border-destructive" : ""}
            />
            {errors.time && (
              <p className="text-xs text-destructive">{errors.time}</p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full"
          size="lg"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              Processing Pipeline...
            </span>
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              Analyze Transaction
            </>
          )}
        </Button>
      </form>
    </div>
  );
};

export default TransactionForm;
