type Prediction = {
  status:string,
  output: string[]
}
type PromptInput = {
  prompt?: string,
  file?: File[],
}

type PredictionInput = {
  prompt?: string,
  file?: string,
}

