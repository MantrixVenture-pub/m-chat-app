import React from "react";
import ChatPopup from "./components/ChatPopup";

const App = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <h1 className="text-3xl font-bold">Welcome to the Advanced Chat App</h1>
      <ChatPopup />
    </div>
  );
};

export default App;
