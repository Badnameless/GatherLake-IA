import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { ChatMessage, ChatSession, UserInfo, ChatData } from '../types/chat';

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

// Mock sessions for development
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

export function useChat() {
  const [chatData, setChatData] = useState<ChatData>({
    currentSession: null,
    sessions: [],
    userInfo: mockUserInfo,
    isLoading: true,
    error: null
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
  }, []);

  // Send message with NL2SQL functionality
  const sendMessage = useCallback(async (message: string) => {
    if (!message.trim()) return;

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

    // Verificar si hay conexiones activas
    if (!activeConnection) {
      const noConnectionMessage: ChatMessage = {
        id: Date.now().toString(),
        content: `🚫 **No hay conexiones de base de datos configuradas**

Para usar el asistente SQL, necesitas crear al menos una conexión a una base de datos.

**📋 Pasos para configurar:**

1. **Ve a Conexiones** en el sidebar izquierdo
2. **Haz clic en "Nueva Conexión"**
3. **Configura los datos** de tu base de datos:
   • Tipo de base de datos (MySQL, PostgreSQL, etc.)
   • Host y puerto
   • Nombre de la base de datos
   • Usuario y contraseña
4. **Activa la conexión** una vez configurada

**✅ Después de configurar:**
Podrás hacer consultas SQL en lenguaje natural y el asistente te ayudará a generar consultas automáticamente.

**🔗 Acceso directo:** [Ir a Conexiones](/connections)`,
        author: 'bot',
        timestamp: new Date().toISOString(),
        isSpecialMessage: true // Marca especial para renderizar como card
      };

      setChatData(prev => {
        if (!prev.currentSession) return prev;
        return {
          ...prev,
          currentSession: {
            ...prev.currentSession,
            messages: [...prev.currentSession.messages, noConnectionMessage]
          }
        };
      });

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

    } catch (error: unknown) {
      console.error('Error sending message:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Error al procesar la consulta.';
      
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
    showActionModal
  };
}