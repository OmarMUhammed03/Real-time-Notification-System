import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Inbox, 
  Send, 
  File, 
  Trash2, 
  Star, 
  Plus, 
  Menu, 
  X, 
  Settings 
} from 'lucide-react';

const Sidebar = ({ isMobile = false }) => {
  const [isOpen, setIsOpen] = useState(!isMobile);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="h-full">
      {isMobile && (
        <button 
          onClick={toggleSidebar}
          className="p-2 text-gray-700 hover:text-gray-900 focus:outline-none"
          aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      )}

      <div 
        className={`
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
          ${isMobile ? 'absolute z-10 top-16 left-0 bottom-0 bg-white shadow-lg' : ''}
          transform transition-transform duration-300 ease-in-out
          w-64 h-full py-6 px-4
        `}
      >
        <div className="mb-8">
          <NavLink 
            to="/compose" 
            className={({ isActive }) => `
              flex items-center justify-center bg-blue-600 text-white rounded-full py-3 px-6 shadow-md 
              hover:bg-blue-700 hover:shadow-lg transition-all duration-300
            `}
          >
            <Plus size={20} className="mr-2" />
            <span>Compose</span>
          </NavLink>
        </div>

        <nav>
          <ul className="space-y-1">
            <li>
              <NavLink 
                to="/dashboard" 
                className={({ isActive }) => `
                  flex items-center py-2 px-4 rounded-full transition-colors duration-300
                  ${isActive ? 'bg-blue-100 text-blue-600 font-medium' : 'text-gray-700 hover:bg-gray-100'}
                `}
              >
                <Inbox size={20} className="mr-3" />
                <span>Inbox</span>
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/starred" 
                className={({ isActive }) => `
                  flex items-center py-2 px-4 rounded-full transition-colors duration-300
                  ${isActive ? 'bg-blue-100 text-blue-600 font-medium' : 'text-gray-700 hover:bg-gray-100'}
                `}
              >
                <Star size={20} className="mr-3" />
                <span>Starred</span>
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/sent" 
                className={({ isActive }) => `
                  flex items-center py-2 px-4 rounded-full transition-colors duration-300
                  ${isActive ? 'bg-blue-100 text-blue-600 font-medium' : 'text-gray-700 hover:bg-gray-100'}
                `}
              >
                <Send size={20} className="mr-3" />
                <span>Sent</span>
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;