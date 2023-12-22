"use client";
import Image from "next/image";
import { usePrediction } from "./usePrediction";
import PromptInput from "@/app/components/PromptInput";

export default function Prediction() {
  const [prediction, error, fetchPrediction] = usePrediction();

  const handleSubmit = async (prompt, file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          await fetchPrediction({
            prompt,
            image: reader.result
          });
        } catch (error) {
          console.error("Error:", error);
        }
      };
      reader.readAsDataURL(file);
    } else {
      await fetchPrediction({ prompt });
    }
  };

  return (
    <div className="w-3/5 flex flex-col items-center justify-between w-full">
      {error && <div>{error}</div>}
      <div className="w-full flex flex-col items-center ">
        {prediction && (
          <div className={"min-w-96 relative aspect-square bg-gray-500 flex flex-col flex- items-end"}>
            {prediction.output && (
              <Image
                fill
                src={prediction.output[prediction.output.length - 1]}
                alt="output"
                sizes="100vw"
              />
            )}
            {["processing", "starting"].includes(prediction.status) &&
              <div role="status"
                   className="absolute flex items-center justify-center h-full w-full bg-gray-300 rounded-lg animate-pulse dark:bg-gray-700">
                <svg className="w-10 h-10 text-gray-200 dark:text-gray-600" aria-hidden="true"
                     xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 20">
                  <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z" />
                  <path
                    d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM9 13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2Zm4 .382a1 1 0 0 1-1.447.894L10 13v-2l1.553-1.276a1 1 0 0 1 1.447.894v2.764Z" />
                </svg>
              </div>
            }
          </div>
        )}
      </div>
      <PromptInput onSubmit={handleSubmit} />
    </div>
  );
}
