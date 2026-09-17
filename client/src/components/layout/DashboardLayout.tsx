import React from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { useParams } from 'react-router-dom';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { id: spaceId } = useParams<{ id?: string }>();

  return (
    <div className="min-h-screen bg-apple-lightBg dark:bg-apple-darkBg text-neutral-900 dark:text-neutral-100 flex flex-col font-sans transition-colors duration-300">
      <Navbar />
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar currentSpaceId={spaceId} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
};

