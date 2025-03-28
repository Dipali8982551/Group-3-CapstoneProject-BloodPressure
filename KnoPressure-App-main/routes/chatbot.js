import React, { useState } from "react";
import { Widget } from "react-chat-widget";
import "react-chat-widget/lib/styles.css"; // Import chatbot CSS

function ChatBot() {
  const [messages, setMessages] = useState([]);

  const handleNewMessage = (message) => {
    console.log(`New message incoming! ${message}`);

    // Send user message to backend (API request)
    fetch("/api/chatbot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    })
      .then((res) => res.json())
      .then((response) => {
        // Add the bot's reply to the message state
        setMessages((prevMessages) => [
          ...prevMessages,
          { user: "User", message },
          { user: "Bot", message: response.reply },
        ]);
      })
      .catch((error) => {
        console.error("Error while sending message to backend:", error);
        setMessages((prevMessages) => [
          ...prevMessages,
          { user: "Bot", message: "Sorry, I couldn't understand that." },
        ]);
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
