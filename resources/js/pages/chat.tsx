import React from 'react';
import { Head } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import { useAuth } from '@/hooks/useAuth';
import FrontendLayout from '@/components/FrontendLayout';
import { useChat } from '@/hooks/useChat';
import ChatResponse from '../components/chat-response';

function Chat() {
  const { userInfo } = useAuth();

  const {
    chatData,
    newMessage,
    setNewMessage,
    editingSessionId,
    editingTitle,
    setEditingTitle,
    showActionModal,
    isProcessing,
    sendMessage,
    createNewSession,
    switchSession,
    deleteSession,
    showSessionActions,
    startEditingSession,
    cancelEditingSession,
    saveSessionTitle,
    handleConfirmAction,
    handleCancelAction,
  } = useChat();

  const { currentSession, sessions } = chatData;

  // Función para manejar el logout
  const handleLogout = () => {
    router.post('/logout');
  };



  if (chatData.isLoading) {
    return <div>Loading...</div>;
  }
  if (chatData.error) {
    return <div>Error: {chatData.error}</div>;
  }

  // Utilidad para formatear fecha
  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
  };

  return (
    <>
      <Head title="Chat" />
      <FrontendLayout userInfo={userInfo} activePage="chat" onLogout={handleLogout}>
          <div className="Content__body--chatsContainer">
            <div className="Content__body--left">
              <div className="Content__body--title">
                <h1>{currentSession?.title || 'SQL Assistant'}</h1>
              </div>
              <div className="Content__body--chats">
                {currentSession && currentSession.messages.length > 0 ? (
                  currentSession.messages.map(msg => (
                    <div
                      key={msg.id}
                      className={`Content__body--chats-messageContainer ${msg.author === 'user' ? 'youMessage' : 'botMessage'}`}
                    >
                      <div className="Content__body--chats-messageAuthor">
                        <span>{msg.author === 'user' ? 'You' : 'Bot'}</span>
                      </div>
                      <div className="Content__body--chats-messageText">
                      {msg.author === 'bot' ? (
                        <ChatResponse 
                          message={msg} 
                          onConfirm={handleConfirmAction}
                          onCancel={handleCancelAction}
                        />
                      ) : (
                        <p>{msg.content}</p>
                      )}
                        <small>{formatDate(msg.timestamp)}</small>
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ color: '#888', padding: '2rem 0' }}>No messages yet.</div>
                )}
              </div>
              <div className="Content__body--bottom">
                <div className="Content__body--sendMessage">
                  <textarea
                    rows={1}
                    placeholder={isProcessing ? "Procesando consulta..." : "Escribe tu consulta SQL en lenguaje natural..."}
                    id="sendMessageTextarea"
                    style={{ 
                      height: '60px', 
                      overflowY: 'hidden'
                    }}
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    disabled={isProcessing}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && !e.shiftKey && !isProcessing) {
                        e.preventDefault();
                        sendMessage(newMessage);
                      }
                    }}
                  />
                  <button 
                    onClick={() => sendMessage(newMessage)} 
                    disabled={isProcessing || !newMessage.trim()}
                    style={{ 
                      opacity: isProcessing || !newMessage.trim() ? 0.5 : 1,
                      cursor: isProcessing || !newMessage.trim() ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {isProcessing ? (
                      <div className="loading-spinner">
                        <div className="spinner"></div>
                      </div>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 287.7 223.4" className="fn__svg replaced-svg">
                        <g>
                          <path d="M55,127.6c2,0,3,0,4,0c49.3,0,98.5,0,147.8,0c23.2,0,42.1-14.5,47.4-36.4c1-4.3,1.3-8.9,1.4-13.3c0.1-20.2,0-40.4,0.1-60.6   c0-10.4,6.9-17.4,16.6-17.2c8.1,0.2,15.2,6.5,15.3,14.5c0.1,25.1,0.9,50.2-0.8,75.2c-2.3,33.5-30.5,62.6-63.7,68.4   c-5.6,1-11.4,1.5-17.1,1.5c-48.6,0.1-97.3,0.1-145.9,0.1c-1.4,0-2.7,0-5,0c1.4,1.4,2.2,2.4,3.1,3.3c11,11,22.1,22,33,33.1   c8.9,9.1,5.2,23.6-6.7,26.9c-6.3,1.7-11.7-0.2-16.3-4.8c-19-19.1-38.1-38.1-57.1-57.2c-2-2-4.1-4-6.1-6c-6.1-6.3-6.3-16-0.1-22.2   c21.3-21.4,42.7-42.7,64.1-64c6.6-6.5,16.2-6.4,22.5-0.3c6.4,6.3,6.6,16.1,0,22.8c-10.8,11.1-21.8,21.9-32.8,32.9   C57.5,124.9,56.6,125.9,55,127.6z"></path>
                        </g>
                      </svg>
                    )}
                  </button>
                </div>
                <div className="Content__body--rights">
                  <p>2025© Grupo #4 Team</p>
                  <ul>
                    <li><a href="#">Terms of Service</a></li>
                    <li><a href="#">Privacy Policy</a></li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="Content__body--right">
              <div className="Content__body--newChat">
                <div className="Content__body--newChatCard" onClick={createNewSession} style={{ cursor: 'pointer' }}>
                  <div className="Content__body--newChat-icon"></div>
                  <div className="Content__body--newChat-text">
                    <span>Nuevo Chat SQL</span>
                  </div>
                </div>
              </div>
              <div className="Content__body--myChats">
                <div className="Content__body--myChats-item">
                  <div className="Content__body--myChats-date">
                    <h2>Today</h2>
                  </div>
                  <div className="Content__body--myChats-itemsContainer">
                    {sessions.map(session => (
                      <div
                        key={session.id}
                        className={`Content__body--myChats-chat${session.isActive ? ' chatActive' : ''}`}
                        onClick={() => switchSession(session.id)}
                        style={{ cursor: 'pointer' }}
                      >
                        {editingSessionId === session.id ? (
                          <>
                            <input
                              type="text"
                              value={editingTitle}
                              onChange={e => setEditingTitle(e.target.value)}
                              onKeyDown={e => {
                                if (e.key === 'Enter') {
                                  saveSessionTitle(session.id);
                                } else if (e.key === 'Escape') {
                                  cancelEditingSession();
                                }
                              }}
                              autoFocus
                            />
                            <span className="save_options">
                              <button className="save" onClick={() => saveSessionTitle(session.id)} title="Save">
                                {/* SVG save */}
                                <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 408.8 294.1" enableBackground="new 0 0 408.8 294.1;" xmlSpace="preserve" className="fn__svg replaced-svg">
                                    <g>
                                        <path d="M408.8,36.8c-2,10.1-8.3,17.4-15.4,24.5C319.6,135,245.8,208.8,172.1,282.6c-10,10-21.5,14.3-35.1,9.5   c-5-1.7-9.9-4.9-13.6-8.6C85.6,246.1,48.1,208.6,10.6,171c-15.1-15.2-13.9-37,2.6-49.9c12.8-10,30.9-8.2,43.7,4.6   c28.9,28.9,57.8,57.8,86.6,86.7c1.1,1.1,1.8,2.6,3.4,4.9c1.7-2.3,2.4-3.6,3.4-4.6c67.1-67.1,134.2-134.2,201.2-201.3   c9.7-9.7,21-13.8,34.5-9.6c11.8,3.7,18.8,12,21.9,23.8c0.2,0.9,0.5,1.7,0.8,2.6C408.8,31,408.8,33.9,408.8,36.8z"></path>
                                    </g>
                                </svg>

                              </button>
                              <button className="cancel" onClick={cancelEditingSession} title="Cancel">
                                {/* SVG cancel */}
                                    <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 383.3 383.3" enableBackground="new 0 0 383.3 383.3;" xmlSpace="preserve" className="fn__svg replaced-svg">
                                        <g>
                                            <path d="M15,383.3c-1.1-0.5-2.2-1-3.3-1.4C0.2,377.1-3.6,362.9,4,353.1c1.1-1.5,2.5-2.8,3.8-4.1c51.3-51.3,102.7-102.7,154-154   c1-1,2.4-1.7,3.9-2.7c-1.8-1.9-2.8-3-3.8-4C110.1,136.6,58.5,84.9,6.8,33.3c-5.2-5.2-7.9-11.2-6.3-18.5C3.7,0.7,20.2-4.7,31.1,4.7c1.2,1.1,2.3,2.2,3.5,3.4C85.7,59.3,136.9,110.4,188,161.6c1.1,1.1,2,2.3,3.2,3.8c1.4-1.3,2.5-2.3,3.5-3.3   C246.4,110.3,298.1,58.7,349.8,7c6-6,12.7-8.6,21-5.8c6.7,2.2,10.2,7.5,12.5,13.9c0,2.5,0,5,0,7.5c-1.8,5.6-5.6,9.8-9.7,13.8   C322.8,87,272.1,137.7,221.3,188.4c-1,1-2,2.1-3.4,3.5c1.4,1.2,2.6,2.1,3.7,3.2c50.5,50.5,101.1,101.1,151.7,151.6   c4.2,4.2,8.1,8.4,10,14.1c0,2.5,0,5,0,7.5c-2.4,7.6-7.4,12.6-15,15c-2.5,0-5,0-7.5,0c-5.6-1.8-9.7-5.7-13.8-9.7   c-50.7-50.8-101.4-101.5-152.1-152.2c-1-1-2,1-2-3.7-3.5c-1.2,1.5-2,2.8-3,3.8C137.5,272.2,86.9,322.9,36.3,373.5   c-4.1,4.1-8.2,7.9-13.8,9.7C20,383.3,17.5,383.3,15,383.3z"></path>
                                        </g>
                                    </svg>
                              </button>
                            </span>
                          </>
                        ) : (
                          <>
                            <p>{session.title}</p>
                            <input type="text" value={session.title} readOnly style={{ display: 'none' }} />
                            <span className="options">
                              <button className="trigger" onClick={e => { e.stopPropagation(); showSessionActions(session.id); }}><span></span></button>
                              <span className={`options__popup ${showActionModal === session.id ? 'show' : ''}`}>
                                  <span className="options__list">
                                    <button className="edit" onClick={e => { e.stopPropagation(); startEditingSession(session.id); }}>
                                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="action-icon">
                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                        <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                      </svg>
                                      Editar
                                    </button>
                                    <button className="delete" onClick={e => { e.stopPropagation(); deleteSession(session.id); }}>
                                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="action-icon">
                                        <path d="M3 6h18"></path>
                                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                                      </svg>
                                      Borrar
                                    </button>
                                  </span>
                                </span>
                            </span>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

      {/* Estilos para el spinner de carga */}
      <style>{`
        .loading-spinner {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          height: 20px;
        }
        
        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid transparent;
          border-top: 2px solid #ffffff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .Content__body--sendMessage button:disabled {
          background-color: #666 !important;
        }
        
        .Content__body--sendMessage textarea:disabled {
          background-color: transparent !important;
          color: inherit !important;
          border-color: inherit !important;
          opacity: 0.7;
        }
      `}</style>
        </FrontendLayout>
    </>
  );
}

export default Chat;
