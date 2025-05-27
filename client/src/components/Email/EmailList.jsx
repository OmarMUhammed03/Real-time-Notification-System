import React, { useState } from 'react';
import { Inbox, RefreshCw as Refresh, MoreVertical, Archive, Delete, Mail, Dumbbell as Label, MoveRight } from 'lucide-react';
import EmailItem from './EmailItem';

const EmailList = ({ emails, title, icon }) => {
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedEmails([]);
    } else {
      setSelectedEmails(emails.map(email => email.id));
    }
    setSelectAll(!selectAll);
  };
  
  const handleSelectEmail = (emailId) => {
    if (selectedEmails.includes(emailId)) {
      setSelectedEmails(selectedEmails.filter(id => id !== emailId));
    } else {
      setSelectedEmails([...selectedEmails, emailId]);
    }
  };
  
  const handleStarEmail = (emailId) => {
    // This would update the email in a real app
    console.log('Star email:', emailId);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={selectAll}
              onChange={handleSelectAll}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            
            <div className="ml-4 flex space-x-2">
              <button className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100">
                <Refresh size={18} />
              </button>
              <button className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100">
                <MoreVertical size={18} />
              </button>
            </div>
          </div>
          
          {selectedEmails.length > 0 && (
            <div className="flex space-x-2">
              <button className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100">
                <Archive size={18} />
              </button>
              <button className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100">
                <Delete size={18} />
              </button>
              <button className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100">
                <Mail size={18} />
              </button>
              <button className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100">
                <Label size={18} />
              </button>
              <button className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100">
                <MoveRight size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className="py-2 px-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center">
          {icon || <Inbox size={18} className="text-gray-600 mr-2" />}
          <h2 className="text-sm font-medium text-gray-700">{title}</h2>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {emails.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <Inbox size={48} className="mb-4" />
            <p>No messages</p>
          </div>
        ) : (
          <div>
            {emails.map(email => (
              <EmailItem
                key={email.id}
                email={email}
                isSelected={selectedEmails.includes(email.id)}
                onSelect={handleSelectEmail}
                onStar={handleStarEmail}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailList;