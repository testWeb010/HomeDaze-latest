import React, { useState, useEffect } from 'react';
// Import lucide-react icons if needed by individual components
// import { ArrowRight } from 'lucide-react';

// Import Membership type
import { Membership } from '../types';

// Import the new components
import MembershipHero from '../features/membership/MembershipHero';
import MembershipCardsList from '../features/membership/MembershipCardsList';
import FeaturesComparisonTable from '../features/membership/FeaturesComparisonTable';
import BenefitsSection from '../features/membership/BenefitsSection';
import FAQSection from '../features/membership/FAQSection';
import MembershipCTA from '../features/membership/MembershipCTA';

const MembershipPage: React.FC = () => {
  // selectedPlan state is kept to highlight the selected card, even if not used for filtering here
  const [selectedPlan, setSelectedPlan] = useState<string>('basic');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Effect hook to fetch membership data from an API
  useEffect(() => {
    const fetchMemberships = async () => {
      try {
        // Replace with your actual API endpoint to fetch membership plans
        // Example: const response = await fetch('/api/memberships?cycle=${billingCycle}');
        // if (!response.ok) {
        //   throw new Error(`HTTP error! status: ${response.status}`);
        // }
        // const data = await response.json();

        // Placeholder static data - remove this when integrating API
        // This static data needs to simulate the API response based on billingCycle
        const staticMemberships: Membership[] = [
          {
            id: 'free',
            name: 'Free',
            price: 0,
            duration: 30,
            features: [
              '6 free chats with property owners',
              'Basic property search',
              'View contact details (limited)',
              'Email support',
              'Basic property filters'
            ],
            chatCredits: 6,
            priority: false,
            verificationSupport: false,
            color: 'gray'
          },
          {
            id: 'basic',
            name: 'Basic',
            price: billingCycle === 'monthly' ? 299 : 2999,
            duration: billingCycle === 'monthly' ? 30 : 365,
            features: [
              '50 chats with property owners',
              'Advanced property search',
              'Full contact details access',
              'Priority email support',
              'Advanced filters & sorting',
              'Save favorite properties',
              'Property alerts',
              'Basic verification badge'
            ],
            chatCredits: 50,
            priority: true,
            verificationSupport: false,
            color: 'blue'
          },
          {
            id: 'premium',
            name: 'Premium',
            price: billingCycle === 'monthly' ? 599 : 5999,
            duration: billingCycle === 'monthly' ? 30 : 365,
            features: [
              'Unlimited chats with property owners',
              'Premium property search',
              'Instant contact details access',
              'Priority phone & chat support',
              'All premium filters',
              'Unlimited favorites',
              'Instant property alerts',
              'Verified student badge',
              'Profile boost',
              'Early access to new properties'
            ],
            chatCredits: -1, // Unlimited
            priority: true,
            verificationSupport: true,
            color: 'purple'
          },
          {
            id: 'pro',
            name: 'Pro',
            price: billingCycle === 'monthly' ? 999 : 9999,
            duration: billingCycle === 'monthly' ? 30 : 365,
            features: [
              'Everything in Premium',
              'Dedicated relationship manager',
              '24/7 priority support',
              'Property visit assistance',
              'Negotiation support',
              'Legal document review',
              'Exclusive property access',
              'Premium verified badge',
              'Featured profile',
              'Custom property requirements'
            ],
            chatCredits: -1, // Unlimited
            priority: true,
            verificationSupport: true,
            color: 'gold'
          }
        ];

        // Simulate network delay
        setTimeout(() => {
           setMemberships(staticMemberships); // Use data from API here
           setLoading(false);
        }, 500); // 500ms delay

      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchMemberships();
  }, [billingCycle]); // Refetch when billing cycle changes


  const handleUpgrade = (planId: string) => {
    console.log('Upgrading to plan:', planId);
    // Integrate with payment API endpoint
    // Example: call a function to initiate payment with planId
    // After successful upgrade, you might want to update the selected plan
    // setSelectedPlan(planId);
  };

  // Remove helper functions that are now in MembershipCard or no longer needed here
  // const getColorClasses = ...
  // const formatPrice = ...
  // const calculateSavings = ...

  if (loading) {
    return <div className="text-center py-20">Loading membership plans...</div>;
  }

  if (error) {
    return <div className="text-center py-20 text-red-600">Error loading plans: {error}</div>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Hero Section - handles billing cycle toggle internally */}
      <MembershipHero billingCycle={billingCycle} setBillingCycle={setBillingCycle} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Membership Cards List - pass necessary props and data fetched from API */}
        {/* Passing setSelectedPlan down to MembershipCard if needed for styling selected card */}
        <MembershipCardsList
          memberships={memberships}
          selectedPlan={selectedPlan} // Keep selectedPlan if cards need to highlight the current selection
          billingCycle={billingCycle}
          onSelectPlan={setSelectedPlan} // Pass the setSelectedPlan to handle card selection
          onUpgrade={handleUpgrade}
        />

        {/* Features Comparison Table - pass necessary data fetched from API */}
        {/* Features data can be fetched separately or included in memberships data */}
        <FeaturesComparisonTable memberships={memberships} />

        {/* Benefits Section - data can be fetched from API or remain static if not dynamic */}
        <BenefitsSection />

        {/* FAQ Section - data can be fetched from API or remain static if not dynamic */}
        <FAQSection />

        {/* CTA Section */}
        <MembershipCTA />
      </div>
    </div>
  );
};

export default MembershipPage;