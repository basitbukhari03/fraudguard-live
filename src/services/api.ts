import type {
  PredictRequest,
  PredictResponse,
  PredictErrorResponse,
} from "@/types/prediction";

// Dev: uses Vite proxy (/api → localhost:5000)
// Production: uses VITE_API_BASE env var pointing to Render backend
const API_BASE = import.meta.env.VITE_API_BASE || "/api";

/**
 * Calls the Flask /predict endpoint with raw transaction data.
 *
 * The backend handles all feature engineering, scaling, and ML prediction.
 * Frontend only sends: transaction_id, amount, date, time.
 *
 * @param data - Raw transaction fields
 * @returns The prediction result from the ML pipeline
 * @throws Error with a user-friendly message on network / server / validation failure
 */
export async function predictFraud(
  data: PredictRequest
): Promise<PredictResponse> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  } catch {
    throw new Error(
      "Unable to reach the prediction server. Please make sure the backend is running on port 5000."
    );
  }

  // Handle validation errors (422) and other server errors
  if (!response.ok) {
    let errorMessage = `Server error (${response.status})`;

    try {
      const errorBody: PredictErrorResponse = await response.json();
      if (Array.isArray(errorBody.error)) {
        errorMessage = errorBody.error.join(" ");
      } else if (typeof errorBody.error === "string") {
        errorMessage = errorBody.error;
      }
    } catch {
      const text = await response.text().catch(() => "");
      if (text) errorMessage += `: ${text}`;
    }

    throw new Error(errorMessage);
  }

  return response.json() as Promise<PredictResponse>;
}
