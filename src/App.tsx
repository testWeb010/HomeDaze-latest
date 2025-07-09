import React from 'react';
import { Helmet } from 'react-helmet-async';
import AppRoutes from './routes';

function App() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Helmet>
        <title>HomeDaze - Find Your Dream Home</title>
        <meta name="description" content="Premium real estate platform offering verified properties and seamless rental experience." />
      </Helmet>
      <AppRoutes />
    </div>
  );
}

export default App;
