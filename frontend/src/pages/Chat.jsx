import React, { useState, useEffect } from 'react';
import './Chat.css';
import logo from '../assets/logo.png';
import axios from 'axios'; // ✅ Added axios import

const Chat = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);

  // ✅ Load messages from localStorage on first render
  useEffect(() => {
    const savedMessages = JSON.parse(localStorage.getItem('chatMessages'));
    if (savedMessages) {
      setMessages(savedMessages);
    }
  }, []);

  // ✅ Save messages to localStorage when updated
  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);

    try {
      const res = await axios.post('https://alimai.onrender.com/api/chat/ask', { question: input });

      const botMessage = { sender: 'bot', text: res.data.message };
      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      setMessages(prev => [...prev, { sender: 'bot', text: 'Error fetching response.' }]);
    }

    setInput('');
  };

  return (
    <div className="chat-container">
      <img src={logo} alt="Logo" className="chat-logo" />
      <h1 className="chat-title">﷽</h1>
      <div className="chat-box">
        <div className="chat-messages">
          {messages.map((msg, idx) => (
            <div key={idx} className={`chat-message ${msg.sender}`}>
              <strong>{msg.sender === 'user' ? 'You' : 'AalimAI'}:</strong> {msg.text}
            </div>
          ))}
        </div>
        <div className="chat-input-area">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            className="chat-input"
            placeholder="Type your Islamic question..."
          />
          <button onClick={handleSend} className="chat-button">Ask</button>
        </div>
      </div>
      {/* Added "Developed by Subhan Khan" at the bottom */}
      <div className="footer">
        Developed by Subhan Khan
      </div>
    </div>
  );
};

export default Chat;
