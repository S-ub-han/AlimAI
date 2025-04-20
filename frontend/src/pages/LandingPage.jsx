import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/landing.css';
import backgroundImage from '../assets/background.jpg';
import logoImage from '../assets/logo.png';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div
      className="landing-container"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="overlay">
        <img src={logoImage} alt="AalimAI Logo" className="logo" />
        <h1 className="landing-title">Welcome to AalimAI</h1>
        <p className="landing-subtitle">
          Your AI Islamic Guide for Authentic Answers with Hadith References
        </p>
        <button className="enter-button" onClick={() => navigate('/chat')}>
          Enter
        </button>
      </div>
      {/* Added "Developed by Subhan Khan" at the bottom */}
      <div className="footer">
        Developed by Subhan Khan
      </div>
    </div>
  );
};

export default LandingPage;

