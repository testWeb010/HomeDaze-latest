import React from 'react';
import { Helmet } from 'react-helmet-async';
import AppRoutes from './routes';

function App() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Helmet>
        <title>HomeDaze - Find Your Dream Home</title>
        <meta name="description" content="Premium real estate platform offering verified properties and seamless rental experience." />
        <link rel="canonical" href="https://thehomedaze.com/" />
        {/* Open Graph */}
        <meta property="og:title" content="HomeDaze - Find Your Dream Home" />
        <meta property="og:description" content="Premium real estate platform offering verified properties and seamless rental experience." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://thehomedaze.com/" />
        <meta property="og:image" content="https://thehomedaze.com/og-image.jpg" />
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="HomeDaze - Find Your Dream Home" />
        <meta name="twitter:description" content="Premium real estate platform offering verified properties and seamless rental experience." />
        <meta name="twitter:image" content="https://thehomedaze.com/og-image.jpg" />
      </Helmet>
      <AppRoutes />
    </div>
  );
}

export default App;
