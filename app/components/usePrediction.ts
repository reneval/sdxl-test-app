import { useEffect, useState } from "react";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const fetchPredictionResult = async (predictionId) => {
  const response = await fetch("/api/prediction/" + predictionId);
  const prediction = await response.json();

  if (response.status !== 200) {
    throw new Error(prediction.detail);
  }
  return prediction;
};

const queryPrediction = async (promptInput) => {
  const response = await fetch("/api/prediction", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(promptInput)
  });
  let prediction = await response.json();
  if (response.status !== 201) {
    throw new Error(prediction.detail);
  }
  return prediction;
};

export const usePrediction = () => {
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
      const predictionId = window.localStorage.getItem("prediction_id");
      const getStoredPrediction = async (predictionId) => {
        const prediction = await fetchPredictionResult(predictionId);
        setPrediction(prediction);
      };
      if (predictionId) {
        getStoredPrediction(predictionId).then(r => {
        });
      }
    }, []);

  const fetchPrediction = async (promptInput) => {
    try {
      setPrediction(null);
      let prediction = await queryPrediction(promptInput);
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
    } catch (e) {
      setError(e.message);
      setPrediction(null);
    }
  };
  return [prediction, error, fetchPrediction];
};
