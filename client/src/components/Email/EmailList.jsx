import React, { useState } from "react";
import {
  Inbox,
  RefreshCw as Refresh,
  MoreVertical,
  Archive,
  Delete,
  Mail,
  Dumbbell as Label,
  MoveRight,
} from "lucide-react";
import EmailItem from "./EmailItem";

const EmailList = ({ emails }) => {
  const [selectedEmails, setSelectedEmails] = useState([]);

  const handleSelectEmail = (emailId) => {
    if (selectedEmails.includes(emailId)) {
      setSelectedEmails(selectedEmails.filter((id) => id !== emailId));
    } else {
      setSelectedEmails([...selectedEmails, emailId]);
    }
  };

  const handleStarEmail = (emailId) => {
    console.log("Star email:", emailId);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between">
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
      <div className="flex-1 overflow-y-auto">
        {emails.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <Inbox size={48} className="mb-4" />
            <p>No messages</p>
          </div>
        ) : (
          <div>
            {emails.map((email) => (
              <EmailItem
                key={email._id}
                email={email}
                isSelected={selectedEmails.includes(email._id)}
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
