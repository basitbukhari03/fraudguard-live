import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface HistoryTransaction {
  id: string;
  txnId: string;
  date: string;
  time: string;
  amount: number;
  prediction: "fraud" | "legitimate";
  probability: number;
  timestamp: string;
}

interface TransactionHistoryContextType {
  transactions: HistoryTransaction[];
  addTransaction: (txn: HistoryTransaction) => void;
  clearHistory: () => void;
}

const STORAGE_KEY = "fraudguard_history";

const TransactionHistoryContext = createContext<TransactionHistoryContextType | null>(null);

export const useTransactionHistory = () => {
  const context = useContext(TransactionHistoryContext);
  if (!context) throw new Error("useTransactionHistory must be used within TransactionHistoryProvider");
  return context;
};

export const TransactionHistoryProvider = ({ children }: { children: ReactNode }) => {
  const [transactions, setTransactions] = useState<HistoryTransaction[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setTransactions(JSON.parse(stored));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  // Save to localStorage whenever transactions change
  useEffect(() => {
    if (transactions.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
    }
  }, [transactions]);

  const addTransaction = (txn: HistoryTransaction) => {
    setTransactions((prev) => {
      const updated = [txn, ...prev];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const clearHistory = () => {
    setTransactions([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <TransactionHistoryContext.Provider value={{ transactions, addTransaction, clearHistory }}>
      {children}
    </TransactionHistoryContext.Provider>
  );
};
