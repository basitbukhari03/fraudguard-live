import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { predictFraud } from "@/services/api";
import type {
  PredictionResult,
  TransactionFormData,
} from "@/types/prediction";

/**
 * Hook encapsulating the fraud prediction workflow.
 *
 * All feature engineering now happens on the backend.
 * The frontend simply sends raw transaction fields and displays the result.
 */
export function useFraudPrediction() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  async function predict(formData: TransactionFormData) {
    setIsLoading(true);
    setError(null);

    try {
      // Send raw transaction data — backend handles the entire pipeline
      const response = await predictFraud({
        transaction_id: formData.txnId,
        amount: formData.amount,
        date: formData.date,
        time: formData.time,
      });

      // Normalise the response
      const prediction: "fraud" | "legitimate" =
        response.prediction.toLowerCase() === "fraud" ? "fraud" : "legitimate";

      const predictionResult: PredictionResult = {
        prediction,
        probability: response.fraud_probability,
        txnId: formData.txnId,
        amount: formData.amount,
        riskLevel: response.risk_level,
        engineeredFeatures: response.engineered_features,
        riskInsights: response.risk_insights,
      };

      setResult(predictionResult);
      return predictionResult;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(message);

      toast({
        variant: "destructive",
        title: "Prediction Failed",
        description: message,
      });

      return null;
    } finally {
      setIsLoading(false);
    }
  }

  return { isLoading, result, error, predict };
}
