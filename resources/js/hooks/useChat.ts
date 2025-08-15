import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { ChatMessage, ChatSession, UserInfo, ChatData } from '../types/chat';
import { useAuth } from './useAuth';

// Mock sessions for development (fallback)
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

// LocalStorage keys - now user-specific
const getStorageKeys = (userId: string) => ({
  CHAT_SESSIONS: `gatherlake_chat_sessions_${userId}`,
  CURRENT_SESSION: `gatherlake_current_session_${userId}`,
  USER_INFO: `gatherlake_user_info_${userId}`
});

// LocalStorage utilities
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
  
  // Get user-specific storage keys
  const storageKeys = getStorageKeys(userInfo.id || 'anonymous');
  
  const [chatData, setChatData] = useState<ChatData>(() => {
    // Load initial data from localStorage or use defaults
    const savedSessions = localStorageUtils.load(storageKeys.CHAT_SESSIONS, mockSessions);
    const savedCurrentSession = localStorageUtils.load(storageKeys.CURRENT_SESSION, null);
    
    return {
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
        dailyTokenLimit: userInfo.plan === 'Free' ? 200 : 
                        userInfo.plan === 'Premium' ? 1000 : 
                        userInfo.plan === 'Admin' ? 9999 : 100
      },
      isLoading: true,
      error: null
    };
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

  // Helper function to update chatData with new message
  const addMessageToCurrentSession = useCallback((message: ChatMessage) => {
    setChatData(prev => {
      if (!prev.currentSession) return prev;
      
      // Check if message already exists to prevent duplication
      const messageExists = prev.currentSession.messages.some(
        existingMessage => existingMessage.id === message.id
      );
      
      if (messageExists) {
        console.log('Message already exists, skipping:', message.id);
        return prev; // Don't update if message already exists
      }
      
      console.log('Adding new message to session:', {
        sessionId: prev.currentSession.id,
        messageId: message.id,
        messageContent: message.content.substring(0, 50) + '...',
        totalMessages: prev.currentSession.messages.length + 1
      });
      
      // Update current session with new message
      const updatedCurrentSession = {
        ...prev.currentSession,
        messages: [...prev.currentSession.messages, message]
      };
      
      // Update the session in the sessions array as well
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
  }, []);

  // Función para actualizar la conexión activa
  const updateActiveConnection = useCallback(async () => {
    try {
      const response = await axios.get('/api/connections/active');
      if (response.data.connection) {
        setActiveConnection(response.data.connection);
      } else {
        setActiveConnection(null);
      }
    } catch (error) {
      console.error('Error actualizando conexión activa:', error);
      setActiveConnection(null);
    }
  }, []);

  // Function to clean duplicate messages in current session
  const cleanDuplicateMessages = useCallback(() => {
    setChatData(prev => {
      if (!prev.currentSession) return prev;
      
      const messages = prev.currentSession.messages;
      const uniqueMessages = messages.filter((message, index, self) => 
        index === self.findIndex(m => m.id === message.id)
      );
      
      if (uniqueMessages.length !== messages.length) {
        console.log('Cleaned duplicate messages:', {
          before: messages.length,
          after: uniqueMessages.length,
          removed: messages.length - uniqueMessages.length
        });
        
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

  // Auto-save to localStorage whenever chatData changes
  useEffect(() => {
    if (!chatData.isLoading) {
      localStorageUtils.save(storageKeys.CHAT_SESSIONS, chatData.sessions);
      if (chatData.currentSession) {
        localStorageUtils.save(storageKeys.CURRENT_SESSION, chatData.currentSession);
      }
      
      console.log('Chat data saved to localStorage for user:', {
        userId: userInfo.id,
        sessions: chatData.sessions.length,
        currentSession: chatData.currentSession?.id
      });
    }
  }, [chatData, storageKeys, userInfo.id]);

  // Auto-clean duplicate messages when detected
  useEffect(() => {
    if (chatData.currentSession && chatData.currentSession.messages.length > 0) {
      const messages = chatData.currentSession.messages;
      const uniqueIds = new Set(messages.map(m => m.id));
      
      if (uniqueIds.size !== messages.length) {
        console.log('Duplicate messages detected, cleaning...');
        cleanDuplicateMessages();
      }
    }
  }, [chatData.currentSession?.messages.length, cleanDuplicateMessages]);

  // Clear other users data on initial mount
  useEffect(() => {
    console.log('Initial mount - clearing other users data...');
    clearOtherUsersData();
  }, []); // Solo se ejecuta una vez al montar el componente

  // Load initial data and active connection
  useEffect(() => {
    const loadChatData = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Data is already loaded from localStorage in the initial state
        setChatData(prev => ({
          ...prev,
          isLoading: false,
          error: null
        }));

        // Get active connection only once on mount
        try {
          console.log('Intentando obtener conexión activa...');
          const response = await axios.get('/api/connections/active');
          console.log('Respuesta de conexión activa:', response);
          console.log('Datos de conexión activa:', response.data);
          console.log('Conexión activa:', response.data.connection);
          
          if (response.data.connection) {
            setActiveConnection(response.data.connection);
            console.log('Conexión activa establecida:', response.data.connection);
          } else {
            console.log('No hay conexión activa en la respuesta');
            setActiveConnection(null);
          }
        } catch (error) {
          console.error('Error obteniendo conexión activa:', error);
          if (axios.isAxiosError(error)) {
            console.error('Error de Axios:', error.response?.data);
            console.error('Status:', error.response?.status);
            console.error('Headers:', error.response?.headers);
          }
          setActiveConnection(null);
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
  }, []); // Solo se ejecuta una vez al montar el componente

  // Clear other users data and reload when user changes
  useEffect(() => {
    console.log('User changed, clearing other users data and reloading...');
    
    // Clear data from other users for security
    clearOtherUsersData();
    
    // Clear current chat data
    clearChatData();
    
    // Reset to initial state with new user data
    const newStorageKeys = getStorageKeys(userInfo.id || 'anonymous');
    const savedSessions = localStorageUtils.load(newStorageKeys.CHAT_SESSIONS, mockSessions);
    const savedCurrentSession = localStorageUtils.load(newStorageKeys.CURRENT_SESSION, null);
    
    setChatData({
      currentSession: savedCurrentSession || savedSessions.find(s => s.isActive) || null,
      sessions: savedSessions,
      userInfo: {
        id: userInfo.id || '1',
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
    
    // Reset other states
    setNewMessage('');
    setShowProfileModal(false);
    setIsProcessing(false);
    setActiveConnection(null);
    setPendingConfirmation(null);
    setCompletedActions(new Set());
    setEditingSessionId(null);
    setEditingTitle('');
    setShowActionModal(null);
    
  }, [userInfo.id]); // Se ejecuta cuando cambia el ID del usuario

  // Send message with NL2SQL functionality
  const sendMessage = useCallback(async (message: string) => {
    if (!message.trim()) return;

    // Generate a more unique ID using timestamp + random number
    const uniqueId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const userMessage: ChatMessage = {
      id: uniqueId,
      content: message,
      author: 'user',
      timestamp: new Date().toISOString()
    };

    console.log('Sending user message:', {
      messageId: uniqueId,
      content: message.substring(0, 50) + '...',
      sessionId: chatData.currentSession?.id,
      currentMessagesCount: chatData.currentSession?.messages.length || 0
    });

    addMessageToCurrentSession(userMessage);

    setNewMessage('');
    setIsProcessing(true);

    // Verificar si hay conexiones activas
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
        isSpecialMessage: true // Marca especial para renderizar como card
      };

        addMessageToCurrentSession(noConnectionMessage);

        setIsProcessing(false);
        return;
      }

    try {
      // Send to NL2SQL API (no need to send connection_id anymore)
      const response = await axios.post('/api/nl2sql', {
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
        // Handle structured results (SELECT, UPDATE, DELETE, INSERT)
        const result = response.data.result;
        
        if (result.type === 'select' && result.data && Array.isArray(result.data)) {
          // Para consultas SELECT, mostrar los datos en formato tabla
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
          // Para otras consultas (INSERT, UPDATE, DELETE)
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
        // Handle success messages
        botResponse = {
          id: (Date.now() + 1).toString(),
          content: `✅ **${response.data.success}`,
          author: 'bot',
          timestamp: new Date().toISOString()
        };
      } else {
        // Handle other responses
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

    setChatData(prev => {
      const updatedSessions = [newSession, ...prev.sessions.map(session => ({ ...session, isActive: false }))];
      return {
        ...prev,
        currentSession: newSession,
        sessions: updatedSessions
      };
    });
  }, []);

  // Switch to different session
  const switchSession = useCallback((sessionId: string) => {
    console.log('Switching to session:', sessionId);
    
    setChatData(prev => {
      const updatedSessions = prev.sessions.map(session => ({
        ...session,
        isActive: session.id === sessionId
      }));
      const newCurrentSession = updatedSessions.find(session => session.id === sessionId) || null;
      
      console.log('Session switch completed:', {
        fromSessionId: prev.currentSession?.id,
        toSessionId: sessionId,
        newSessionMessagesCount: newCurrentSession?.messages.length || 0,
        allSessionsCount: updatedSessions.length
      });
      
      return {
        ...prev,
        currentSession: newCurrentSession,
        sessions: updatedSessions
      };
    });
    
    // Clear any pending states when switching sessions
    setNewMessage('');
    setEditingSessionId(null);
    setEditingTitle('');
    setShowActionModal(null);
  }, []);

  // Update session title
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

  // Delete session
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

      // Mark the pending confirmation as completed
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

    // Mark the pending confirmation as completed
    setCompletedActions(prev => new Set(prev).add(pendingConfirmation.sql));
    setPendingConfirmation(null);
  }, [pendingConfirmation]);

  // Function to clear localStorage (useful for logout or reset)
  const clearChatData = useCallback(() => {
    localStorageUtils.remove(storageKeys.CHAT_SESSIONS);
    localStorageUtils.remove(storageKeys.CURRENT_SESSION);
    localStorageUtils.remove(storageKeys.USER_INFO);
    
    console.log('Cleared chat data for current user');
  }, [storageKeys]);

  // Function to clear ALL chat data (for logout)
  const clearAllChatData = useCallback(() => {
    // Get all localStorage keys
    const allKeys = Object.keys(localStorage);
    
    // Remove all gatherlake keys
    allKeys.forEach(key => {
      if (key.startsWith('gatherlake_')) {
        localStorage.removeItem(key);
        console.log('Removed all chat data:', key);
      }
    });
    
    // Also clear sessionStorage
    const sessionKeys = Object.keys(sessionStorage);
    sessionKeys.forEach(key => {
      if (key.startsWith('gatherlake_')) {
        sessionStorage.removeItem(key);
        console.log('Removed session chat data:', key);
      }
    });
    
    console.log('Cleared ALL chat data from localStorage and sessionStorage');
  }, []);

  // Function to clear data from other users (security measure)
  const clearOtherUsersData = useCallback(() => {
    // Get all localStorage keys
    const allKeys = Object.keys(localStorage);
    const currentUserId = userInfo.id || 'anonymous';
    
    console.log('Clearing other users data. Current user ID:', currentUserId);
    console.log('All localStorage keys:', allKeys);
    
    // Find and remove keys from other users
    let removedCount = 0;
    allKeys.forEach(key => {
      if (key.startsWith('gatherlake_')) {
        if (!key.includes(currentUserId)) {
          localStorage.removeItem(key);
          console.log('Removed data from other user:', key);
          removedCount++;
        } else {
          console.log('Keeping data for current user:', key);
        }
      }
    });
    
    console.log(`Cleared ${removedCount} keys from other users`);
    
    // Also clear any sessionStorage that might exist
    const sessionKeys = Object.keys(sessionStorage);
    sessionKeys.forEach(key => {
      if (key.startsWith('gatherlake_') && !key.includes(currentUserId)) {
        sessionStorage.removeItem(key);
        console.log('Removed session data from other user:', key);
      }
    });
  }, [userInfo.id]);

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
    updateActiveConnection, // Función para actualizar conexión activa
    clearChatData, // Función para limpiar datos del chat
    clearAllChatData, // Función para limpiar TODOS los datos del chat
    clearOtherUsersData, // Función para limpiar datos de otros usuarios
    cleanDuplicateMessages // Función para limpiar mensajes duplicados
  };
}