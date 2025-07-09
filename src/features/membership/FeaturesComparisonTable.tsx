import React from 'react';
import { Membership } from '../../types';

interface FeaturesComparisonTableProps {
  memberships: Membership[];
}

const FeaturesComparisonTable: React.FC<FeaturesComparisonTableProps> = ({
  memberships,
}) => {
  // Static feature data - this should ideally come from an API
  const featuresData = [
    { feature: 'Chat Credits', values: ['6', '50', 'Unlimited', 'Unlimited'] },
    { feature: 'Property Search', values: ['Basic', 'Advanced', 'Premium', 'Premium'] },
    { feature: 'Contact Details', values: ['Limited', 'Full Access', 'Instant Access', 'Instant Access'] },
    { feature: 'Support', values: ['Email', 'Priority Email', 'Phone & Chat', '24/7 Dedicated'] },
    { feature: 'Verification Badge', values: ['❌', 'Basic', 'Verified', 'Premium'] },
    { feature: 'Profile Boost', values: ['❌', '❌', '✅', '✅'] },
    { feature: 'Property Alerts', values: ['❌', 'Basic', 'Instant', 'Instant'] },
    { feature: 'Relationship Manager', values: ['❌', '❌', '❌', '✅'] },
  ];

  return (
    <div className="bg-white rounded-3xl shadow-lg p-8 mb-16">
      <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
        Compare All Features
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-4 px-6 font-semibold text-gray-900">Features</th>
              {memberships.map((plan) => (
                <th key={plan.id} className="text-center py-4 px-6 font-semibold text-gray-900">
                  {plan.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {featuresData.map((row, index) => (
              <tr key={index} className="border-b border-gray-100">
                <td className="py-4 px-6 font-medium text-gray-900">{row.feature}</td>
                {row.values.map((value, valueIndex) => (
                  <td key={valueIndex} className="py-4 px-6 text-center text-gray-700">
                    {value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FeaturesComparisonTable;