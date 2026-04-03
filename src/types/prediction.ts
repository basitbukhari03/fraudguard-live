// ── API Request / Response Types ──────────────────────────────────

/** Body sent to POST /predict — raw transaction fields only */
export interface PredictRequest {
  transaction_id: string;
  amount: number;
  date: string;
  time: string;
}

/** JSON returned from POST /predict */
export interface PredictResponse {
  prediction: string; // "Fraud" | "Legitimate"
  fraud_probability: number;
  risk_level: "low" | "medium" | "high";
  engineered_features: Record<string, number>;
  risk_insights: string[];
}

/** Error response from the API */
export interface PredictErrorResponse {
  error: string | string[];
}

// ── App-Level Types ──────────────────────────────────────────────

/** Normalised result used across the frontend */
export interface PredictionResult {
  prediction: "fraud" | "legitimate";
  probability: number;
  txnId: string;
  amount: number;
  riskLevel: "low" | "medium" | "high";
  engineeredFeatures: Record<string, number>;
  riskInsights: string[];
}

/** Shape of the data emitted by <TransactionForm /> */
export interface TransactionFormData {
  txnId: string;
  date: string;
  time: string;
  amount: number;
}
