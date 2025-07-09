import React from 'react';
import { Link } from 'react-router-dom';

const FooterNavigation: React.FC = () => (
  <nav className="col-span-2">
    <h4 className="text-lg font-bold mb-2">Quick Links</h4>
    <ul className="space-y-2">
      <li><Link to="/" className="text-gray-300 hover:text-white">Home</Link></li>
      <li><Link to="/properties" className="text-gray-300 hover:text-white">Properties</Link></li>
      <li><Link to="/blog" className="text-gray-300 hover:text-white">Blog</Link></li>
      <li><Link to="/membership" className="text-gray-300 hover:text-white">Membership</Link></li>
      <li><Link to="/contact" className="text-gray-300 hover:text-white">Contact</Link></li>
    </ul>
  </nav>
);

export default FooterNavigation;