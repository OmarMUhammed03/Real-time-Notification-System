import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, Menu, Bell, HelpCircle, Settings, User } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

const Header = ({ search, onSearch, unreadCount }) => {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();

  const handleSearchChange = (e) => {
    onSearch && onSearch(e.target.value);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="flex items-center justify-between h-16 px-4 md:px-6">
        <div className="flex items-center">
          <button className="md:hidden p-2 mr-2 text-gray-700 hover:text-gray-900 focus:outline-none">
            <Menu size={24} />
          </button>

          <Link to="/" className="flex items-center">
            <div className="w-8 h-8 mr-2 bg-red-500 text-white rounded flex items-center justify-center">
              <span className="font-bold">M</span>
            </div>
            <span className="text-xl font-semibold text-gray-800 hidden md:block">
              Mail
            </span>
          </Link>
        </div>

        {["/dashboard", "/starred", "/sent"].includes(location.pathname) && (
          <div className="flex-1 max-w-2xl mx-6 hidden md:block">
            <form className="relative">
              <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 focus-within:shadow-md transition-shadow duration-300">
                <Search size={20} className="text-gray-500 mr-2" />
                <input
                  type="text"
                  placeholder="Search mail"
                  className="bg-transparent w-full outline-none text-gray-700"
                  value={search}
                  onChange={handleSearchChange}
                />
              </div>
            </form>
          </div>
        )}

        <div className="flex items-center space-x-3">
          <div className="relative">
            <button className="p-2 text-gray-700 hover:text-gray-900 focus:outline-none relative">
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center hover:bg-blue-200 focus:outline-none transition-colors duration-300"
            >
              <User size={20} />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 border border-gray-200">
                {user && (
                  <div className="px-4 py-2 border-b border-gray-200">
                    <p className="text-sm font-medium text-gray-900">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                )}

                <Link
                  to="/settings"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setShowUserMenu(false)}
                >
                  Settings
                </Link>

                <button
                  onClick={() => {
                    logout();
                    setShowUserMenu(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
