import React from 'react';
import { FiStar } from 'react-icons/fi';

const Testimonial = () => {
  return (
    <section id="testimonials" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          What Our Users Say
        </h2>
        <div className="max-w-3xl mx-auto bg-blue-50 p-8 rounded-xl">
          <div className="flex justify-center mb-4">
            {[...Array(5)].map((_, i) => (
              <FiStar key={i} className="w-6 h-6 text-yellow-400 fill-current" />
            ))}
          </div>
          <blockquote className="text-xl text-center mb-6">
            "FollowMyLead has transformed how we qualify leads. The AI-powered scoring
            system has helped us focus on high-potential opportunities and increased
            our conversion rate by 40%."
          </blockquote>
          <div className="text-center">
            <cite className="font-semibold block">Sarah Johnson</cite>
            <span className="text-gray-600">Sales Director, TechCorp</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonial;
