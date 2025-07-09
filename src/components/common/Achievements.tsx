import React from 'react';

const stats = [
  { label: 'Properties Listed', value: '2,500+' },
  { label: 'Happy Clients', value: '1,800+' },
  { label: 'Cities Covered', value: '50+' },
  { label: 'Verified Owners', value: '1,200+' },
];

const Achievements: React.FC = () => (
  <div className="flex flex-wrap justify-center gap-8 py-8">
    {stats.map((stat, idx) => (
      <div key={idx} className="text-center">
        <div className="text-2xl font-bold text-white">{stat.value}</div>
        <div className="text-gray-300">{stat.label}</div>
      </div>
    ))}
  </div>
);

export default Achievements;