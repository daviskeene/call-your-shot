import React from 'react';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col items-center">
      <div className="w-full max-w-3xl px-4 sm:px-6 lg:px-8">
        <Header />
      </div>
      <main className="flex-1 w-full max-w-3xl px-4 sm:px-6 lg:px-8 mt-16">
        {children}
      </main>
    </div>
  );
};

export default Layout;
