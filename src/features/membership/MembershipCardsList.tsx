import React from 'react';
import MembershipCard from './MembershipCard';
import { Membership } from '../../services/membershipService';

interface MembershipCardsListProps {
  memberships: Membership[];
  selectedPlan: string;
  billingCycle: 'monthly' | 'yearly';
  onSelectPlan: (planId: string) => void;
  onUpgrade: (planId: string) => void;
  onEdit?: (membership: Membership) => void;
  onDelete?: (id: string) => void;
}

const MembershipCardsList: React.FC<MembershipCardsListProps> = ({
  memberships,
  selectedPlan,
  billingCycle,
  onSelectPlan,
  onUpgrade,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
      {memberships.map((plan) => (
        <MembershipCard
          key={plan._id}
          plan={plan}
          selectedPlan={selectedPlan}
          billingCycle={billingCycle}
          onSelectPlan={onSelectPlan}
          onUpgrade={onUpgrade}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default MembershipCardsList;