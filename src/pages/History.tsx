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
import { CheckCircle, XCircle, Search, Download, Filter, Clock, Trash2 } from "lucide-react";
import { useTransactionHistory } from "@/contexts/TransactionHistoryContext";

const History = () => {
  const { transactions, clearHistory } = useTransactionHistory();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "fraud" | "legitimate">("all");

  const filteredTransactions = transactions.filter((txn) => {
    const matchesSearch = txn.txnId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === "all" || txn.prediction === filterType;
    return matchesSearch && matchesFilter;
  });

  const handleExportCSV = () => {
    if (transactions.length === 0) return;
    const headers = ["Transaction ID", "Date", "Time", "Amount", "Prediction", "Probability", "Analyzed At"];
    const rows = transactions.map((txn) => [
      txn.txnId,
      txn.date,
      txn.time,
      txn.amount.toFixed(2),
      txn.prediction,
      (txn.probability * 100).toFixed(1) + "%",
      txn.timestamp,
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `fraudguard_history_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

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
            <div className="flex gap-2">
              {transactions.length > 0 && (
                <Button variant="outline" className="w-fit" onClick={clearHistory}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear History
                </Button>
              )}
              <Button variant="outline" className="w-fit" onClick={handleExportCSV} disabled={transactions.length === 0}>
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
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
                  {searchQuery
                    ? "Try adjusting your search query"
                    : transactions.length === 0
                    ? "Analyze a transaction from the Dashboard to see it here"
                    : "No transactions match the current filter"}
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
            Showing {filteredTransactions.length} of {transactions.length} transactions
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default History;
