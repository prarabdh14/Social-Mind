import React, { useEffect, useRef, useState } from 'react';
import { Zap, Users, BarChart, Sparkles } from 'lucide-react';

const ValueProposition: React.FC = () => {
  const [visibleItems, setVisibleItems] = useState<number[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);

  const timeline = [
    {
      icon: Sparkles,
      title: "AI-Powered Content Creation",
      description: "Generate engaging posts with intelligent suggestions and optimal timing recommendations.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Users,
      title: "Seamless Team Collaboration",
      description: "Work together effortlessly with role-based permissions and real-time editing.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: BarChart,
      title: "Advanced Analytics",
      description: "Track performance across all platforms with detailed insights and growth metrics.",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Zap,
      title: "Lightning-Fast Publishing",
      description: "Schedule and publish content across multiple platforms with one click.",
      color: "from-orange-500 to-red-500"
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-index') || '0');
            setVisibleItems(prev => [...prev, index]);
          }
        });
      },
      { threshold: 0.3 }
    );

    const items = sectionRef.current?.querySelectorAll('[data-index]');
    items?.forEach(item => observer.observe(item));

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Why Choose <span className="text-[#4ECDC4]">SocialPulse</span>?
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Experience the future of social media management with our cutting-edge platform
          </p>
        </div>

        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-[#4ECDC4] to-[#FF6B6B] rounded-full"></div>

          {timeline.map((item, index) => {
            const isVisible = visibleItems.includes(index);
            const isEven = index % 2 === 0;

            return (
              <div
                key={index}
                data-index={index}
                className={`relative flex items-center mb-16 ${isEven ? 'flex-row' : 'flex-row-reverse'}`}
              >
                {/* Content Card */}
                <div className={`w-5/12 transition-all duration-1000 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${
                  isVisible 
                    ? 'opacity-100 translate-x-0' 
                    : `opacity-0 ${isEven ? '-translate-x-20' : 'translate-x-20'}`
                }`}>
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:-rotate-1">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${item.color} flex items-center justify-center mb-6 hover:rotate-12 transition-transform duration-300`}>
                      <item.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">{item.title}</h3>
                    <p className="text-white/80 leading-relaxed">{item.description}</p>
                  </div>
                </div>

                {/* Timeline Node */}
                <div className={`absolute left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full bg-gradient-to-r ${item.color} transition-all duration-500 ${
                  isVisible ? 'scale-100' : 'scale-0'
                } border-4 border-white/20`} style={{ transitionDelay: `${index * 200}ms` }}>
                </div>

                {/* Spacer */}
                <div className="w-5/12"></div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ValueProposition;