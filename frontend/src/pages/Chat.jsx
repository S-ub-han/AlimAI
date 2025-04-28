import React, { useState, useEffect, useRef } from 'react';
import './Chat.css';
import axios from 'axios';

const Chat = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const savedMessages = JSON.parse(localStorage.getItem('chatMessages'));
    if (savedMessages) {
      setMessages(savedMessages);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async () => {
  if (!input.trim()) return;

  const userMessage = { sender: 'user', text: input };
  setMessages(prev => [...prev, userMessage]);

  try {
    const res = await axios.post('https://alimai.onrender.com/api/chat/ask', { question: input });
    const botMessage = { sender: 'bot', text: res.data.answer }; // <-- YAHAN .answer
    setMessages(prev => [...prev, botMessage]);
  } catch (err) {
    setMessages(prev => [...prev, { sender: 'bot', text: 'Error fetching response.' }]);
  }

  setInput('');
};

   
  

  return (
    <div className="chat-container">
      <div className="chat-header">
        {/* Logo removed */}
        <h1 className="chat-title">﷽</h1>
      </div>

      <div className="chat-messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.sender}`}>
            <div className="message-content">{msg.text}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-area">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          className="chat-input"
          placeholder="Type your Islamic question..."
          onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
        />
        <button onClick={handleSend} className="chat-button">Ask</button>
      </div>

      

      <div className="footer-disclaimer">
      AalimAI assists with Islamic queries; for fatwa-related questions, kindly consult a qualified Mufti.
      </div>
    </div>
  );
};

export default Chat;
