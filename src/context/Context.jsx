import { createContext, useState } from "react";
import runChat from "../config/gemini";  

export const Context = createContext();

const ContextProvider = (props) => {
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [prevPrompts, setPrevPrompts] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");

  const delayPara = (index, nextWord) => {
    setTimeout(() => {
      setResultData((prev) => prev + nextWord); 
    }, 50 * index);
  };

  const newChat = () => {
    setLoading(false);
    setShowResult(false);
  }

  const onSent = async () => {
    setLoading(true);  
    setShowResult(true);  
    let prompt = input; // Use input if prompt is undefined

    setPrevPrompts(prev => [...prev, prompt]);
    setRecentPrompt(prompt);

    try {
      const response = await runChat(prompt);  
      console.log("Response:", response);

      let newResponseArray = response.split(" ");
      setResultData(""); 
      for (let i = 0; i < newResponseArray.length; i++) {
        const nextWord = newResponseArray[i];
        delayPara(i, nextWord + " ");
      }
    } catch (error) {
      console.error("Error fetching response:", error);
      setResultData("Sorry, something went wrong.");
    } finally {
      setLoading(false);  
    }

    setInput("");  
  };

  const contextValue = {
    prevPrompts,
    setPrevPrompts,
    onSent,
    setRecentPrompt,
    recentPrompt,
    showResult,
    loading,
    resultData,
    input,
    setInput,
    newChat
  };

  return (
    <Context.Provider value={contextValue}>
      {props.children}
    </Context.Provider>
  );
};

export default ContextProvider;
