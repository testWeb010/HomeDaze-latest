import React from 'react';

const CompanyInfo: React.FC = () => (
  <div className="col-span-2">
    <h4 className="text-lg font-bold mb-2">HomeDaze</h4>
    <p className="text-gray-300 mb-2">123 Dream Street, Real Estate City, 12345</p>
    <p className="text-gray-300">Email: <a href="mailto:info@homedaze.com" className="underline">info@homedaze.com</a></p>
    <p className="text-gray-300">Phone: <a href="tel:+1234567890" className="underline">+1 234 567 890</a></p>
  </div>
);

export default CompanyInfo;