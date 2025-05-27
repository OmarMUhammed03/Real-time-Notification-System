import React from 'react';
import { Star, Paperclip } from 'lucide-react';
import { Link } from 'react-router-dom';

const EmailItem = ({ email, isSelected, onSelect, onStar }) => {
  const handleStarClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onStar(email.id);
  };

  return (
    <Link
      to={`/email/${email.id}`}
      className={`
        block border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200
        ${email.read ? 'bg-white' : 'bg-blue-50'}
        ${isSelected ? 'bg-blue-100 hover:bg-blue-100' : ''}
      `}
    >
      <div className="flex items-center py-2 px-4">
        <div className="flex items-center mr-4">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onSelect(email.id)}
            onClick={(e) => e.stopPropagation()}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          
          <button 
            onClick={handleStarClick}
            className="ml-3 text-gray-400 hover:text-yellow-400 focus:outline-none"
          >
            <Star 
              size={18} 
              className={email.starred ? 'fill-yellow-400 text-yellow-400' : ''} 
            />
          </button>
        </div>
        
        <div className="min-w-0 flex-1">
          <div className="flex justify-between">
            <span className={`text-sm ${email.read ? 'text-gray-600' : 'font-semibold text-gray-900'}`}>
              {email.sender.name}
            </span>
            <span className="text-xs text-gray-500">
              {new Date(email.date).toLocaleDateString()}
            </span>
          </div>
          
          <div className="flex items-baseline mt-1">
            <h3 className={`text-sm ${email.read ? 'text-gray-600' : 'font-semibold text-gray-900'}`}>
              {email.subject}
            </h3>
            
            {email.hasAttachment && (
              <Paperclip size={14} className="ml-2 text-gray-400" />
            )}
          </div>
          
          <p className="text-xs text-gray-500 truncate mt-1">
            {email.preview}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default EmailItem;