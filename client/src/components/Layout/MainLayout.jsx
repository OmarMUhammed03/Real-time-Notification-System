import React, { useState, useEffect } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

const MainLayout = ({ children, search, onSearch }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkIsMobile();
    
    // Add event listener
    window.addEventListener('resize', checkIsMobile);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Header search={search} onSearch={onSearch} />
      
      <div className="flex flex-1 overflow-hidden">
        <div className={`${isMobile ? 'absolute z-20' : 'w-64'} h-full bg-white border-r border-gray-200`}>
          <Sidebar isMobile={isMobile} />
        </div>
        
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;