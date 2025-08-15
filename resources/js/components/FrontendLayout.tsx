import React from 'react';
import GlobalHeader from './GlobalHeader';
import GlobalSidebar from './GlobalSidebar';

interface UserInfo {
  name: string;
  email: string;
  avatar: string;
  plan: string;
  tokensRemaining: number;
}

interface FrontendLayoutProps {
  children: React.ReactNode;
  userInfo: UserInfo;
  activePage?: string;
  onLogout?: () => void;
}

export default function FrontendLayout({ 
  children, 
  userInfo, 
  activePage = 'chat', 
  onLogout 
}: FrontendLayoutProps) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--techwave-site-bg-color)' }}>
      {/* Header Global */}
      <GlobalHeader userInfo={userInfo} onLogout={onLogout} />
      
      {/* Content con Sidebar y Body */}
      <div className="Content">
        {/* Sidebar Global */}
        <GlobalSidebar activePage={activePage} onLogout={onLogout} />
        
        {/* Contenido Principal */}
        <div className="Content__body">
          {children}
        </div>
      </div>
    </div>
  );
} 