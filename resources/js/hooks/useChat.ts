import { useState, useEffect, useCallback } from 'react';
import { ChatMessage, ChatSession, UserInfo, ChatData } from '../types/chat';
import { router } from '@inertiajs/react';

// Mock data - In real app, this would come from API
const mockUserInfo: UserInfo = {
  id: '1',
  name: 'Caden Smith',
  email: 'cadmail@gmail.com',
  avatar: './images/avatar.jpg',
  plan: 'Free',
  tokensRemaining: 120,
  tokensResetTime: '19 hours',
  dailyTokenLimit: 200
};

const mockSessions: ChatSession[] = [
  {
    id: '1',
    title: 'Chat Bot Definition',
    messages: [
      {
        id: '1',
        content: 'What is a chat bot?',
        author: 'user',
        timestamp: '2025-01-28T10:00:00Z'
      },
      {
        id: '2',
        content: 'At the most basic level, a chatbot is a computer program that simulates and processes human conversation (either written or spoken), allowing humans to interact with digital devices as if they were communicating with a real person. Chatbots can be as simple as rudimentary programs that answer a simple query with a single-line response, or as sophisticated as digital assistants that learn and evolve to deliver increasing levels of personalization as they gather and process information.',
        author: 'bot',
        timestamp: '2025-01-28T10:01:00Z'
      }
    ],
    createdAt: '2025-01-28T10:00:00Z',
    updatedAt: '2025-01-28T10:01:00Z',
    isActive: true
  },
  {
    id: '2',
    title: 'Essay: Marketing',
    messages: [],
    createdAt: '2025-01-28T09:00:00Z',
    updatedAt: '2025-01-28T09:00:00Z',
    isActive: false
  },
  {
    id: '3',
    title: 'Future of Social Media',
    messages: [],
    createdAt: '2025-01-28T08:00:00Z',
    updatedAt: '2025-01-28T08:00:00Z',
    isActive: false
  },
  {
    id: '4',
    title: 'Business Ideas',
    messages: [],
    createdAt: '2025-01-28T07:00:00Z',
    updatedAt: '2025-01-28T07:00:00Z',
    isActive: false
  }
];

export const useChat = () => {
  const [chatData, setChatData] = useState<ChatData>({
    currentSession: null,
    sessions: [],
    userInfo: mockUserInfo,
    isLoading: true,
    error: null
  });

  const [newMessage, setNewMessage] = useState('');
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState<string>('');
  const [showActionModal, setShowActionModal] = useState<string | null>(null);
  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);

  // Load initial data
  useEffect(() => {
    const loadChatData = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const currentSession = mockSessions.find(session => session.isActive) || null;
        
        setChatData({
          currentSession,
          sessions: mockSessions,
          userInfo: mockUserInfo,
          isLoading: false,
          error: null
        });
      } catch (error) {
        setChatData(prev => ({
          ...prev,
          isLoading: false,
          error: 'Failed to load chat data'
        }));
      }
    };

    loadChatData();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showActionModal) {
        const target = event.target as Element;
        if (!target.closest('.options')) {
          setShowActionModal(null);
        }
      }
      
      if (showProfileModal) {
        const target = event.target as Element;
        if (!target.closest('.Header__actions--avatar-container')) {
          setShowProfileModal(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showActionModal, showProfileModal]);

  // Toggle profile modal
  const toggleProfileModal = useCallback(() => {
    setShowProfileModal(prev => !prev);
  }, []);

  // Handle logout
  const handleLogout = useCallback(() => {
    router.post('/logout');
  }, []);

  // Send message
  const sendMessage = useCallback(async (message: string) => {
    if (!message.trim()) return;

    const newUserMessage: ChatMessage = {
      id: Date.now().toString(),
      content: message,
      author: 'user',
      timestamp: new Date().toISOString()
    };

    // Add user message immediately
    setChatData(prev => {
      if (!prev.currentSession) return prev;

      const updatedSession = {
        ...prev.currentSession,
        messages: [...prev.currentSession.messages, newUserMessage],
        updatedAt: new Date().toISOString()
      };

      return {
        ...prev,
        currentSession: updatedSession,
        sessions: prev.sessions.map(session => 
          session.id === updatedSession.id ? updatedSession : session
        )
      };
    });

    setNewMessage('');

    try {
      // Simulate API call to get bot response
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const botResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: `Respuesta de prueba para el mensaje: "${message}".`,
        author: 'bot',
        timestamp: new Date().toISOString()
      };

      setChatData(prev => {
        if (!prev.currentSession) return prev;

        const updatedSession = {
          ...prev.currentSession,
          messages: [...prev.currentSession.messages, botResponse],
          updatedAt: new Date().toISOString()
        };

        return {
          ...prev,
          currentSession: updatedSession,
          sessions: prev.sessions.map(session => 
            session.id === updatedSession.id ? updatedSession : session
          )
        };
      });
    } catch (error) {
      setChatData(prev => ({
        ...prev,
        error: 'Failed to send message'
      }));
    }
  }, []);

  // Create new chat session
  const createNewSession = useCallback(async () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: true
    };

    setChatData(prev => ({
      ...prev,
      currentSession: newSession,
      sessions: [newSession, ...prev.sessions.map(session => ({ ...session, isActive: false }))]
    }));
  }, []);

  // Switch to different session
  const switchSession = useCallback((sessionId: string) => {
    setChatData(prev => ({
      ...prev,
      currentSession: prev.sessions.find(session => session.id === sessionId) || null,
      sessions: prev.sessions.map(session => ({
        ...session,
        isActive: session.id === sessionId
      }))
    }));
  }, []);

  // Update session title
  const updateSessionTitle = useCallback((sessionId: string, newTitle: string) => {
    setChatData(prev => ({
      ...prev,
      sessions: prev.sessions.map(session => 
        session.id === sessionId 
          ? { ...session, title: newTitle, updatedAt: new Date().toISOString() }
          : session
      ),
      currentSession: prev.currentSession?.id === sessionId 
        ? { ...prev.currentSession, title: newTitle, updatedAt: new Date().toISOString() }
        : prev.currentSession
    }));
    setEditingSessionId(null);
  }, []);

  // Delete session
  const deleteSession = useCallback((sessionId: string) => {
    setChatData(prev => {
      const updatedSessions = prev.sessions.filter(session => session.id !== sessionId);
      const newCurrentSession = prev.currentSession?.id === sessionId 
        ? (updatedSessions[0] || null)
        : prev.currentSession;

      return {
        ...prev,
        currentSession: newCurrentSession,
        sessions: updatedSessions.map((session, index) => 
          index === 0 ? { ...session, isActive: true } : { ...session, isActive: false }
        )
      };
    });
    setShowActionModal(null);
  }, []);

  // Show action modal for session
  const showSessionActions = useCallback((sessionId: string) => {
    setShowActionModal(sessionId);
  }, []);

  // Hide action modal
  const hideSessionActions = useCallback(() => {
    setShowActionModal(null);
  }, []);

  // Start editing session title
  const startEditingSession = useCallback((sessionId: string) => {
    const session = chatData.sessions.find(s => s.id === sessionId);
    setEditingSessionId(sessionId);
    setEditingTitle(session?.title || '');
    setShowActionModal(null);
  }, [chatData.sessions]);

  // Save session title
  const saveSessionTitle = useCallback((sessionId: string) => {
    if (editingTitle.trim()) {
      updateSessionTitle(sessionId, editingTitle.trim());
    }
    setEditingSessionId(null);
    setEditingTitle('');
  }, [editingTitle, updateSessionTitle]);

  // Cancel editing session title
  const cancelEditingSession = useCallback(() => {
    setEditingSessionId(null);
    setEditingTitle('');
  }, []);

  return {
    chatData,
    newMessage,
    setNewMessage,
    editingSessionId,
    editingTitle,
    setEditingTitle,
    showActionModal,
    showProfileModal,
    sendMessage,
    createNewSession,
    switchSession,
    updateSessionTitle,
    deleteSession,
    showSessionActions,
    hideSessionActions,
    startEditingSession,
    cancelEditingSession,
    saveSessionTitle,
    toggleProfileModal,
    handleLogout
  };
}; 