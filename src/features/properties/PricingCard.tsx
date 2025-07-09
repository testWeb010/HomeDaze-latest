
import React from 'react';

interface PricingCardProps {
  price: number;
  currency: string;
  rentIncludes: string[];
}

const PricingCard: React.FC<PricingCardProps> = ({ price, rentIncludes }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Pricing</h2>
      <div className="flex items-center mb-4">
        <span className="text-3xl font-bold text-blue-600">{formatPrice(price)}</span>
        <span className="text-gray-600 ml-2">/month</span>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Rent Includes:</h3>
        <ul className="list-disc pl-5 text-gray-600">
          {rentIncludes.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PricingCard;
