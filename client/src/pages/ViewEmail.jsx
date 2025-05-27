import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Reply, Forward, Trash2, Archive, Clock, Dumbbell as Label, MoreHorizontal } from 'lucide-react';
import MainLayout from '../components/Layout/MainLayout';
import ComposeEmail from '../components/Email/ComposeEmail';
import { mockEmails } from '../data/mockData';

const ViewEmail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [email, setEmail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReply, setShowReply] = useState(false);
  
  useEffect(() => {
    // In a real app, this would be an API call
    const foundEmail = mockEmails.find(email => email.id === id);
    
    if (foundEmail) {
      setEmail(foundEmail);
      // Mark as read
      foundEmail.read = true;
    }
    
    setLoading(false);
  }, [id]);
  
  const handleGoBack = () => {
    navigate(-1);
  };
  
  const handleStar = () => {
    if (email) {
      setEmail({
        ...email,
        starred: !email.starred
      });
    }
  };
  
  if (loading) {
    return (
      <MainLayout>
        <div className="h-full flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </MainLayout>
    );
  }
  
  if (!email) {
    return (
      <MainLayout>
        <div className="h-full flex flex-col items-center justify-center p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Email not found</h2>
          <p className="text-gray-600 mb-6">The email you're looking for doesn't exist or has been deleted.</p>
          <button
            onClick={handleGoBack}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-colors duration-300"
          >
            Go back
          </button>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="h-full flex flex-col">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={handleGoBack}
              className="mr-4 text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100"
            >
              <ArrowLeft size={20} />
            </button>
            
            <h1 className="text-lg font-medium text-gray-900 truncate">
              {email.subject}
            </h1>
          </div>
          
          <div className="flex space-x-2">
            <button 
              onClick={handleStar}
              className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100"
            >
              <Star 
                size={20} 
                className={email.starred ? 'fill-yellow-400 text-yellow-400' : ''} 
              />
            </button>
            <button className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100">
              <Label size={20} />
            </button>
            <button className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100">
              <Archive size={20} />
            </button>
            <button className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100">
              <Trash2 size={20} />
            </button>
            <button className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100">
              <Clock size={20} />
            </button>
            <button className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100">
              <MoreHorizontal size={20} />
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium mr-4">
                  {email.sender.name.charAt(0)}
                </div>
                
                <div>
                  <div className="flex items-baseline">
                    <h2 className="text-base font-medium text-gray-900">
                      {email.sender.name}
                    </h2>
                    <span className="ml-2 text-sm text-gray-500">
                      {email.sender.email}
                    </span>
                  </div>
                  
                  <p className="text-xs text-gray-500">
                    To: me
                  </p>
                </div>
              </div>
              
              <div className="text-sm text-gray-500">
                {new Date(email.date).toLocaleString()}
              </div>
            </div>
            
            <div className="prose max-w-none">
              {email.body.split('\n').map((paragraph, i) => (
                <p key={i} className="mb-4 text-gray-800">
                  {paragraph}
                </p>
              ))}
            </div>
            
            {email.hasAttachment && (
              <div className="mt-6 border border-gray-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Attachments
                </h3>
                <div className="flex items-center p-3 bg-gray-50 rounded border border-gray-200">
                  <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center mr-3">
                    <span className="text-xs text-gray-600">PDF</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      document.pdf
                    </p>
                    <p className="text-xs text-gray-500">
                      1.2MB
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex space-x-3 mt-6">
            <button
              onClick={() => setShowReply(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-colors duration-300 flex items-center"
            >
              <Reply size={18} className="mr-2" />
              Reply
            </button>
            
            <button 
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-1 transition-colors duration-300 flex items-center"
            >
              <Forward size={18} className="mr-2" />
              Forward
            </button>
          </div>
        </div>
      </div>
      
      {showReply && (
        <ComposeEmail 
          onClose={() => setShowReply(false)} 
          initialTo={email.sender.email}
          initialSubject={`Re: ${email.subject}`}
          initialBody={`\n\n\n---------- Original Message ----------\nFrom: ${email.sender.name} <${email.sender.email}>\nDate: ${new Date(email.date).toLocaleString()}\nSubject: ${email.subject}\n\n${email.body}`}
          replyTo={email.sender.name}
        />
      )}
    </MainLayout>
  );
};

export default ViewEmail;