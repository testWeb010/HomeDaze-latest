import React from 'react';
import { Link } from 'react-router-dom';

const BottomBar: React.FC = () => (
  <div className="border-t border-gray-700 py-4 text-center text-gray-400 text-sm">
    &copy; {new Date().getFullYear()} HomeDaze. All rights reserved. |
    <Link to="/privacy" className="ml-2 hover:text-white">Privacy Policy</Link>
  </div>
);

export default BottomBar;