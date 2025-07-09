import React from 'react';
import NewsletterSubscription from '../components/common/NewsletterSubscription';
import CompanyInfo from '../components/common/CompanyInfo';
import FooterNavigation from '../components/common/FooterNavigation';
import Achievements from '../components/common/Achievements';
import TrustBadges from '../components/common/TrustBadges';
import BottomBar from '../components/common/BottomBar';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-[10%] w-32 h-32 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-[15%] w-40 h-40 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10">
        {/* Newsletter Section */}
        <NewsletterSubscription />

        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-6 gap-12">
            {/* Company Info */}
            <CompanyInfo />

            {/* Links */}
            <FooterNavigation />
          </div>

          {/* Achievements Section */}
          <Achievements />

          {/* Trust Badges */}
          <TrustBadges />
        </div>

        {/* Bottom Section */}
        <BottomBar />
      </div>
    </footer>
  );
};

export default Footer;