import { useEffect, useState } from "react";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const fetchPredictionResult = async (predictionId: string) => {
  const response = await fetch("/api/prediction/" + predictionId);
  const prediction = await response.json();

  if (response.status !== 200) {
    throw new Error(prediction.detail);
  }
  return prediction;
};

const queryPrediction = async (predictionInput: PredictionInput) => {
  const response = await fetch("/api/prediction", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(predictionInput)
  });
  let prediction = await response.json();
  if (response.status !== 201) {
    throw new Error(prediction.detail);
  }
  return prediction;
};

type usePredictionType = [Prediction | null, string | null, (predictionInput:PredictionInput) => void]

export const usePrediction = (): usePredictionType => {
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const predictionId = window.localStorage.getItem("prediction_id");
    const getStoredPrediction = async (predictionId: string) => {
      const prediction = await fetchPredictionResult(predictionId);
      setPrediction(prediction);
    };
    if (predictionId) {
      getStoredPrediction(predictionId).then(() => {});
    }
  }, []);

  const fetchPrediction = async (predictionInput: PredictionInput) => {
    try {
      setPrediction(null);
      let prediction = await queryPrediction(predictionInput);
      setPrediction(prediction);
      window.localStorage.setItem("prediction_id", prediction.id);

      while (
        prediction.status !== "succeeded" &&
        prediction.status !== "failed"
        ) {
        await sleep(1000);
        prediction = await fetchPredictionResult(prediction.id);
        setPrediction(prediction);
      }
    } catch (e:any) {
      setError(e.message);
      setPrediction(null);
    }
  };
  return [prediction, error, fetchPrediction];
};
