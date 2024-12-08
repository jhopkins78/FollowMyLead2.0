import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart2, Zap, Layers, Users, CheckCircle, Linkedin, Facebook, Mail } from 'lucide-react';

export const Features: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-blue-600">FollowMyLead</Link>
            <nav className="ml-10 hidden md:block">
              <ul className="flex space-x-4">
                <li><Link to="/features" className="text-blue-600 font-medium">Features</Link></li>
                <li><Link to="/pricing" className="text-gray-500 hover:text-blue-600">Pricing</Link></li>
                <li><Link to="/about" className="text-gray-500 hover:text-blue-600">About</Link></li>
              </ul>
            </nav>
          </div>
          <div>
            <Link to="/login">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300">
                Log In
              </button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold text-center mb-8">Powerful Features to Supercharge Your Lead Management</h1>
          <p className="text-xl text-center text-gray-600 mb-12">Discover how FollowMyLead can transform your lead qualification and scoring process</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Feature Cards */}
            <div className="bg-white rounded-lg border shadow-sm p-6">
              <div className="flex items-center mb-4">
                <BarChart2 className="h-6 w-6 mr-2 text-blue-600" />
                <h3 className="text-xl font-semibold">Automated Lead Scoring</h3>
              </div>
              <p className="text-gray-600 mb-4">Our advanced algorithm automatically scores leads based on multiple criteria, ensuring you focus on the most promising opportunities.</p>
              <ul className="list-disc list-inside text-gray-600">
                <li>Behavior-based scoring</li>
                <li>Demographic analysis</li>
                <li>Engagement tracking</li>
                <li>Custom scoring rules</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg border shadow-sm p-6">
              <div className="flex items-center mb-4">
                <Zap className="h-6 w-6 mr-2 text-blue-600" />
                <h3 className="text-xl font-semibold">Real-Time Insights</h3>
              </div>
              <p className="text-gray-600 mb-4">Get instant updates and analytics on your leads' behavior and engagement, allowing for timely and informed decision-making.</p>
              <ul className="list-disc list-inside text-gray-600">
                <li>Live activity tracking</li>
                <li>Conversion probability estimates</li>
                <li>Trend analysis</li>
                <li>Customizable dashboards</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg border shadow-sm p-6">
              <div className="flex items-center mb-4">
                <Layers className="h-6 w-6 mr-2 text-blue-600" />
                <h3 className="text-xl font-semibold">Seamless Integration</h3>
              </div>
              <p className="text-gray-600 mb-4">Easily connect FollowMyLead with your existing CRM and marketing tools for a unified lead management experience.</p>
              <ul className="list-disc list-inside text-gray-600">
                <li>CRM synchronization</li>
                <li>Marketing automation integration</li>
                <li>API access</li>
                <li>Data import/export capabilities</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg border shadow-sm p-6">
              <div className="flex items-center mb-4">
                <Users className="h-6 w-6 mr-2 text-blue-600" />
                <h3 className="text-xl font-semibold">User-Friendly Interface</h3>
              </div>
              <p className="text-gray-600 mb-4">Navigate through your lead data with ease using our intuitive and responsive interface, designed for users of all technical levels.</p>
              <ul className="list-disc list-inside text-gray-600">
                <li>Drag-and-drop functionality</li>
                <li>Customizable views</li>
                <li>Mobile-responsive design</li>
                <li>In-app tutorials and tooltips</li>
              </ul>
            </div>
          </div>

          <div className="mt-16">
            <h2 className="text-3xl font-bold text-center mb-8">Why Choose FollowMyLead?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Why Choose Us Cards */}
              <div className="bg-white rounded-lg border shadow-sm p-6">
                <div className="text-center">
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                  <h3 className="text-xl font-semibold mb-2">Increased Conversion Rates</h3>
                  <p className="text-gray-600">On average, our clients see a 35% increase in lead conversion rates within the first 3 months.</p>
                </div>
              </div>

              <div className="bg-white rounded-lg border shadow-sm p-6">
                <div className="text-center">
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                  <h3 className="text-xl font-semibold mb-2">Time Savings</h3>
                  <p className="text-gray-600">Automate up to 80% of your lead scoring process, freeing up valuable time for your sales team.</p>
                </div>
              </div>

              <div className="bg-white rounded-lg border shadow-sm p-6">
                <div className="text-center">
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                  <h3 className="text-xl font-semibold mb-2">Improved Lead Quality</h3>
                  <p className="text-gray-600">Focus on high-quality leads with our advanced scoring system, resulting in better-qualified prospects.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Lead Management?</h2>
            <p className="text-xl text-gray-600 mb-8">Start your free trial today and experience the power of FollowMyLead</p>
            <button className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 transition duration-300 text-lg">
              Start Free Trial
            </button>
          </div>
        </div>
      </main>

      <footer className="bg-white mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex justify-center space-x-6">
            <a href="#" className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">LinkedIn</span>
              <Linkedin className="h-6 w-6" />
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">Facebook</span>
              <Facebook className="h-6 w-6" />
            </a>
            <a href="mailto:contact@followmylead.com" className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">Email</span>
              <Mail className="h-6 w-6" />
            </a>
          </div>
          <p className="mt-8 text-center text-base text-gray-400">
            &copy; 2024 FollowMyLead. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Features;
