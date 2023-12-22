import React, { useState } from "react";
import { useDropzone } from "react-dropzone";

export default function PromptInput({ onSubmit, onSubmitFile }) {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [prompt, setPrompt] = useState("");
  const { getRootProps, getInputProps, open } = useDropzone({
    accept: {
      "image/*": [".jpeg", ".png"]
    },
    maxFiles: 1,
    noClick: true,
    onDrop: (acceptedFiles) => {
      setUploadedFiles(acceptedFiles);
    }
  });

  const removeFile = () => setUploadedFiles([]);

  const onSubmitClick = () => {
    onSubmit(prompt, uploadedFiles[0]);
  };

  return (
    <div className="w-full">
      <form {...getRootProps()} onSubmit={onSubmit}>
        <input name="file" {...getInputProps()} />
        <label htmlFor="message"
               className="block mb-2 text-sm font-medium text-gray-900 dark:text-white w-full">Prompt</label>
        <textarea id="message"
                  onChange={(e) => setPrompt(e.target.value)}
                  name="prompt"
                  className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Write your prompt here or drop a file...">
        </textarea>
        <ul>
          {uploadedFiles.map((file) => (
            <li className="flex justify-center align-center gap-2" key={file.name}>{file.name}
              <span onClick={removeFile} className="text-red-600 font-bold p-0 cursor-pointer">X</span>
            </li>
          ))}
        </ul>
        <div className="flex justify-between">
          <button
            type="button" onClick={onSubmitClick}
            className="bg-blue-500 hover:bg-blue-700 text-white px-4 m-2 rounded">
            Submit
          </button>
          <button type="button" onClick={open} className="border-none">Select file...</button>
        </div>
      </form>
    </div>
  );
}
