import React from 'react';
import { Crown } from 'lucide-react';

interface MembershipHeroProps {
  billingCycle: 'monthly' | 'yearly';
  setBillingCycle: (cycle: 'monthly' | 'yearly') => void;
}

const MembershipHero: React.FC<MembershipHeroProps> = ({ billingCycle, setBillingCycle }) => {
  return (
    <div className="bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-500 rounded-full opacity-10 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-purple-500 rounded-full opacity-10 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-yellow-500 rounded-full opacity-10 animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Crown className="h-4 w-4 text-yellow-400" />
            <span>Membership Plans</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Unlock Premium
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-400">
              Student Benefits
            </span>
          </h1>

          <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
            Choose the perfect plan to enhance your property search experience with unlimited chats, priority support, and exclusive features
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <span className={`text-lg font-medium ${billingCycle === 'monthly' ? 'text-white' : 'text-blue-300'}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors ${
                billingCycle === 'yearly' ? 'bg-green-500' : 'bg-white/20'
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                  billingCycle === 'yearly' ? 'translate-x-9' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-lg font-medium ${billingCycle === 'yearly' ? 'text-white' : 'text-blue-300'}`}>
              Yearly
            </span>
            {billingCycle === 'yearly' && (
              <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                Save 17%
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MembershipHero;