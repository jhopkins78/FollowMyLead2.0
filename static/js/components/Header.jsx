import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiMenu } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-blue-600">
              FollowMyLead 2.0
            </Link>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            {isHomePage && (
              <>
                <a href="#features" className="text-gray-600 hover:text-blue-600">Features</a>
                <a href="#testimonials" className="text-gray-600 hover:text-blue-600">Testimonials</a>
              </>
            )}
            
            {user ? (
              <>
                <Link to="/dashboard" className="text-gray-600 hover:text-blue-600">Dashboard</Link>
                <button
                  onClick={logout}
                  className="text-gray-600 hover:text-blue-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-blue-600">Login</Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Sign Up
                </Link>
              </>
            )}
          </nav>
          
          <button className="md:hidden text-gray-600">
            <FiMenu className="w-6 h-6" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
