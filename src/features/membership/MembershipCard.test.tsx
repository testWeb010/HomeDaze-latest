import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import MembershipCard from './MembershipCard';

const plan = {
  _id: 'plan1',
  name: 'Basic',
  price: 299,
  features: ['Feature 1', 'Feature 2'],
  color: 'blue',
  chatCredits: 10,
};

describe('MembershipCard', () => {
  it('shows Buy/Upgrade for user', () => {
    const onUpgrade = vi.fn();
    render(
      <MembershipCard
        plan={plan}
        selectedPlan=""
        billingCycle="monthly"
        onSelectPlan={() => {}}
        onUpgrade={onUpgrade}
        isAdmin={false}
        isCurrent={false}
      />
    );
    expect(screen.getByText('Buy/Upgrade')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Buy/Upgrade'));
    expect(onUpgrade).toHaveBeenCalled();
  });

  it('does not show Buy/Upgrade for admin', () => {
    render(
      <MembershipCard
        plan={plan}
        selectedPlan=""
        billingCycle="monthly"
        onSelectPlan={() => {}}
        onUpgrade={() => {}}
        isAdmin={true}
        isCurrent={false}
      />
    );
    expect(screen.queryByText('Buy/Upgrade')).not.toBeInTheDocument();
  });

  it('disables button for current plan', () => {
    render(
      <MembershipCard
        plan={plan}
        selectedPlan=""
        billingCycle="monthly"
        onSelectPlan={() => {}}
        onUpgrade={() => {}}
        isAdmin={false}
        isCurrent={true}
      />
    );
    const btn = screen.getByText('Current Plan');
    expect(btn).toBeDisabled();
  });
});