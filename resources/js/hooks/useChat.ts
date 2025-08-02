import { useState, useEffect, useCallback } from 'react';
import { ChatMessage, ChatSession, UserInfo, ChatData } from '../types/chat';
import { router } from '@inertiajs/react';
import axios from 'axios';
import ChatResponse from '../components/chat-response';

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
    title: 'SQL Assistant',
    messages: [
      {
        id: '1',
        content: 'Hola! Soy tu asistente SQL. Puedes preguntarme en lenguaje natural y te ayudaré a generar consultas SQL. ¿En qué puedo ayudarte?',
        author: 'bot',
        timestamp: '2025-01-28T10:00:00Z'
      }
    ],
    createdAt: '2025-01-28T10:00:00Z',
    updatedAt: '2025-01-28T10:01:00Z',
    isActive: true
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
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [activeConnection, setActiveConnection] = useState<any>(null);
  const [pendingConfirmation, setPendingConfirmation] = useState<{
    sql: string;
    type: 'update' | 'delete';
    affectedRecords: any[];
    affectedCount: number;
  } | null>(null);

  const [completedActions, setCompletedActions] = useState<Set<string>>(new Set());

  // Load initial data and active connection
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

        // Get active connection
        try {
          const response = await axios.get('/connections/active');
          setActiveConnection(response.data.connection);
        } catch (error) {
          console.log('No active connection found');
        }
      } catch {
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

  // Send message with NL2SQL functionality
  const sendMessage = useCallback(async (message: string) => {
    if (!message.trim() || !activeConnection) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: message,
      author: 'user',
      timestamp: new Date().toISOString()
    };

    setChatData(prev => {
      if (!prev.currentSession) return prev;
      return {
        ...prev,
        currentSession: {
          ...prev.currentSession,
          messages: [...prev.currentSession.messages, userMessage]
        }
      };
    });

    setNewMessage('');
    setIsProcessing(true);

    try {
      // Check if we have a pending confirmation
      if (pendingConfirmation) {
        const userInput = message.toLowerCase().trim();
        const isConfirming = userInput === 'sí' || userInput === 'si' || userInput === 'confirmar' || userInput === 'aceptar';
        const isCanceling = userInput === 'no' || userInput === 'cancelar' || userInput === 'cancel';

        let botResponse: ChatMessage;

        if (isConfirming) {
          // Execute the pending query
          const response = await axios.post('/nl2sql/confirm', {
            sql: pendingConfirmation.sql,
            type: pendingConfirmation.type
          }, {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          });

          console.log('Confirmation response:', response.data);

          if (response.data.result) {
            const result = response.data.result;
            botResponse = {
              id: (Date.now() + 1).toString(),
              content: `Consulta ${result.type.toUpperCase()} confirmada y ejecutada`,
              author: 'bot',
              timestamp: new Date().toISOString(),
              responseData: {
                type: result.type,
                sql: result.sql,
                data: result.data,
                affectedRows: result.affected_rows
              }
            };
          } else {
            botResponse = {
              id: (Date.now() + 1).toString(),
              content: 'Consulta confirmada y ejecutada exitosamente.',
              author: 'bot',
              timestamp: new Date().toISOString()
            };
          }

          setPendingConfirmation(null);
        } else if (isCanceling) {
          // Cancel the pending query
          botResponse = {
            id: (Date.now() + 1).toString(),
            content: 'Consulta cancelada exitosamente. La operación no se ejecutó.',
            author: 'bot',
            timestamp: new Date().toISOString()
          };
          setPendingConfirmation(null);
        } else {
          // Invalid input for confirmation
          botResponse = {
            id: (Date.now() + 1).toString(),
            content: 'Por favor, responde con "SÍ" o "CONFIRMAR" para ejecutar la consulta, o "NO" o "CANCELAR" para cancelarla.',
            author: 'bot',
            timestamp: new Date().toISOString()
          };
        }

        setChatData(prev => {
          if (!prev.currentSession) return prev;
          return {
            ...prev,
            currentSession: {
              ...prev.currentSession,
              messages: [...prev.currentSession.messages, botResponse]
            }
          };
        });

        setIsProcessing(false);
        return;
      }

      // Send to NL2SQL API (no need to send connection_id anymore)
      const response = await axios.post('/nl2sql', {
        query: message
      }, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      console.log('Response from NL2SQL:', response.data); // Debug log
      console.log('Response status:', response.status); // Debug log
      console.log('Response headers:', response.headers); // Debug log

      let botResponse: ChatMessage;

      if (response.data.pendingQuery) {
        // Handle UPDATE/DELETE queries that need confirmation
        const { sql, type, affectedRecords, affectedCount } = response.data.pendingQuery;
        
        // Save pending confirmation
        setPendingConfirmation({ sql, type, affectedRecords, affectedCount });
        
        botResponse = {
          id: (Date.now() + 1).toString(),
          content: `Consulta ${type.toUpperCase()} que requiere confirmación`,
          author: 'bot',
          timestamp: new Date().toISOString(),
          responseData: {
            type: 'pending',
            sql,
            affectedRecords,
            affectedCount
          }
        };
      } else if (response.data.result) {
        // Handle structured results (SELECT, UPDATE, DELETE, INSERT)
        const result = response.data.result;
        
        botResponse = {
          id: (Date.now() + 1).toString(),
          content: `Consulta ${result.type.toUpperCase()} ejecutada`,
          author: 'bot',
          timestamp: new Date().toISOString(),
          responseData: {
            type: result.type,
            sql: result.sql,
            data: result.data,
            affectedRows: result.affected_rows
          }
        };
      } else if (response.data.success) {
        // Handle success messages
        botResponse = {
          id: (Date.now() + 1).toString(),
          content: response.data.success,
          author: 'bot',
          timestamp: new Date().toISOString()
        };
      } else {
        // Handle other responses
        botResponse = {
          id: (Date.now() + 1).toString(),
          content: 'Consulta procesada correctamente.',
          author: 'bot',
          timestamp: new Date().toISOString()
        };
      }

      setChatData(prev => {
        if (!prev.currentSession) return prev;
        return {
          ...prev,
          currentSession: {
            ...prev.currentSession,
            messages: [...prev.currentSession.messages, botResponse]
          }
        };
      });

    } catch (error: any) {
      console.error('Error sending message:', error);
      
      const errorMessage = error.response?.data?.error || 'Error al procesar la consulta.';
      
      const botResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: `❌ **Error:** ${errorMessage}`,
        author: 'bot',
        timestamp: new Date().toISOString()
      };

      setChatData(prev => {
        if (!prev.currentSession) return prev;
        return {
          ...prev,
          currentSession: {
            ...prev.currentSession,
            messages: [...prev.currentSession.messages, botResponse]
          }
        };
      });
    } finally {
      setIsProcessing(false);
    }
  }, [activeConnection, pendingConfirmation]);

  // Create new chat session
  const createNewSession = useCallback(async () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: 'Nuevo Chat SQL',
      messages: [
        {
          id: '1',
          content: 'Hola! Soy tu asistente SQL. Puedes preguntarme en lenguaje natural y te ayudaré a generar consultas SQL. ¿En qué puedo ayudarte?',
          author: 'bot',
          timestamp: new Date().toISOString()
        }
      ],
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

  const handleConfirmAction = useCallback(async () => {
    if (!pendingConfirmation) return;

    setIsProcessing(true);
    try {
      const response = await axios.post('/nl2sql/confirm', {
        sql: pendingConfirmation.sql,
        type: pendingConfirmation.type
      }, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      console.log('Confirmation response:', response.data);

      let botResponse: ChatMessage;
      if (response.data.result) {
        const result = response.data.result;
        botResponse = {
          id: (Date.now() + 1).toString(),
          content: `Consulta ${result.type.toUpperCase()} confirmada y ejecutada`,
          author: 'bot',
          timestamp: new Date().toISOString(),
          responseData: {
            type: result.type,
            sql: result.sql,
            data: result.data,
            affectedRows: result.affected_rows
          }
        };
      } else {
        botResponse = {
          id: (Date.now() + 1).toString(),
          content: 'Consulta confirmada y ejecutada exitosamente.',
          author: 'bot',
          timestamp: new Date().toISOString()
        };
      }

      setChatData(prev => {
        if (!prev.currentSession) return prev;
        return {
          ...prev,
          currentSession: {
            ...prev.currentSession,
            messages: [...prev.currentSession.messages, botResponse]
          }
        };
      });

      // Mark the pending confirmation as completed
      setCompletedActions(prev => new Set(prev).add(pendingConfirmation.sql));
      setPendingConfirmation(null);
    } catch (error: any) {
      console.error('Error confirming action:', error);
      
      const errorMessage = error.response?.data?.error || 'Error al confirmar la acción.';
      
      const botResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: `❌ **Error:** ${errorMessage}`,
        author: 'bot',
        timestamp: new Date().toISOString()
      };

      setChatData(prev => {
        if (!prev.currentSession) return prev;
        return {
          ...prev,
          currentSession: {
            ...prev.currentSession,
            messages: [...prev.currentSession.messages, botResponse]
          }
        };
      });
    } finally {
      setIsProcessing(false);
    }
  }, [pendingConfirmation]);

  const handleCancelAction = useCallback(() => {
    if (!pendingConfirmation) return;

    const botResponse: ChatMessage = {
      id: (Date.now() + 1).toString(),
      content: 'Consulta cancelada exitosamente. La operación no se ejecutó.',
      author: 'bot',
      timestamp: new Date().toISOString()
    };

    setChatData(prev => {
      if (!prev.currentSession) return prev;
      return {
        ...prev,
        currentSession: {
          ...prev.currentSession,
          messages: [...prev.currentSession.messages, botResponse]
        }
      };
    });

    // Mark the pending confirmation as completed
    setCompletedActions(prev => new Set(prev).add(pendingConfirmation.sql));
    setPendingConfirmation(null);
  }, [pendingConfirmation]);

  return {
    chatData,
    newMessage,
    setNewMessage,
    editingSessionId,
    editingTitle,
    setEditingTitle,
    showActionModal,
    showProfileModal,
    isProcessing,
    sendMessage,
    createNewSession,
    switchSession,
    deleteSession,
    showSessionActions,
    startEditingSession,
    cancelEditingSession,
    saveSessionTitle,
    toggleProfileModal,
    handleLogout,
    handleConfirmAction,
    handleCancelAction
  };
};