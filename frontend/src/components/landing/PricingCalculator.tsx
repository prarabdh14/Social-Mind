import React, { useState, useEffect } from 'react';
import { Check, Sparkles, Zap, Crown } from 'lucide-react';

const PricingCalculator: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState('pro');
  const [teamSize, setTeamSize] = useState(5);
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = {
    starter: {
      name: 'Starter',
      icon: Sparkles,
      basePrice: 29,
      color: 'from-blue-500 to-cyan-500',
      features: ['5 Social Accounts', 'Basic Analytics', '100 Scheduled Posts', 'Email Support']
    },
    pro: {
      name: 'Professional',
      icon: Zap,
      basePrice: 79,
      color: 'from-purple-500 to-pink-500',
      features: ['25 Social Accounts', 'Advanced Analytics', 'Unlimited Posts', 'AI Content Suggestions', 'Team Collaboration', 'Priority Support']
    },
    enterprise: {
      name: 'Enterprise',
      icon: Crown,
      basePrice: 199,
      color: 'from-orange-500 to-red-500',
      features: ['Unlimited Accounts', 'Custom Analytics', 'White-label Solution', 'Dedicated Account Manager', 'API Access', '24/7 Phone Support']
    }
  };

  const calculatePrice = (planKey: string) => {
    const plan = plans[planKey as keyof typeof plans];
    let price = plan.basePrice;
    
    if (planKey === 'pro' && teamSize > 3) {
      price += (teamSize - 3) * 15;
    } else if (planKey === 'enterprise' && teamSize > 5) {
      price += (teamSize - 5) * 25;
    }
    
    return isAnnual ? Math.round(price * 10) : price;
  };

  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Pricing That Scales With You
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto mb-8">
            Interactive pricing calculator - see exactly what you'll pay
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <span className={`font-medium ${!isAnnual ? 'text-white' : 'text-white/60'}`}>Monthly</span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className={`relative w-14 h-8 rounded-full transition-colors duration-300 ${
                isAnnual ? 'bg-[#4ECDC4]' : 'bg-white/20'
              }`}
            >
              <div className={`absolute w-6 h-6 bg-white rounded-full top-1 transition-transform duration-300 ${
                isAnnual ? 'translate-x-7' : 'translate-x-1'
              }`}></div>
            </button>
            <span className={`font-medium ${isAnnual ? 'text-white' : 'text-white/60'}`}>
              Annual <span className="text-[#4ECDC4]">(Save 20%)</span>
            </span>
          </div>

          {/* Team Size Slider */}
          <div className="max-w-md mx-auto mb-12">
            <label className="block text-white font-medium mb-4">
              Team Size: <span className="text-[#4ECDC4]">{teamSize} members</span>
            </label>
            <input
              type="range"
              min="1"
              max="50"
              value={teamSize}
              onChange={(e) => setTeamSize(parseInt(e.target.value))}
              className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {Object.entries(plans).map(([key, plan]) => {
            const isSelected = selectedPlan === key;
            const price = calculatePrice(key);
            
            return (
              <div
                key={key}
                onClick={() => setSelectedPlan(key)}
                className={`relative cursor-pointer transition-all duration-500 hover:scale-105 ${
                  isSelected ? 'scale-105' : ''
                }`}
              >
                <div className={`bg-white/10 backdrop-blur-sm rounded-2xl p-8 border-2 transition-all duration-300 ${
                  isSelected ? 'border-[#4ECDC4] bg-white/20' : 'border-white/20 hover:border-white/40'
                }`}>
                  {isSelected && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1 bg-[#4ECDC4] text-white text-sm font-semibold rounded-full">
                      Selected
                    </div>
                  )}
                  
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${plan.color} flex items-center justify-center mb-6 hover:rotate-12 transition-transform duration-300`}>
                    <plan.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-white">${price}</span>
                    <span className="text-white/60">/{isAnnual ? 'year' : 'month'}</span>
                  </div>
                  
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-white/80">
                        <Check className="w-5 h-5 text-[#4ECDC4] mr-3 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <button className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${
                    isSelected
                      ? 'bg-[#4ECDC4] text-white hover:bg-[#45B7B8]'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}>
                    Get Started
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PricingCalculator;