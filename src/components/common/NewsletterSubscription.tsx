import React, { useState } from 'react';

const NewsletterSubscription: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    setSubmitted(true);
    // TODO: Integrate with backend API
  };

  return (
    <section className="py-8 px-4 bg-gradient-to-r from-blue-900 to-purple-900 rounded-xl shadow-lg mb-8 max-w-2xl mx-auto">
      <h3 className="text-xl font-bold mb-2 text-white">Subscribe to our Newsletter</h3>
      <p className="text-gray-200 mb-4">Get the latest property updates, news, and exclusive offers.</p>
      {submitted ? (
        <div className="text-green-300 font-semibold">Thank you for subscribing!</div>
      ) : (
        <form className="flex flex-col sm:flex-row gap-2" onSubmit={handleSubmit}>
          <input
            type="email"
            className="flex-1 px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter your email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-semibold transition-colors"
          >
            Subscribe
          </button>
        </form>
      )}
      {error && <div className="text-red-300 mt-2">{error}</div>}
    </section>
  );
};

export default NewsletterSubscription;