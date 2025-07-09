import React from 'react';
import MembershipCard from './MembershipCard';
// Corrected import path for Membership type
import { Membership } from '../../types';

interface MembershipCardsListProps {
  memberships: Membership[];
  selectedPlan: string;
  billingCycle: 'monthly' | 'yearly';
  // Added back onSelectPlan prop
  onSelectPlan: (planId: string) => void;
  onUpgrade: (planId: string) => void;
}

const MembershipCardsList: React.FC<MembershipCardsListProps> = ({
  memberships,
  selectedPlan,
  billingCycle,
  onSelectPlan, // Added back
  onUpgrade,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
      {memberships.map((plan) => (
        <MembershipCard
          key={plan.id}
          plan={plan}
          selectedPlan={selectedPlan}
          billingCycle={billingCycle}
          onSelectPlan={onSelectPlan} // Added back
          onUpgrade={onUpgrade}
        />
      ))}
    </div>
  );
};

export default MembershipCardsList;