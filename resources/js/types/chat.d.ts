export interface ChatMessage {
  id: string;
  content: string;
  author: 'user' | 'bot';
  timestamp: string;
  isSpecialMessage?: boolean; // Para mensajes especiales que se renderizan como cards
  responseData?: {
    type: 'select' | 'insert' | 'update' | 'delete' | 'pending';
    sql: string;
    data?: any[];
    affectedRows?: number;
    affectedRecords?: any[];
    affectedCount?: number;
  };
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
  isActive?: boolean;
}

export interface UserInfo {
  id: string;
  name: string;
  email: string;
  avatar: string;
  plan: 'Guest' | 'Premium' | 'Free' | 'Pro' | 'Enterprise';
  tokensRemaining: number;
  tokensResetTime: string;
  dailyTokenLimit: number;
}

export interface ChatData {
  currentSession: ChatSession | null;
  sessions: ChatSession[];
  userInfo: UserInfo;
  isLoading: boolean;
  error: string | null;
} 