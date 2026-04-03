import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckCircle, XCircle, Search, Download, Filter, Clock } from "lucide-react";

// Demo data - will be replaced with actual API data
const demoTransactions = [
  { id: "1", txnId: "TXN001234", date: "2025-11-15", time: "14:32:00", amount: 250.00, prediction: "legitimate" as const, probability: 0.12, timestamp: "2024-01-15 14:32:45" },
  { id: "2", txnId: "TXN001235", date: "2025-12-15", time: "15:45:00", amount: 5420.00, prediction: "fraud" as const, probability: 0.87, timestamp: "2024-01-15 15:45:12" },
  { id: "3", txnId: "TXN001236", date: "2025-12-15", time: "16:20:00", amount: 89.99, prediction: "legitimate" as const, probability: 0.05, timestamp: "2024-01-15 16:20:33" },
  { id: "4", txnId: "TXN001237", date: "2025-12-16", time: "09:15:00", amount: 3200.00, prediction: "fraud" as const, probability: 0.72, timestamp: "2024-01-16 09:15:18" },
  { id: "5", txnId: "TXN001238", date: "2025-12-16", time: "11:00:00", amount: 45.50, prediction: "legitimate" as const, probability: 0.08, timestamp: "2024-01-16 11:00:55" },
  { id: "6", txnId: "TXN001239", date: "2025-12-16", time: "14:22:00", amount: 1500.00, prediction: "legitimate" as const, probability: 0.23, timestamp: "2024-01-16 14:22:40" },
  { id: "7", txnId: "TXN001240", date: "2025-12-17", time: "10:30:00", amount: 8900.00, prediction: "fraud" as const, probability: 0.91, timestamp: "2024-01-17 10:30:22" },
  { id: "8", txnId: "TXN001241", date: "2025-12-17", time: "13:45:00", amount: 120.00, prediction: "legitimate" as const, probability: 0.15, timestamp: "2024-01-17 13:45:10" },
];

const History = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "fraud" | "legitimate">("all");

  const filteredTransactions = demoTransactions.filter((txn) => {
    const matchesSearch = txn.txnId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === "all" || txn.prediction === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Transaction <span className="gradient-text">History</span>
              </h1>
              <p className="text-muted-foreground">
                Review all past fraud analysis results
              </p>
            </div>
            <Button variant="outline" className="w-fit">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>

          {/* Filters */}
          <div className="glass-card p-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by Transaction ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              {/* Filter Buttons */}
              <div className="flex gap-2">
                {[
                  { value: "all", label: "All" },
                  { value: "fraud", label: "Fraud" },
                  { value: "legitimate", label: "Legitimate" },
                ].map((filter) => (
                  <Button
                    key={filter.value}
                    variant={filterType === filter.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterType(filter.value as typeof filterType)}
                  >
                    <Filter className="h-3 w-3 mr-1" />
                    {filter.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="glass-card overflow-hidden">
            {filteredTransactions.length === 0 ? (
              <div className="text-center py-16">
                <Clock className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Transactions Found</h3>
                <p className="text-muted-foreground">
                  {searchQuery ? "Try adjusting your search query" : "No transaction history yet"}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border/50 hover:bg-transparent">
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead className="text-center">Prediction</TableHead>
                      <TableHead className="text-center">Probability</TableHead>
                      <TableHead>Analyzed At</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.map((txn) => (
                      <TableRow key={txn.id} className="border-border/30">
                        <TableCell className="font-mono font-medium">{txn.txnId}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {txn.date} {txn.time}
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          ${txn.amount.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                              txn.prediction === "fraud" 
                                ? "bg-destructive/20 text-destructive" 
                                : "bg-success/20 text-success"
                            }`}>
                              {txn.prediction === "fraud" ? (
                                <XCircle className="h-3 w-3" />
                              ) : (
                                <CheckCircle className="h-3 w-3" />
                              )}
                              {txn.prediction === "fraud" ? "Fraud" : "Legitimate"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className={`font-mono text-sm ${
                            txn.probability > 0.7 
                              ? "text-destructive" 
                              : txn.probability > 0.3 
                                ? "text-warning" 
                                : "text-success"
                          }`}>
                            {Math.round(txn.probability * 100)}%
                          </span>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {txn.timestamp}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>

          {/* Stats Summary */}
          <div className="mt-6 text-center text-sm text-muted-foreground">
            Showing {filteredTransactions.length} of {demoTransactions.length} transactions
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default History;
