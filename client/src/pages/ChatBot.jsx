import React, { useState } from "react";
import { GoogleGenAI } from "@google/genai"; 
import ChatHistory from "../components/ChatHistory"; 
import Loading from "../components/Loading"; 

const ChatBot = () => {
  const [userInput, setUserInput] = useState(""); 
  const [chatHistory, setChatHistory] = useState([]); 
  const [isLoading, setIsLoading] = useState(false); 


  const ai = new GoogleGenAI({ apiKey: process.env.REACT_APP_API_KEY });

  const handleUserInput = (e) => {
    setUserInput(e.target.value);
  };

  const sendMessage = async () => {
    if (userInput.trim() === "") return; // avoid empty messages
    setIsLoading(true);
    try {
      // keep context of the conversation by including the chat history in the request
      const conversationHistory = chatHistory.map((entry) => `${entry.type}: ${entry.message}`).join("\n");
      const response = await ai.models.generateContent({
        model: "gemini-1.5-flash", 
        contents: `${conversationHistory}\n user: ${userInput}`, 
      });

      const responseText = response?.text || "Sorry, I couldn't understand that.";

      setChatHistory((prevHistory) => [
        ...prevHistory,
        { type: "user", message: userInput },
        { type: "bot", message: responseText },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setUserInput(""); 
      setIsLoading(false); 
    }
  };

  const clearChat = () => {
    setChatHistory([]); 
  };

  return (
    <div className="chatbot-container">
     <p>Hey there!😊 I’m here to help you come up with fun and creative activities for your kindergarten class! What would you like assistance with today?</p>

      <div className="chatbot-box">
        <ChatHistory chatHistory={chatHistory} /> 
        <Loading isLoading={isLoading} /> {/* Show a loading msg if required */}
      </div>

      <div className="chat-input-container">
        <input
          type="text"
          className="chat-input"
          placeholder="Type your message..."
          value={userInput}
          onChange={handleUserInput} 
        />
        <button
          className="chat-send-button"
          onClick={sendMessage} 
          disabled={isLoading} // Disable the button when loading
        >
          Send
        </button>
      </div>

      <button
        className="chat-clear-button"
        onClick={clearChat} 
      >
        Clear Chat
      </button>
    </div>
  );
};

export default ChatBot;
