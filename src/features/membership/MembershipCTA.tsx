import React from 'react';
import { ArrowRight } from 'lucide-react';

const MembershipCTA: React.FC = () => {
  return (
    <div className="text-center mt-16">
      <h2 className="text-3xl font-bold text-gray-900 mb-4">
        Ready to Find Your Perfect Home?
      </h2>
      <p className="text-xl text-gray-600 mb-8">
        Join thousands of students who found their ideal accommodation with HomeDaze
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center space-x-2">
          <span>Start Free Trial</span>
          <ArrowRight className="h-5 w-5" />
        </button>
        <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl hover:border-blue-500 hover:text-blue-600 transition-all duration-200 font-semibold text-lg">
          Contact Sales
        </button>
      </div>
    </div>
  );
};

export default MembershipCTA;