import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, AlertTriangle } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <AlertTriangle size={64} className="text-red-500" />
            <div className="absolute -right-1 -bottom-1 bg-white p-1 rounded-full">
              <Mail size={24} className="text-gray-700" />
            </div>
          </div>
        </div>
        
        <h1 className="text-4xl font-bold text-gray-900 mb-2">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <Link 
          to="/"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-colors duration-300"
        >
          <ArrowLeft size={18} className="mr-2" />
          Back to Inbox
        </Link>
      </div>
    </div>
  );
};

export default NotFound;