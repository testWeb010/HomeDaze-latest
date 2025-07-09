import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/properties', label: 'Properties' },
  { to: '/blog', label: 'Blog' },
  { to: '/membership', label: 'Membership' },
  { to: '/contact', label: 'Contact' },
];

const Navigation: React.FC = () => {
  const location = useLocation();
  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <div className="flex items-center">
          <Link to="/" className="text-2xl font-bold text-blue-700 dark:text-blue-300">HomeDaze</Link>
        </div>
        <div className="flex space-x-6">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium ${location.pathname === link.to ? 'bg-blue-100 dark:bg-blue-900' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;