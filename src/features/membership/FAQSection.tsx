import React from 'react';

// Define a type for FAQ data
interface FAQItem {
  question: string;
  answer: string;
}

const FAQSection: React.FC = () => {
  // Static FAQ data - this should ideally come from an API
  const faqs: FAQItem[] = [
    {
      question: 'What happens to unused chat credits?',
      answer: 'Unused chat credits expire at the end of your billing cycle. We recommend using them within the month to get maximum value.',
    },
    {
      question: 'Can I upgrade or downgrade my plan?',
      answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.',
    },
    {
      question: 'Is there a refund policy?',
      answer: 'We offer a 7-day money-back guarantee if you\'re not satisfied with our premium features.',
    },
    {
      question: 'How does the verification badge work?',
      answer: 'Verification badges help property owners identify serious tenants, increasing your chances of getting responses.',
    },
  ];

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-8">
      <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
        Frequently Asked Questions
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {faqs.map((faq, index) => (
          <div key={index}>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {faq.question}
            </h3>
            <p className="text-gray-600">
              {faq.answer}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQSection;