import React, { useEffect, useState } from 'react';
import { Users, MessageCircle, Calendar, CheckCircle } from 'lucide-react';

const TeamCollaboration: React.FC = () => {
  const [activeAvatar, setActiveAvatar] = useState(0);

  const avatars = [
    { name: 'Sarah', role: 'Content Manager', color: 'bg-pink-500', initial: 'S' },
    { name: 'Mike', role: 'Designer', color: 'bg-blue-500', initial: 'M' },
    { name: 'Lisa', role: 'Social Media Manager', color: 'bg-green-500', initial: 'L' },
    { name: 'David', role: 'Analytics Lead', color: 'bg-purple-500', initial: 'D' },
  ];

  const activities = [
    { icon: MessageCircle, text: 'Sarah commented on Instagram post', time: '2m ago' },
    { icon: Calendar, text: 'Mike scheduled TikTok content', time: '5m ago' },
    { icon: CheckCircle, text: 'Lisa approved Facebook campaign', time: '8m ago' },
    { icon: Users, text: 'David shared analytics report', time: '12m ago' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveAvatar(prev => (prev + 1) % avatars.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [avatars.length]);

  return (
    <section className="py-20 px-6 relative">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Collaborate Like Never Before
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Watch your team come together in perfect harmony with real-time collaboration tools
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Team Visualization */}
          <div className="relative">
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
              <h3 className="text-2xl font-bold text-white mb-6">Active Team Members</h3>
              
              {/* Moving Avatars */}
              <div className="relative h-64 mb-6">
                {avatars.map((avatar, index) => (
                  <div
                    key={index}
                    className={`absolute w-16 h-16 ${avatar.color} rounded-full flex items-center justify-center text-white font-bold text-lg transition-all duration-1000 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] hover:scale-110 cursor-pointer ${
                      activeAvatar === index ? 'ring-4 ring-[#4ECDC4] scale-110' : ''
                    }`}
                    style={{
                      left: `${20 + (index * 15)}%`,
                      top: `${30 + Math.sin(Date.now() * 0.001 + index) * 20}%`,
                      zIndex: activeAvatar === index ? 10 : 1,
                    }}
                  >
                    {avatar.initial}
                    {activeAvatar === index && (
                      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    )}
                  </div>
                ))}
              </div>

              {/* Active User Info */}
              <div className="text-center">
                <h4 className="text-xl font-semibold text-white">
                  {avatars[activeAvatar].name}
                </h4>
                <p className="text-[#4ECDC4]">{avatars[activeAvatar].role}</p>
              </div>
            </div>
          </div>

          {/* Activity Feed */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white mb-6">Recent Activity</h3>
            {activities.map((activity, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-102 hover:translate-x-2"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-[#FF6B6B] to-[#4ECDC4] rounded-lg flex items-center justify-center">
                    <activity.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium">{activity.text}</p>
                    <p className="text-white/60 text-sm">{activity.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamCollaboration;