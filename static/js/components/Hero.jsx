import React from 'react';

const Hero = () => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Transform Your Lead Management with AI-Powered Insights
          </h1>
          <p className="text-xl mb-8">
            Rank, analyze, and prioritize your leads with intelligent scoring to focus on what matters most.
          </p>
          <div className="space-x-4">
            <a
              href="/register"
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50"
            >
              Get Started Free
            </a>
            <a
              href="#features"
              className="border border-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
            >
              Learn More
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
