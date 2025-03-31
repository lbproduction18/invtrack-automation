
import React from 'react';
import TopBar from './TopBar';
import { useLocation } from 'react-router-dom';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background text-foreground">
      <TopBar />
      <main className="flex-1 overflow-auto bg-background backdrop-blur-sm p-4">
        <div className="page-container">
          {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
