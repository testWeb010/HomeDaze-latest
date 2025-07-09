import React from 'react';

const badges = [
  { icon: (
      <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
    ), label: 'Verified Listings' },
  { icon: (
      <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path strokeLinecap="round" strokeLinejoin="round" d="M8 12l2 2 4-4" /></svg>
    ), label: 'Secure Platform' },
  { icon: (
      <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" /></svg>
    ), label: '24/7 Support' },
];

const TrustBadges: React.FC = () => (
  <div className="flex justify-center gap-8 py-4">
    {badges.map((badge, idx) => (
      <div key={idx} className="flex flex-col items-center">
        {badge.icon}
        <span className="text-gray-300 text-sm mt-2">{badge.label}</span>
      </div>
    ))}
  </div>
);

export default TrustBadges;