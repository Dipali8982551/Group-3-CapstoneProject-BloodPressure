// src/ChatBot.js
import React, { useState } from "react";
import { Widget } from "react-chat-widget";
import "react-chat-widget/lib/styles.css"; // Import chatbot CSS

function ChatBot() {
  const [messages, setMessages] = useState([]);

  const handleNewMessage = (message) => {
    console.log(`New message incoming! ${message}`);
    setMessages([...messages, message]);

    // Sending message to the backend (API request)
    fetch("/api/chatbot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    })
      .then((res) => res.json())
      .then((response) => {
        setMessages((prev) => [...prev, `Bot: ${response.reply}`]);
      });
  };

  return (
    <div>
      <Widget
        handleNewUserMessage={handleNewMessage}
        title="Chat with our Bot!"
        subtitle="Ask me anything"
      />
    </div>
  );
}

export default ChatBot;
