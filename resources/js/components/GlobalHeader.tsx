import React, { useState } from 'react';
import { router } from '@inertiajs/react';

interface UserInfo {
  name: string;
  email: string;
  avatar: string;
  plan: string;
  tokensRemaining: number;
}

interface GlobalHeaderProps {
  userInfo: UserInfo;
  onLogout?: () => void;
}

export default function GlobalHeader({ userInfo, onLogout }: GlobalHeaderProps) {
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showTokensModal, setShowTokensModal] = useState(false);

  const toggleProfileModal = () => {
    setShowProfileModal(!showProfileModal);
  };

  const toggleTokensModal = () => {
    setShowTokensModal(!showTokensModal);
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      router.post('/logout');
    }
  };

  return (
    <div className="Header">
      <div className="Header__panelLogo">
        <div className="Header__panelLogo--logos">
          <div className="fullLogo">
            <span className="logo-text">GatherLake AI</span>
          </div>
          <div className="comprimedLogo">
            <span className="logo-text-compressed">GL</span>
          </div>
        </div>
        <div className="Header__panelLogo--arrow">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 145.1 225.1">
                <path d="M104.4,112.2c-10.6-9.1-21-18-31.5-27C51.1,66.5,29.3,47.8,7.4,29.1c-4.6-3.9-7.2-8.6-6.5-14.7c0.7-6.2,4-10.7,9.8-13.1  c6-2.5,11.6-1.4,16.5,2.7c8.1,6.8,16.2,13.8,24.2,20.7c28.9,24.7,57.7,49.5,86.6,74.1c5.4,4.6,8.5,10.1,6.4,17.1  c-1,3.3-3.1,6.7-5.7,9C101.5,157.1,64,189,26.6,221c-7.1,6-17,5.2-22.8-1.7c-5.9-7.1-4.9-16.7,2.5-23c31.7-27.2,63.4-54.3,95.1-81.5  C102.4,114.1,103.2,113.3,104.4,112.2z"/>
            </svg>
        </div>
      </div>
      
      <div className="Header__plansInfo--left">
        <div className="Header__plansInfo">
          <div className="Header__plansInfo--tokens">
            <div className="Header__plansInfo--amountTokens" onClick={toggleTokensModal} style={{ cursor: 'pointer' }}>
              <span className="tokenCount">{userInfo.tokensRemaining}</span>
              <span className="tokenText">Tokens Remain</span>
            </div>
            <div className="Header__plansInfo--upgradeButton">
              {userInfo.plan === 'Premium' ? (
                <span className="premium-badge">
                  <span className="premium-icon">⭐</span>
                  Premium
                </span>
              ) : (
                <a href="/pricing">Upgrade</a>
              )}
            </div>
            
            {/* Tokens Info Modal */}
            <div className={`tokens_infoModal ${showTokensModal ? 'show' : ''}`}>
              <div className="tokens_infoModal-content">
                <div className="tokens_infoModal-header" style={{marginBottom: '10px'}}>
                  <h3>Información del Plan</h3>
                </div>
                <div className="tokens_infoModal-body">
                  {/* Plan Actual */}
                  <div className="plan-section">
                    <h4 className="plan-title">Plan Actual</h4>
                    <div className="plan-badge">
                      <span className="plan-name">{userInfo.plan}</span>
                      {userInfo.plan === 'Premium' && <span className="premium-star">⭐</span>}
                      {userInfo.plan === 'Admin' && <span className="admin-crown">👑</span>}
                    </div>
                  </div>
                  
                  {/* Tokens Disponibles */}
                  <div className="tokens-section">
                    <h4 className="tokens-title">Tokens Disponibles</h4>
                    <div className="tokens-display">
                      <span className="tokens-count">{userInfo.tokensRemaining}</span>
                      <span className="tokens-label">tokens restantes</span>
                    </div>
                    <div className="tokens-limit">
                      Límite: {userInfo.plan === 'Free' ? '200 tokens' : 
                               userInfo.plan === 'Premium' ? '1000 tokens' : 
                               userInfo.plan === 'Admin' ? 'Ilimitado' : '100 tokens'}
                    </div>
                  </div>
                  
                  {/* Información de Renovación */}
                  <div className="renewal-section">
                    <h4 className="renewal-title">Renovación</h4>
                    <div className="renewal-info">
                      <span className="renewal-time">Diaria a las 20:00 UTC</span>
                      <span className="renewal-note">Los tokens se renuevan automáticamente</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="Header__actions">

          {/* Notifications Action */}
          <div className="Header__actions--action" onClick={() => window.location.href = '/notifications'}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 302.3 335.7">
                <g>
                    <path d="M210.1,287.7c-7.6,32-34.3,47.8-58.4,48c-24.1,0.2-51.6-15.2-59.5-48c-1.3,0-2.6,0-4,0c-21,0-42,0-63,0   c-10.2,0-18-4.2-22.5-13.4c-4.5-9.3-3-18,3.2-26.3c7.4-10,14.4-20.4,21.4-30.7c2.9-4.2,3.9-9.1,3.8-14.2   c-0.1-27.7-0.6-55.4,0.1-83.1c1.4-51.4,25.6-88.8,72.5-109.9c67.7-30.5,148.1,10.4,164.3,82.9c2.1,9.3,2.9,19,3.1,28.5   c0.4,26.9,0.2,53.9,0.1,80.8c0,6.4,1.6,12,5.3,17.2c7.1,9.9,14.1,20,21.1,30c5.5,7.8,6.3,16.3,2,24.8c-4.2,8.5-11.5,13.1-21.1,13.2   c-21.4,0.2-42.8,0.1-64.1,0.1C213,287.7,211.6,287.7,210.1,287.7z M277.8,263.6c-7.3-10.4-14.1-20.5-21.2-30.4   c-6.5-9.2-9.6-19.3-9.5-30.5c0.1-26.8,0.1-53.6,0-80.5c0-4.1-0.2-8.2-0.6-12.3c-6-58.5-64-98-120.8-82.2   c-41.7,11.6-70.4,48.8-70.6,92c-0.2,27.7-0.1,55.4,0,83.1c0,11.2-3.1,21.3-9.6,30.5c-6.4,9-12.6,18-18.8,27c-0.7,1-1.4,2-2.3,3.3   C109,263.6,193.1,263.6,277.8,263.6z M184.5,288c-22.3,0-44.5,0-66.8,0c4.1,13.9,18.8,24,34.3,23.7   C166.7,311.4,181.3,300.8,184.5,288z"/>
                </g>
            </svg>

          </div>

          {/* Avatar Container */}
          <div className="Header__actions--avatar-container">
            <div className="Header__actions--avatar" onClick={toggleProfileModal} style={{ cursor: 'pointer' }}>
              <img src={userInfo.avatar} alt="" />
            </div>
            <div className={`Header__actions--avatar-modal ${showProfileModal ? 'show' : ''}`}>
              <div className="Header__actions--avatar-modalTop">
                <div className="Header__actions--avatar-image">
                  <img src={userInfo.avatar} alt="" />
                </div>
                <div className="Header__actions--avatar-info">
                  <h2>{userInfo.name} <span>{userInfo.plan}</span></h2>
                  <a>{userInfo.email}</a>
                </div>
              </div>
              <div className="Header__actions--avatar-modalBottom">
                <div className="Header__actions--avatar-profile" onClick={() => window.location.href = '/profile'}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 352.3">
                        <path d="M219.8,171.7c2.5,1.1,4.7,2,6.8,3.1c52,25.3,83,66.4,91.8,123.6c2,12.7,1.5,25.9,1.6,38.9c0.1,7.3-5.5,13.3-12.7,14.6c-1.9,0.4-4,0.5-6,0.5c-94.2,0-188.3,0.1-282.5-0.1c-4,0-8.4-1.3-12-3.1c-4.1-2-6.3-6.2-6.5-10.8c-1.8-33,2.9-64.8,19.2-94.2C37.6,211.5,63.7,187.7,98,173c0.7-0.3,1.4-0.6,2-1c0.1-0.1,0.2-0.2,0.5-0.5c-27.2-23.3-39.9-52.8-35.3-88.6c3.2-25.4,15.5-46.2,35.5-62.2C140.6-11,198.3-5.8,232.3,32.7C267.4,72.2,264.5,135.3,219.8,171.7z M288.6,320.1c-2.4-50-23.7-88.7-67.6-112.2c-46.7-24.9-93.3-21.4-136.4,9.4c-34.7,24.8-51.3,60-52.6,102.8C117.7,320.1,202.7,320.1,288.6,320.1z M96.2,96.4c-0.1,35,28.6,63.8,63.6,63.9c35.3,0.1,64.2-28.5,64.3-63.6c0-35.9-28.3-64.4-64.2-64.4C124.8,32.2,96.3,60.8,96.2,96.4z"/>
                    </svg>

                  <span>Profile</span>
                </div>
                <div className="Header__actions--avatar-settings" onClick={() => window.location.href = '/settings'}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        xmlnsXlink="http://www.w3.org/1999/xlink"
                        viewBox="0 0 437.4 458.5"
                        className="fn__svg replaced-svg"
                    >
                    <g>
                        <path
                        d="M218.8,457.5c-10.7,0-21.5,0.8-32.1-0.2c-28.2-2.6-50.2-25.9-50.8-54.3c-0.3-16.4-14.8-21.5-26.3-15.2c-26.8,14.7-59.8,5-75.5-21.2c-9.2-15.3-18.1-30.8-26.8-46.4c-14.8-26.7-6.2-59.8,19.4-76.2c13.3-8.5,13.4-21.2,0.1-29.7C0.9,197.8-7.6,164.7,7.4,137.8C16,122.4,24.8,107,33.9,91.9c15.8-26.4,48.9-36.1,75.9-21.2c10.9,6,25.6,1.4,26-15.2c0.7-29.4,23-52.7,53.1-54.6c20.9-1.3,41.9-1.1,62.8,0.4c26.7,1.8,48.6,25.9,49.9,52.6c0.1,1.3,0.1,2.6,0.2,3.9c1,13,12.6,19.5,24.2,13.4c10.9-5.8,22.4-8.4,34.7-6.9c18.2,2.3,32.5,11.1,42.1,26.7c9.6,15.6,18.7,31.5,27.5,47.6c14.6,26.6,6,59.3-19.7,75.7c-4.7,3-8.7,6.4-9.6,12.2c-1.1,7.6,2.2,13.1,8.6,17.1c14.6,9,23.6,22,26.7,38.9c2.3,12.9,0.7,25.3-5.7,36.8c-9.1,16.3-18.2,32.6-28,48.5c-15.8,25.7-48.6,34.2-75.6,20c-6.5-3.4-12.6-4.1-18.8,0.2c-5,3.5-6.3,8.7-6.6,14.5c-1.2,27.3-19.6,49.6-46.5,54.3c-11.9,2.1-24.3,1.3-36.4,1.8C218.8,458.2,218.8,457.8,218.8,457.5zM395.9,294.1c-0.4-8.4-4.1-12.8-9.7-16.3c-36.2-23-36-74.2,0.2-97.3c10.2-6.5,12-14.2,5.9-24.8c-7.6-13.2-15.2-26.4-22.8-39.6c-6.4-11.1-13.9-13.4-25.2-7.5c-12.4,6.5-25.5,8.4-39.2,5.3c-25.7-5.9-43.6-27.5-44.7-53.9c-0.5-12-6.4-17.8-18.4-17.8c-15.9,0-31.8,0-47.8,0c-10.5,0-16.6,5.9-17.3,16.3c-0.2,2.9-0.2,5.9-0.7,8.7c-7.1,39.5-48.3,59.5-84.1,41c-9.9-5.1-18-2.9-23.5,6.7c-8.1,13.9-16.1,27.8-24.1,41.7c-5.5,9.6-3.4,17.7,6,23.7c36.8,23.5,36.9,74.4,0.2,97.8c-9.9,6.3-11.7,14.2-5.8,24.5c7.7,13.4,15.4,26.7,23.1,40.1c6.2,10.8,13.6,12.5,24.9,7.6c7.4-3.3,15.6-6.2,23.6-6.6c33.2-1.8,58.7,22.3,60.4,55.8c0.6,11.1,6.7,17.1,17.6,17.1c16.1,0,32.2,0,48.2,0c10.8,0,16.9-5.9,17.6-16.6c0.3-4.5,0.6-9.1,1.7-13.5c9.1-35.9,49.2-53.5,82.4-36.3c10.8,5.6,18.5,3.5,24.5-7c7.9-13.6,15.8-27.2,23.6-40.9C394.3,299.2,395.2,295.8,395.9,294.1z"
                        />
                        <path
                        d="M215.6,333.1c-58.3-2.7-103.4-50.7-100.8-107.3c2.6-57.9,50.7-103.1,107-100.6c58.1,2.5,103.5,50.8,100.8,107.3C320,290.5,271.8,335.7,215.6,333.1zM156.3,228.8c-0.1,34.4,27.6,62.6,61.9,62.8c34.4,0.2,62.7-27.6,62.9-61.8c0.2-34.7-27.6-62.9-62.1-63C184.5,166.7,156.5,194.5,156.3,228.8z"
                        />
                    </g>
                    </svg>

                  <span>Settings</span>
                </div>
                <div className="Header__actions--avatar-billing" onClick={() => window.location.href = '/billing'}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        xmlnsXlink="http://www.w3.org/1999/xlink"
                        viewBox="0 0 288.1 359.6"
                        className="fn__svg replaced-svg"
                        >
                        <g>
                            <path
                            d="M288,178.2c0,51,0,102.1,0,153.1c0,17.9-17.2,29.6-33.3,22.7c-2.7-1.2-5.2-3-7.4-4.9c-4.7-4.1-9.2-8.4-13.8-12.6c-5.7-5.2-10.5-4.9-15.4,0.9c-2.7,3.2-5.4,6.6-8.2,9.8c-14.4,16.6-37.2,16.6-51.6,0c-2.4-2.7-4.6-5.6-7-8.3c-4.2-4.8-10.1-4.8-14.3,0c-2.7,3.1-5.2,6.4-8,9.4c-13.4,15-35.7,15.2-49.4,0.5c-3.4-3.7-6.5-7.6-9.7-11.4c-4.7-5.6-9.7-5.9-15.1-0.9c-4.8,4.4-9.5,8.8-14.4,13.1c-7.8,6.9-16.7,8.5-26.1,4.4C4.9,349.7,0,342,0,331.6C0,229.3,0,127,0,24.6C0,10.4,10.4,0,24.6,0c79.6,0,159.3,0,238.9,0C277.7,0,288,10.4,288,24.7C288.1,75.9,288,127.1,288,178.2zM24.2,24.1c0,102.6,0,204.8,0,307.7c5.5-5,10.4-9.6,15.5-14.2c14.7-12.9,35.3-11.4,48,3.5c3.1,3.6,6,7.4,9.1,10.9c4.2,4.8,10,4.8,14.3,0.1c2.7-3,5.1-6.1,7.7-9.1c13.5-15.4,36.1-15.6,49.9-0.5c2.7,3,5.1,6.1,7.7,9.1c4.7,5.4,10.4,5.4,15.1,0.1c3.4-3.9,6.5-7.9,9.9-11.7c11.9-13.2,31.9-14.7,45.6-3.3c5,4.2,9.6,8.7,14.4,13.1c0.7,0.6,1.4,1.1,2.3,1.7c0-102.7,0-204.9,0-307.3C183.9,24.1,104.2,24.1,24.2,24.1z"
                            />
                            <path
                            d="M158.9,78.6c0,6-0.2,12,0.1,18c0.1,1.6,1.1,3.5,2.3,4.5c4.7,3.9,9.8,7.4,14.6,11.1c6.2,4.7,7.3,10.8,3.2,17.4c-9.1,14.6-18.2,29.2-27.4,43.8c-3.3,5.3-8.4,7.4-13.7,5.9c-5.6-1.6-8.9-6-9-12.3c-0.1-9.5-0.1-19,0-28.4c0-2.3-0.7-3.6-2.8-4.6c-4.3-1.9-8.5-4.1-12.7-6.3c-6.7-3.5-9-9.9-5.7-16.7c9.2-18.7,18.6-37.3,27.9-55.8c2.8-5.6,8.2-8.1,13.6-6.8c5.8,1.4,9.3,5.9,9.4,12.4C159,66.6,158.9,72.6,158.9,78.6z"
                            />
                            <path
                            d="M144.2,233.6c-19.9,0-39.7,0.1-59.6,0c-9.4,0-15.3-9-11.3-17.1c2.3-4.7,6.3-6.8,11.6-6.8c20.1,0,40.2,0,60.4,0c19.1,0,38.2,0,57.4,0c8,0,13.4,4.9,13.5,11.9c0,7.1-5.4,12-13.3,12C183.2,233.6,163.7,233.6,144.2,233.6z"
                            />
                            <path
                            d="M144.1,281.5c-19.9,0-39.7,0-59.6,0c-6.6,0-11.7-4.6-12.4-10.7c-0.6-5.9,3.2-11.4,9.1-12.9c1.1-0.3,2.2-0.3,3.3-0.3c39.6,0,79.2,0,118.9,0c9.6,0,15.5,9.3,11.2,17.4c-2.5,4.7-6.5,6.6-11.7,6.6C183.3,281.5,163.7,281.5,144.1,281.5z"
                            />
                        </g>
                    </svg>

                  <span>Billing</span>
                </div>
                <div className="Header__actions--avatar-logOut" onClick={handleLogout} style={{ cursor: 'pointer' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 384" className="fn__svg replaced-svg">
                    <g>
                      <path d="M210.8,0c7.1,2.5,12.5,6.6,14.4,14.3c2.8,11.2-5.2,22.3-16.8,23.2c-1.5,0.1-3,0.1-4.5,0.1c-53.9,0-107.7,0-161.6,0   c-1.5,0-2.9,0-4.6,0c0,103,0,205.7,0,309c1.4,0,2.8,0,4.2,0c54.7,0,109.5,0,164.2,0c11.4,0,19.9,8.3,19.6,19.1   c-0.3,8-4.3,13.6-11.6,16.9c-1.1,0.5-2.2,1-3.4,1.4c-65.3,0-130.5,0-195.8,0c-7.6-2.4-12.6-7.4-15-15C0,251,0,133,0,15   C2.4,7.4,7.4,2.4,15,0C80.3,0,145.5,0,210.8,0z"></path>
                      <path d="M384,195.8c-1.8,5.6-5.6,9.8-9.8,13.9c-29.9,29.7-59.7,59.4-89.5,89.2c-4.6,4.6-9.7,7.3-16.4,6.7   c-7.4-0.7-12.6-4.6-15.5-11.3c-3-6.9-1.8-13.5,3-19.3c2.2-2.7,4.8-5,7.3-5.5c17.9-17.8,35.8-35.7,53.6-53.5   c0.8-0.8,1.5-1.6,2.9-3.1c-2.1,0-3.5,0-4.9,0c-57.7,0-115.5,0-173.2,0c-11.8,0-20.2-8.1-20-19.1c0.2-9.6,7.8-17.7,17.4-18.3   c1.4-0.1,2.7-0.1,4.1-0.1c57.2,0,114.5,0,171.7,0c1.4,0,2.7,0,4.9,0c-1.3-1.4-2.2-2.4-3.1-3.3c-19.8-19.8-39.7-39.5-59.5-59.3   c-9.6-9.6-7.3-24.8,4.6-30.5c7.6-3.7,15.6-2.2,22.2,4.4c14.5,14.3,28.9,28.7,43.3,43.1c15.7,15.6,31.3,31.3,47,46.8   c4.1,4.1,8,8.2,9.8,13.9C384,190.8,384,193.3,384,195.8z"></path>
                    </g>
                  </svg>
                  
                  <span>Log Out</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 