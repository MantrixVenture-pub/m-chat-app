// src/components/ChatPopup.tsx
import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { motion } from "framer-motion";
import { FaTimes, FaPaperPlane, FaComments } from "react-icons/fa";

// Socket.io connection
const socket = io("http://localhost:4000"); // Your backend URL

const ChatPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef < HTMLDivElement > null;

  // Fetch messages from localStorage when the app loads
  useEffect(() => {
    const savedMessages = localStorage.getItem("chatMessages");
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  }, []);

  // Scroll to the latest message when messages are updated
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    localStorage.setItem("chatMessages", JSON.stringify(messages)); // Save to localStorage
  }, [messages]);

  // Handle receiving messages from the server
  useEffect(() => {
    socket.on("message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off("message");
    };
  }, []);

  const toggleChat = () => setIsOpen(!isOpen);

  const sendMessage = () => {
    if (input.trim()) {
      socket.emit("message", input);
      setMessages([...messages, input]);
      setInput("");
    }
  };

  return (
    <div className="fixed bottom-4 right-4">
      {/* Floating Button */}
      {!isOpen && (
        <motion.button
          className="bg-blue-500 text-white p-4 rounded-full shadow-lg"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleChat}
        >
          <FaComments size={24} />
        </motion.button>
      )}

      {/* Chat Popup */}
      {isOpen && (
        <motion.div
          className="w-80 h-96 bg-white shadow-lg rounded-lg border border-gray-200 overflow-hidden"
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ type: "spring", stiffness: 150, damping: 20 }}
        >
          {/* Header */}
          <div className="flex justify-between items-center bg-blue-500 text-white p-2">
            <span className="font-semibold">Chat</span>
            <button onClick={toggleChat}>
              <FaTimes size={18} />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-2 overflow-y-auto">
            {messages.map((msg, index) => (
              <div key={index} className="p-2 mb-2 bg-gray-200 rounded-md">
                {msg}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Field */}
          <div className="p-2 border-t border-gray-300">
            <div className="flex">
              <input
                type="text"
                className="flex-1 p-2 border border-gray-300 rounded-l-lg focus:outline-none"
                placeholder="Type a message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              />
              <button
                className="bg-blue-500 text-white p-2 rounded-r-lg"
                onClick={sendMessage}
              >
                <FaPaperPlane />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ChatPopup;
