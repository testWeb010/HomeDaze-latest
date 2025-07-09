import React from 'react';
import { MessageCircle, Shield, Zap } from 'lucide-react';

// Define a type for the benefits data
interface Benefit {
  icon: React.ElementType;
  title: string;
  description: string;
  gradient: string;
}

const BenefitsSection: React.FC = () => {
  // Static benefits data - this should ideally come from an API
  const benefits: Benefit[] = [
    {
      icon: MessageCircle,
      title: 'Direct Communication',
      description: 'Chat directly with property owners without any middleman interference',
      gradient: 'from-blue-500 to-purple-500',
    },
    {
      icon: Shield,
      title: 'Verified Properties',
      description: 'All properties are verified by our expert team for your safety and security',
      gradient: 'from-green-500 to-blue-500',
    },
    {
      icon: Zap,
      title: 'Instant Notifications',
      description: 'Get instant alerts when new properties matching your criteria are listed',
      gradient: 'from-orange-500 to-pink-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
      {benefits.map((benefit, index) => (
        <div key={index} className="text-center group">
          <div className={`w-16 h-16 bg-gradient-to-r ${benefit.gradient} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
            <benefit.icon className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{benefit.title}</h3>
          <p className="text-gray-600">{benefit.description}</p>
        </div>
      ))}
    </div>
  );
};

export default BenefitsSection;