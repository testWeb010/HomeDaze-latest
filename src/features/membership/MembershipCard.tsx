import React from 'react';
import { Check, Crown, Star, MessageCircle, Users, Gift, Sparkles, Edit, Trash2 } from 'lucide-react';
import { Membership } from '../../services/membershipService';

interface MembershipCardProps {
  plan: Membership;
  selectedPlan: string;
  billingCycle: 'monthly' | 'yearly';
  onSelectPlan: (planId: string) => void;
  onUpgrade: (planId: string) => void;
  onEdit?: (membership: Membership) => void;
  onDelete?: (id: string) => void;
}

const MembershipCard: React.FC<MembershipCardProps> = ({
  plan,
  selectedPlan,
  billingCycle,
  onSelectPlan,
  onUpgrade,
  onEdit,
  onDelete,
}) => {
  const getColorClasses = (color: string, variant: 'bg' | 'text' | 'border' | 'gradient') => {
    const colorMap = {
      gray: {
        bg: 'bg-gray-50',
        text: 'text-gray-600',
        border: 'border-gray-200',
        gradient: 'from-gray-500 to-gray-600'
      },
      blue: {
        bg: 'bg-blue-50',
        text: 'text-blue-600',
        border: 'border-blue-200',
        gradient: 'from-blue-500 to-blue-600'
      },
      purple: {
        bg: 'bg-purple-50',
        text: 'text-purple-600',
        border: 'border-purple-200',
        gradient: 'from-purple-500 to-purple-600'
      },
      gold: {
        bg: 'bg-yellow-50',
        text: 'text-yellow-600',
        border: 'border-yellow-200',
        gradient: 'from-yellow-500 to-orange-500'
      }
    };
    return colorMap[color as keyof typeof colorMap][variant];
  };

  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString('en-IN')}`;
  };

  return (
    <div
      key={plan._id}
      className={`relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden ${
        selectedPlan === plan._id ? 'ring-4 ring-blue-500 transform scale-105' : ''
      } ${plan.name === 'Premium' ? 'border-2 border-purple-200' : ''}`}
      onClick={() => onSelectPlan(plan._id!)}
    >
      {/* Admin Controls */}
      {(onEdit || onDelete) && (
        <div className="absolute top-4 right-4 flex space-x-2 z-10">
          {onEdit && (
            <button onClick={e => { e.stopPropagation(); onEdit(plan); }} className="p-1 bg-blue-100 hover:bg-blue-200 rounded-full">
              <Edit className="w-4 h-4 text-blue-600" />
            </button>
          )}
          {onDelete && (
            <button onClick={e => { e.stopPropagation(); onDelete(plan._id!); }} className="p-1 bg-red-100 hover:bg-red-200 rounded-full">
              <Trash2 className="w-4 h-4 text-red-600" />
            </button>
          )}
        </div>
      )}
      {/* Popular Badge */}
      {plan.name === 'Premium' && (
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full text-sm font-bold flex items-center space-x-1">
            <Star className="h-4 w-4" />
            <span>Most Popular</span>
          </div>
        </div>
      )}
      {/* Plan Header */}
      <div className={`${getColorClasses(plan.color, 'bg')} p-6 text-center`}>
        <div className={`w-16 h-16 bg-gradient-to-r ${getColorClasses(plan.color, 'gradient')} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
          {plan.name === 'Free' && <Gift className="h-8 w-8 text-white" />}
          {plan.name === 'Basic' && <Users className="h-8 w-8 text-white" />}
          {plan.name === 'Premium' && <Crown className="h-8 w-8 text-white" />}
          {plan.name === 'Pro' && <Sparkles className="h-8 w-8 text-white" />}
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
        <div className="mb-4">
          <span className="text-4xl font-bold text-gray-900">
            {formatPrice(plan.price)}
          </span>
          {plan.price > 0 && (
            <span className="text-gray-600">
              /{billingCycle === 'monthly' ? 'month' : 'year'}
            </span>
          )}
        </div>
        {plan.chatCredits === -1 ? (
          <div className="flex items-center justify-center space-x-2 text-green-600 font-medium">
            <MessageCircle className="h-5 w-5" />
            <span>Unlimited Chats</span>
          </div>
        ) : (
          <div className="flex items-center justify-center space-x-2 text-gray-600">
            <MessageCircle className="h-5 w-5" />
            <span>{plan.chatCredits} Chats</span>
          </div>
        )}
      </div>
      {/* Features List */}
      <div className="p-6">
        <ul className="space-y-4 mb-8">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start space-x-3">
              <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700 text-sm">{feature}</span>
            </li>
          ))}
        </ul>
        {/* Action Button */}
        <button
          onClick={() => onUpgrade(plan._id!)}
          className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 ${
            plan.name === 'Free'
              ? 'bg-gray-100 text-gray-600 cursor-default'
              : selectedPlan === plan._id
              ? `bg-gradient-to-r ${getColorClasses(plan.color, 'gradient')} text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1`
              : `border-2 ${getColorClasses(plan.color, 'border')} ${getColorClasses(plan.color, 'text')} hover:bg-gradient-to-r hover:${getColorClasses(plan.color, 'gradient')} hover:text-white`
          }`}
          disabled={plan.name === 'Free'}
        >
          {plan.name === 'Free' ? 'Current Plan' : 'Choose Plan'}
        </button>
      </div>
    </div>
  );
};

export default MembershipCard;