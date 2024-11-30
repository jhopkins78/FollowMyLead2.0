import React from 'react';
import { FiBarChart2, FiTarget, FiUsers } from 'react-icons/fi';

const Features = () => {
  const features = [
    {
      icon: <FiBarChart2 className="w-8 h-8 text-blue-600" />,
      title: 'Smart Lead Scoring',
      description: 'AI-powered algorithms rank leads based on multiple data points for accurate qualification.'
    },
    {
      icon: <FiTarget className="w-8 h-8 text-blue-600" />,
      title: 'Intelligent Insights',
      description: 'Get actionable insights and recommendations to optimize your lead conversion strategy.'
    },
    {
      icon: <FiUsers className="w-8 h-8 text-blue-600" />,
      title: 'Team Collaboration',
      description: 'Work together seamlessly with shared dashboards and real-time updates.'
    }
  ];

  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          Features that Drive Results
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
