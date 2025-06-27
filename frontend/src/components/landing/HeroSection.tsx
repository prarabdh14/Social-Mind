import React, { useEffect, useState } from 'react';
import { Instagram, Twitter, TrendingUp, BarChart3, PieChart } from 'lucide-react';

interface HeroSectionProps {
  scrollY: number;
}

const HeroSection: React.FC<HeroSectionProps> = ({ scrollY }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const icons = [
    { Icon: Instagram, delay: 0, color: 'text-pink-400' },
    { Icon: Twitter, delay: 200, color: 'text-blue-400' },
    { Icon: TrendingUp, delay: 400, color: 'text-green-400' },
  ];

  const chartIcons = [
    { Icon: BarChart3, delay: 600, color: 'text-[#4ECDC4]' },
    { Icon: PieChart, delay: 800, color: 'text-[#FF6B6B]' },
    { Icon: TrendingUp, delay: 1000, color: 'text-yellow-400' },
  ];

  const shouldShowCharts = scrollY > 100;

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Floating Icons */}
      <div className="absolute inset-0 pointer-events-none">
        {(shouldShowCharts ? chartIcons : icons).map(({ Icon, delay, color }, index) => (
          <div
            key={index}
            className={`absolute transition-all duration-1000 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${
              isVisible ? 'opacity-100 transform-none' : 'opacity-0 translate-y-20'
            }`}
            style={{
              left: `${20 + index * 25}%`,
              top: `${30 + Math.sin(scrollY * 0.01 + index) * 10}%`,
              transitionDelay: `${delay}ms`,
              transform: `translateY(${-scrollY * 0.5}px) rotate(${Math.sin(scrollY * 0.005 + index) * 10}deg)`,
            }}
          >
            <div className="animate-float" style={{ animationDelay: `${index * 0.5}s` }}>
              <Icon className={`w-16 h-16 ${color} drop-shadow-lg hover:scale-110 transition-transform duration-300`} />
            </div>
          </div>
        ))}
      </div>

      {/* Hero Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <h1 className={`text-5xl md:text-7xl font-bold text-white mb-6 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <span className="bg-gradient-to-r from-white via-[#4ECDC4] to-[#FF6B6B] bg-clip-text text-transparent">
            Social Media
          </span>
          <br />
          <span className="text-white">Mastery</span>
        </h1>
        
        <p className={`text-xl md:text-2xl text-white/90 mb-8 leading-relaxed transition-all duration-1000 delay-300 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          Transform your social presence with AI-powered insights,
          <br />
          seamless team collaboration, and real-time analytics.
        </p>
        
        <div className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-1000 delay-500 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <button className="px-8 py-4 bg-[#FF6B6B] hover:bg-[#FF5252] text-white rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl">
            Start Free Trial
          </button>
          <button className="px-8 py-4 bg-white/20 hover:bg-white/30 text-white rounded-full font-semibold text-lg backdrop-blur-sm transition-all duration-300 hover:scale-105">
            Watch Demo
          </button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;