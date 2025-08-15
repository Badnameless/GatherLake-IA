import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { ChatMessage, ChatSession, UserInfo, ChatData } from '../types/chat';
import { useAuth } from './useAuth';

const mockSessions: ChatSession[] = [
  {
    id: '1',
    title: 'Chat SQL Principal',
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
  }
];

const getStorageKeys = (userId: string) => ({
  CHAT_SESSIONS: `gatherlake_chat_sessions_${userId}`,
  CURRENT_SESSION: `gatherlake_current_session_${userId}`,
  USER_INFO: `gatherlake_user_info_${userId}`
});

const localStorageUtils = {
  save: (key: string, data: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  },
  
  load: (key: string, defaultValue: any = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      return defaultValue;
    }
  },
  
  remove: (key: string) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  }
};

export function useChat() {
  const { userInfo } = useAuth();
  
  const storageKeys = getStorageKeys(userInfo.id || 'anonymous');
  
  const [chatData, setChatData] = useState<ChatData>(() => {
    const savedSessions = localStorageUtils.load(storageKeys.CHAT_SESSIONS, mockSessions);
    const savedCurrentSession = localStorageUtils.load(storageKeys.CURRENT_SESSION, null);
    
    const initialData = {
      currentSession: savedCurrentSession || savedSessions.find(s => s.isActive) || null,
      sessions: savedSessions,
      userInfo: {
        id: '1',
        name: userInfo.name,
        email: userInfo.email,
        avatar: userInfo.avatar,
        plan: userInfo.plan,
        tokensRemaining: userInfo.tokensRemaining,
        tokensResetTime: '19 hours',
        dailyTokenLimit: userInfo.plan === 'Premium' ? 1000 : 
                        userInfo.plan === 'Admin' ? 9999 : 100
      },
      isLoading: false,
      error: null
    };
    
    return initialData;
  });

  const [newMessage, setNewMessage] = useState<string>('');
  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [activeConnection, setActiveConnection] = useState<unknown>(null);
  const [pendingConfirmation, setPendingConfirmation] = useState<{
    sql: string;
    type: 'update' | 'delete';
    affectedRecords: Record<string, unknown>[];
    affectedCount: number;
  } | null>(null);

  const [completedActions, setCompletedActions] = useState<Set<string>>(new Set());
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState<string>('');
  const [showActionModal, setShowActionModal] = useState<string | null>(null);

  const clearChatData = useCallback(() => {
    localStorageUtils.remove(storageKeys.CHAT_SESSIONS);
    localStorageUtils.remove(storageKeys.CURRENT_SESSION);
    localStorageUtils.remove(storageKeys.USER_INFO);
  }, [storageKeys]);

  const clearAllChatData = useCallback(() => {
    const allKeys = Object.keys(localStorage);
    
    allKeys.forEach(key => {
      if (key.startsWith('gatherlake_')) {
        localStorage.removeItem(key);
      }
    });
    
    const sessionKeys = Object.keys(sessionStorage);
    sessionKeys.forEach(key => {
      if (key.startsWith('gatherlake_')) {
        sessionStorage.removeItem(key);
      }
    });
  }, []);

  const clearOtherUsersData = useCallback(() => {
    const allKeys = Object.keys(localStorage);
    const currentUserId = userInfo.id || 'anonymous';
    
    allKeys.forEach(key => {
      if (key.startsWith('gatherlake_')) {
        if (!key.includes(currentUserId)) {
          localStorage.removeItem(key);
        }
      }
    });
    
    const sessionKeys = Object.keys(sessionStorage);
    sessionKeys.forEach(key => {
      if (key.startsWith('gatherlake_') && !key.includes(currentUserId)) {
        sessionStorage.removeItem(key);
      }
    });
  }, [userInfo.id]);

  const recoverChatData = useCallback(() => {
    try {
      const savedSessions = localStorageUtils.load(storageKeys.CHAT_SESSIONS, mockSessions);
      const savedCurrentSession = localStorageUtils.load(storageKeys.CURRENT_SESSION, null);
      
      const validSessions = Array.isArray(savedSessions) ? savedSessions : mockSessions;
      const validCurrentSession = savedCurrentSession && typeof savedCurrentSession === 'object' ? savedCurrentSession : null;
      
      setChatData(prev => ({
        ...prev,
        currentSession: validCurrentSession || validSessions.find(s => s.isActive) || null,
        sessions: validSessions,
        isLoading: false,
        error: null
      }));
    } catch (error) {
      console.error('Error recovering chat data:', error);
      setChatData(prev => ({
        ...prev,
        currentSession: mockSessions.find(s => s.isActive) || null,
        sessions: mockSessions,
        isLoading: false,
        error: null
      }));
    }
  }, [storageKeys]);

  const addMessageToCurrentSession = useCallback((message: ChatMessage) => {
    try {
      setChatData(prev => {
        if (!prev.currentSession) {
          return prev;
        }
        
        const messageExists = prev.currentSession.messages.some(
          existingMessage => existingMessage.id === message.id
        );
        
        if (messageExists) {
          return prev;
        }
        
        const updatedCurrentSession = {
          ...prev.currentSession,
          messages: [...prev.currentSession.messages, message]
        };
        
        const updatedSessions = prev.sessions.map(session =>
          session.id === prev.currentSession.id
            ? updatedCurrentSession
            : session
        );
        
        return {
          ...prev,
          currentSession: updatedCurrentSession,
          sessions: updatedSessions
        };
      });
    } catch (error) {
      console.error('Error adding message to current session:', error);
    }
  }, []);

  const updateActiveConnection = useCallback(async () => {
    try {
      const response = await axios.get('/api/connections/active');
      if (response.data.connection) {
        setActiveConnection(response.data.connection);
      } else {
        setActiveConnection(null);
      }
    } catch (error) {
      setActiveConnection(null);
    }
  }, []);

  const cleanDuplicateMessages = useCallback(() => {
    setChatData(prev => {
      if (!prev.currentSession) return prev;
      
      const messages = prev.currentSession.messages;
      const uniqueMessages = messages.filter((message, index, self) => 
        index === self.findIndex(m => m.id === message.id)
      );
      
      if (uniqueMessages.length !== messages.length) {
        const updatedCurrentSession = {
          ...prev.currentSession,
          messages: uniqueMessages
        };
        
        const updatedSessions = prev.sessions.map(session =>
          session.id === prev.currentSession.id
            ? updatedCurrentSession
            : session
        );
        
        return {
          ...prev,
          currentSession: updatedCurrentSession,
          sessions: updatedSessions
        };
      }
      
      return prev;
    });
  }, []);

  useEffect(() => {
    if (!chatData.isLoading) {
      localStorageUtils.save(storageKeys.CHAT_SESSIONS, chatData.sessions);
      if (chatData.currentSession) {
        localStorageUtils.save(storageKeys.CURRENT_SESSION, chatData.currentSession);
      }
    }
  }, [chatData, storageKeys, userInfo.id]);

  useEffect(() => {
    if (chatData.currentSession && chatData.currentSession.messages.length > 0) {
      const messages = chatData.currentSession.messages;
      const uniqueIds = new Set(messages.map(m => m.id));
      
      if (uniqueIds.size !== messages.length) {
        cleanDuplicateMessages();
      }
    }
  }, [chatData.currentSession?.messages.length, cleanDuplicateMessages]);

  useEffect(() => {
    clearOtherUsersData();
  }, []);

  useEffect(() => {
    const loadChatData = async () => {
      try {
        setChatData(prev => ({
          ...prev,
          isLoading: false,
          error: null
        }));

        try {
          const response = await axios.get('/api/connections/active');
          
          if (response.data.connection) {
            setActiveConnection(response.data.connection);
          } else {
            setActiveConnection(null);
          }
        } catch (error) {
          setActiveConnection(null);
        }
      } catch (error) {
        console.error('Error in loadChatData:', error);
        setChatData(prev => ({
          ...prev,
          isLoading: false,
          error: 'Failed to load chat data'
        }));
      }
    };

    loadChatData();
  }, []);

  useEffect(() => {
    if (!userInfo.id) return;
    
    clearOtherUsersData();
    
    clearChatData();
    
    const newStorageKeys = getStorageKeys(userInfo.id);
    const savedSessions = localStorageUtils.load(newStorageKeys.CHAT_SESSIONS, mockSessions);
    const savedCurrentSession = localStorageUtils.load(newStorageKeys.CURRENT_SESSION, null);
    
    setChatData({
      currentSession: savedCurrentSession || savedSessions.find(s => s.isActive) || null,
      sessions: savedSessions,
      userInfo: {
        id: userInfo.id,
        name: userInfo.name,
        email: userInfo.email,
        avatar: userInfo.avatar,
        plan: userInfo.plan,
        tokensRemaining: userInfo.tokensRemaining,
        tokensResetTime: '19 hours',
        dailyTokenLimit: userInfo.plan === 'Free' ? 200 : 
                        userInfo.plan === 'Admin' ? 9999 : 100
      },
      isLoading: false,
      error: null
    });
    
    setNewMessage('');
    setShowProfileModal(false);
    setIsProcessing(false);
    setActiveConnection(null);
    setPendingConfirmation(null);
    setCompletedActions(new Set());
    setEditingSessionId(null);
    setEditingTitle('');
    setShowActionModal(null);
    
  }, [userInfo.id, clearOtherUsersData, clearChatData]);

  const sendMessage = useCallback(async (message: string) => {
    if (!message.trim()) return;

    const uniqueId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const userMessage: ChatMessage = {
      id: uniqueId,
      content: message,
      author: 'user',
      timestamp: new Date().toISOString()
    };

    addMessageToCurrentSession(userMessage);

    setNewMessage('');
    setIsProcessing(true);

    if (!activeConnection) {
      const noConnectionMessage: ChatMessage = {
        id: `${Date.now()}_no_connection_${Math.random().toString(36).substr(2, 9)}`,
        content: `No hay conexiones de base de datos configuradas

Para usar el asistente SQL, necesitas crear al menos una conexión a una base de datos.

Pasos para configurar:

1. Ve a Conexiones en el sidebar izquierdo
2. Haz clic en "Nueva Conexión"
3. Configura los datos de tu base de datos:
   • Tipo de base de datos (MySQL, PostgreSQL, etc.)
   • Host y puerto
   • Nombre de la base de datos
   • Usuario y contraseña
4. Activa la conexión una vez configurada

Después de configurar:
Podrás hacer consultas SQL en lenguaje natural y el asistente te ayudará a generar consultas automáticamente.

Acceso directo: Ir a Conexiones`,
        author: 'bot',
        timestamp: new Date().toISOString(),
        isSpecialMessage: true
      };

        addMessageToCurrentSession(noConnectionMessage);

        setIsProcessing(false);
        return;
      }

    try {
      const response = await axios.post('/api/nl2sql', {
        query: message
      }, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      let botResponse: ChatMessage;

      if (response.data.pendingQuery) {
        const { sql, type, affectedRecords, affectedCount } = response.data.pendingQuery;
        
        setPendingConfirmation({ sql, type, affectedRecords, affectedCount });
        
        botResponse = {
          id: (Date.now() + 1).toString(),
          content: `⚠️ **Consulta ${type.toUpperCase()} que requiere confirmación**

**SQL generado:**
\`\`\`sql
${sql}
\`\`\`

**Registros que se verán afectados:** ${affectedCount}

**Detalles de los registros:**
${affectedRecords.map((record: Record<string, unknown>, index: number) => 
  `${index + 1}. ${JSON.stringify(record, null, 2)}`
).join('\n')}

**Para confirmar:** Escribe "sí", "confirmar" o "aceptar"
**Para cancelar:** Escribe "no" o "cancelar"`,
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
        const result = response.data.result;
        
        if (result.type === 'select' && result.data && Array.isArray(result.data)) {
          const tableData = result.data;
          const columns = tableData.length > 0 ? Object.keys(tableData[0]) : [];
          
          const tableContent = `📊 **Consulta SELECT ejecutada exitosamente**

**SQL generado:**
\`\`\`sql
${result.sql}
\`\`\`

**Resultados (${tableData.length} registros):**
\`\`\`
${columns.join(' | ')}
${'-'.repeat(columns.join(' | ').length)}
${tableData.map((row: Record<string, unknown>) => 
  columns.map(col => row[col] || '').join(' | ')
).join('\n')}
\`\`\``;
          
          botResponse = {
            id: (Date.now() + 1).toString(),
            content: tableContent,
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
            content: `✅ **Consulta ${result.type.toUpperCase()} ejecutada exitosamente**

**SQL generado:**
\`\`\`sql
${result.sql}
\`\`\`

**Filas afectadas:** ${result.affected_rows || 0}`,
          author: 'bot',
          timestamp: new Date().toISOString(),
          responseData: {
            type: result.type,
            sql: result.sql,
            data: result.data,
            affectedRows: result.affected_rows
          }
        };
        }
      } else if (response.data.success) {
        botResponse = {
          id: (Date.now() + 1).toString(),
          content: `✅ **${response.data.success}`,
          author: 'bot',
          timestamp: new Date().toISOString()
        };
      } else {
        botResponse = {
          id: (Date.now() + 1).toString(),
          content: `✅ **Consulta procesada correctamente.**

La consulta se ejecutó sin problemas.`,
          author: 'bot',
          timestamp: new Date().toISOString()
        };
      }

      addMessageToCurrentSession(botResponse);

    } catch (error: unknown) {
      console.error('Error sending message:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Error al procesar la consulta.';
      
      const botResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: `❌ **Error:** ${errorMessage}`,
        author: 'bot',
        timestamp: new Date().toISOString()
      };

      addMessageToCurrentSession(botResponse);
    } finally {
      setIsProcessing(false);
    }
  }, [activeConnection, pendingConfirmation]);

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

    setChatData(prev => {
      const updatedSessions = [newSession, ...prev.sessions.map(session => ({ ...session, isActive: false }))];
      return {
        ...prev,
        currentSession: newSession,
        sessions: updatedSessions
      };
    });
  }, []);

  const switchSession = useCallback((sessionId: string) => {
    setChatData(prev => {
      const updatedSessions = prev.sessions.map(session => ({
        ...session,
        isActive: session.id === sessionId
      }));
      const newCurrentSession = updatedSessions.find(session => session.id === sessionId) || null;
      
      return {
        ...prev,
        currentSession: newCurrentSession,
        sessions: updatedSessions
      };
    });
    
    setNewMessage('');
    setEditingSessionId(null);
    setEditingTitle('');
    setShowActionModal(null);
  }, []);

  const updateSessionTitle = useCallback((sessionId: string, newTitle: string) => {
    setChatData(prev => {
      const updatedSessions = prev.sessions.map(session => 
        session.id === sessionId 
          ? { ...session, title: newTitle, updatedAt: new Date().toISOString() }
          : session
      );
      const updatedCurrentSession = prev.currentSession?.id === sessionId 
        ? { ...prev.currentSession, title: newTitle, updatedAt: new Date().toISOString() }
        : prev.currentSession;
      
      return {
        ...prev,
        sessions: updatedSessions,
        currentSession: updatedCurrentSession
      };
    });
    setEditingSessionId(null);
  }, []);

  const deleteSession = useCallback((sessionId: string) => {
    setChatData(prev => {
      const updatedSessions = prev.sessions.filter(session => session.id !== sessionId);
      const newCurrentSession = prev.currentSession?.id === sessionId 
        ? (updatedSessions[0] || null)
        : prev.currentSession;

      const finalSessions = updatedSessions.map((session, index) => 
        index === 0 ? { ...session, isActive: true } : { ...session, isActive: false }
      );

      return {
        ...prev,
        currentSession: newCurrentSession,
        sessions: finalSessions
      };
    });
    setShowActionModal(null);
  }, []);

  const showSessionActions = useCallback((sessionId: string) => {
    setShowActionModal(sessionId);
  }, []);

  const hideSessionActions = useCallback(() => {
    setShowActionModal(null);
  }, []);

  const startEditingSession = useCallback((sessionId: string) => {
    const session = chatData.sessions.find(s => s.id === sessionId);
    setEditingSessionId(sessionId);
    setEditingTitle(session?.title || '');
    setShowActionModal(null);
  }, [chatData.sessions]);

  const saveSessionTitle = useCallback((sessionId: string) => {
    if (editingTitle.trim()) {
      updateSessionTitle(sessionId, editingTitle.trim());
    }
    setEditingSessionId(null);
    setEditingTitle('');
  }, [editingTitle, updateSessionTitle]);

  const cancelEditingSession = useCallback(() => {
    setEditingSessionId(null);
    setEditingTitle('');
  }, []);

  const handleConfirmAction = useCallback(async () => {
    if (!pendingConfirmation) return;

    setIsProcessing(true);
    try {
      const response = await axios.post('/api/nl2sql/confirm', {
        sql: pendingConfirmation.sql,
        type: pendingConfirmation.type
      }, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (response.data.result) {
        const result = response.data.result;
        const botResponse: ChatMessage = {
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
      }

      setCompletedActions(prev => new Set(prev).add(pendingConfirmation.sql));
      setPendingConfirmation(null);
    } catch (error: unknown) {
      console.error('Error confirming action:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Error al confirmar la acción.';
      
      const botResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: `❌ **Error:** ${errorMessage}`,
        author: 'bot',
        timestamp: new Date().toISOString()
      };

      addMessageToCurrentSession(botResponse);
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

    addMessageToCurrentSession(botResponse);

    setCompletedActions(prev => new Set(prev).add(pendingConfirmation.sql));
    setPendingConfirmation(null);
  }, [pendingConfirmation]);

  return {
    chatData,
    newMessage,
    setNewMessage,
    sendMessage,
    isProcessing,
    pendingConfirmation,
    handleConfirmAction,
    handleCancelAction,
    completedActions,
    showProfileModal,
    setShowProfileModal,
    createNewSession,
    switchSession,
    updateSessionTitle,
    deleteSession,
    showSessionActions,
    hideSessionActions,
    startEditingSession,
    saveSessionTitle,
    cancelEditingSession,
    editingSessionId,
    editingTitle,
    setEditingTitle,
    showActionModal,
    updateActiveConnection,
    clearChatData,
    clearAllChatData,
    clearOtherUsersData,
    cleanDuplicateMessages
  };
}