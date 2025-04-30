import './index.css';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import ToggleButton from './components/ToggleButton';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

function LoginPage() {
  const [isFlipped, setIsFlipped] = useState(false);
  const [currentComponent, setCurrentComponent] = useState('login');
  const [isAnimating, setIsAnimating] = useState(false);

  // Prevent scroll during animation
  useEffect(() => {
    if (isAnimating) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isAnimating]);

  const handleFlip = () => {
    setIsAnimating(true);
    const newFlipState = !isFlipped;
    setIsFlipped(newFlipState);
    setCurrentComponent(newFlipState ? 'signup' : 'login');
    // Reset animation flag after transition completes
    setTimeout(() => setIsAnimating(false), 600);
  };

  const handleSignup = () => {
    setIsAnimating(true);
    setIsFlipped(true);
    setCurrentComponent('signup');
    setTimeout(() => setIsAnimating(false), 600);
  };

  const handleForgotPassword = () => {
    setCurrentComponent('forgot');
  };

  const handleBackToLogin = () => {
    setIsAnimating(true);
    setCurrentComponent('login');
    setIsFlipped(false);
    setTimeout(() => setIsAnimating(false), 600);
  };

  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center p-4">
      <div className="absolute top-6 m-auto">
        <ToggleButton
          isChecked={isFlipped}
          onChange={handleFlip}
        />
      </div>
      <div className="relative w-[400px] perspective-1000">
        {currentComponent === 'forgot' ? (
          <div className="w-full">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <ForgotPassword onBackToLogin={handleBackToLogin} />
            </div>
          </div>
        ) : (
          <div
            className={`w-full transform-style-3d transition-transform duration-500 ${isFlipped ? 'rotate-y-180' : ''}`}
            style={{transformStyle: 'preserve-3d'}}
          >
            {/* Login side */}
            <div className="w-full backface-hidden" style={{backfaceVisibility: 'hidden'}}>
              <div className="bg-white rounded-xl shadow-lg p-8">
                <Login
                  onForgotPassword={handleForgotPassword}
                  switchPage={handleSignup}
                />
              </div>
            </div>
            
            {/* Signup side */}
            <div 
              className="absolute top-0 left-0 w-full backface-hidden rotate-y-180" 
              style={{backfaceVisibility: 'hidden', transform: 'rotateY(180deg)'}}
            >
              <div className="bg-white rounded-xl shadow-lg p-8">
                <Signup switchPage={handleBackToLogin} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ToastContainer position="top-center" autoClose={3000} />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />
        <Route path="/reset-password/:id/:token" element={<ResetPassword />} />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
