import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginModal from '../shared/LoginModal';
import HeroSection from './HeroSection';
import ValueProposition from './ValueProposition';
import TeamCollaboration from './TeamCollaboration';
import PricingCalculator from './PricingCalculator';
import { useTheme } from '../../contexts/ThemeContext';
import { Moon, Sun } from 'lucide-react';

const LandingPage: React.FC = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`min-h-screen transition-colors duration-500 ${
      isDark ? 'bg-gray-900' : 'bg-gradient-to-br from-[#2A2A72] via-purple-800 to-[#4ECDC4]'
    }`}>
      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="fixed top-6 right-6 z-40 p-3 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 hover:scale-110"
      >
        {isDark ? (
          <Sun className="w-6 h-6 text-yellow-400" />
        ) : (
          <Moon className="w-6 h-6 text-white" />
        )}
      </button>

      {/* Auth Buttons */}
      <div className="fixed top-6 left-6 z-40 flex items-center space-x-4">
        <button
          onClick={() => setShowLoginModal(true)}
          className="px-6 py-3 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white rounded-full font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg"
        >
          Login
        </button>
        <button
          onClick={() => setShowRegisterModal(true)}
          className="px-6 py-3 bg-[#FF6B6B] hover:bg-[#FF5252] text-white rounded-full font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg"
        >
          Register
        </button>
      </div>

      <HeroSection scrollY={scrollY} />
      <ValueProposition />
      <TeamCollaboration />
      <PricingCalculator />

      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          initialMode="login"
        />
      )}

      {showRegisterModal && (
        <LoginModal
          onClose={() => setShowRegisterModal(false)}
          initialMode="register"
        />
      )}
    </div>
  );
};

export default LandingPage;