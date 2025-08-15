import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { 
  Bell, 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  XCircle, 
  Settings, 
  Trash2, 
  Eye,
  EyeOff,
  Filter,
  Search
} from 'lucide-react';
import { useChat } from '../hooks/useChat';
import FrontendLayout from '../components/FrontendLayout';

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  category: 'system' | 'user' | 'database' | 'security';
}

export default function Notifications() {
  const { chatData } = useChat();
  const { userInfo } = chatData;
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const handleLogout = () => {
    window.location.href = '/logout';
  };

  // Mock data - en una implementación real esto vendría de una API
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'success',
      title: 'Conexión establecida',
      message: 'Se ha establecido exitosamente la conexión a la base de datos MySQL.',
      timestamp: '2025-01-28T10:30:00Z',
      isRead: false,
      category: 'database'
    },
    {
      id: '2',
      type: 'info',
      title: 'Actualización del sistema',
      message: 'Se ha completado la actualización automática del sistema a la versión 2.1.0.',
      timestamp: '2025-01-28T09:15:00Z',
      isRead: false,
      category: 'system'
    },
    {
      id: '3',
      type: 'warning',
      title: 'Límite de tokens cercano',
      message: 'Te quedan menos de 50 tokens para este mes. Considera actualizar tu plan.',
      timestamp: '2025-01-28T08:45:00Z',
      isRead: true,
      category: 'user'
    },
    {
      id: '4',
      type: 'error',
      title: 'Error de conexión',
      message: 'No se pudo establecer la conexión a la base de datos PostgreSQL.',
      timestamp: '2025-01-28T07:30:00Z',
      isRead: true,
      category: 'database'
    },
    {
      id: '5',
      type: 'success',
      title: 'Consulta ejecutada',
      message: 'La consulta SQL se ha ejecutado correctamente. 1,247 registros procesados.',
      timestamp: '2025-01-28T06:20:00Z',
      isRead: true,
      category: 'database'
    },
    {
      id: '6',
      type: 'info',
      title: 'Nuevo usuario registrado',
      message: 'Se ha registrado un nuevo usuario en el sistema: maria.garcia@email.com',
      timestamp: '2025-01-28T05:10:00Z',
      isRead: false,
      category: 'user'
    },
    {
      id: '7',
      type: 'warning',
      title: 'Backup programado',
      message: 'El backup automático de la base de datos se ejecutará en 30 minutos.',
      timestamp: '2025-01-28T04:00:00Z',
      isRead: true,
      category: 'system'
    },
    {
      id: '8',
      type: 'success',
      title: 'Plan actualizado',
      message: 'Tu plan ha sido actualizado exitosamente a Premium. Disfruta de todas las funcionalidades.',
      timestamp: '2025-01-28T03:30:00Z',
      isRead: false,
      category: 'user'
    }
  ]);

  const getTypeIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5" style={{ color: 'var(--techwave-success-color)' }} />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5" style={{ color: 'var(--techwave-warning-color)' }} />;
      case 'error':
        return <XCircle className="h-5 w-5" style={{ color: 'var(--techwave-error-color)' }} />;
      case 'info':
        return <Info className="h-5 w-5" style={{ color: 'var(--techwave-info-color)' }} />;
      default:
        return <Info className="h-5 w-5" style={{ color: 'var(--techwave-body-color)' }} />;
    }
  };

  const getTypeColor = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'var(--techwave-success-color)';
      case 'warning':
        return 'var(--techwave-warning-color)';
      case 'error':
        return 'var(--techwave-error-color)';
      case 'info':
        return 'var(--techwave-info-color)';
      default:
        return 'var(--techwave-body-color)';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'system':
        return 'var(--techwave-main-color)';
      case 'user':
        return 'var(--techwave-success-color)';
      case 'database':
        return 'var(--techwave-warning-color)';
      case 'security':
        return 'var(--techwave-error-color)';
      default:
        return 'var(--techwave-body-color)';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Ahora mismo';
    if (diffInMinutes < 60) return `Hace ${diffInMinutes} min`;
    if (diffInMinutes < 1440) return `Hace ${Math.floor(diffInMinutes / 60)}h`;
    return date.toLocaleDateString('es-ES');
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, isRead: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  // Filtrar notificaciones
  const filteredNotifications = notifications.filter(notification => {
    const matchesFilter = filter === 'all' || 
      (filter === 'unread' && !notification.isRead) ||
      (filter === 'read' && notification.isRead);
    
    const matchesCategory = categoryFilter === 'all' || notification.category === categoryFilter;
    
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesCategory && matchesSearch;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const totalCount = notifications.length;

  return (
    <>
      <Head title="Notificaciones - GatherLake AI" />
      
      <FrontendLayout userInfo={userInfo} activePage="notifications" onLogout={handleLogout}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold" style={{ color: 'var(--techwave-heading-color)' }}>
                  Notificaciones
                </h1>
                <p className="mt-2" style={{ color: 'var(--techwave-body-color)' }}>
                  Mantente al día con todas las actividades de tu cuenta
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={markAllAsRead}
                  className="inline-flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200"
                  style={{ 
                    backgroundColor: 'var(--techwave-some-a-bg-color)',
                    color: 'var(--techwave-heading-color)',
                    border: '1px solid var(--techwave-border-color)'
                  }}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Marcar todo como leído
                </button>
                <button
                  onClick={clearAll}
                  className="inline-flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200"
                  style={{ 
                    backgroundColor: 'var(--techwave-error-color)',
                    color: 'white'
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Limpiar todo
                </button>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="rounded-2xl p-6" style={{ backgroundColor: 'var(--techwave-some-r-bg-color)', border: '1px solid var(--techwave-border-color)' }}>
              <div className="flex items-center">
                <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--techwave-some-a-bg-color)' }}>
                  <Bell className="h-6 w-6" style={{ color: 'var(--techwave-main-color)' }} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium" style={{ color: 'var(--techwave-body-color)' }}>Total</p>
                  <p className="text-2xl font-bold" style={{ color: 'var(--techwave-heading-color)' }}>{totalCount}</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl p-6" style={{ backgroundColor: 'var(--techwave-some-r-bg-color)', border: '1px solid var(--techwave-border-color)' }}>
              <div className="flex items-center">
                <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--techwave-some-a-bg-color)' }}>
                  <Eye className="h-6 w-6" style={{ color: 'var(--techwave-warning-color)' }} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium" style={{ color: 'var(--techwave-body-color)' }}>No leídas</p>
                  <p className="text-2xl font-bold" style={{ color: 'var(--techwave-heading-color)' }}>{unreadCount}</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl p-6" style={{ backgroundColor: 'var(--techwave-some-r-bg-color)', border: '1px solid var(--techwave-border-color)' }}>
              <div className="flex items-center">
                <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--techwave-some-a-bg-color)' }}>
                  <CheckCircle className="h-6 w-6" style={{ color: 'var(--techwave-success-color)' }} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium" style={{ color: 'var(--techwave-body-color)' }}>Leídas</p>
                  <p className="text-2xl font-bold" style={{ color: 'var(--techwave-heading-color)' }}>{totalCount - unreadCount}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="mb-6">
            <div className="rounded-2xl p-6" style={{ backgroundColor: 'var(--techwave-some-r-bg-color)', border: '1px solid var(--techwave-border-color)' }}>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" style={{ color: 'var(--techwave-body-color)' }} />
                  <input
                    type="text"
                    placeholder="Buscar notificaciones..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
                    style={{
                      backgroundColor: 'var(--techwave-some-a-bg-color)',
                      borderColor: 'var(--techwave-border-color)',
                      color: 'var(--techwave-heading-color)',
                      '--tw-ring-color': 'var(--techwave-main-color)'
                    } as React.CSSProperties}
                  />
                </div>

                {/* Type Filter */}
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as 'all' | 'unread' | 'read')}
                  className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: 'var(--techwave-some-a-bg-color)',
                    borderColor: 'var(--techwave-border-color)',
                    color: 'var(--techwave-heading-color)',
                    '--tw-ring-color': 'var(--techwave-main-color)'
                  } as React.CSSProperties}
                >
                  <option value="all">Todas las notificaciones</option>
                  <option value="unread">No leídas</option>
                  <option value="read">Leídas</option>
                </select>

                {/* Category Filter */}
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: 'var(--techwave-some-a-bg-color)',
                    borderColor: 'var(--techwave-border-color)',
                    color: 'var(--techwave-heading-color)',
                    '--tw-ring-color': 'var(--techwave-main-color)'
                  } as React.CSSProperties}
                >
                  <option value="all">Todas las categorías</option>
                  <option value="system">Sistema</option>
                  <option value="user">Usuario</option>
                  <option value="database">Base de Datos</option>
                  <option value="security">Seguridad</option>
                </select>

                {/* Clear Filters */}
                <button
                  onClick={() => {
                    setFilter('all');
                    setCategoryFilter('all');
                    setSearchTerm('');
                  }}
                  className="px-4 py-2 rounded-lg font-medium transition-all duration-200"
                  style={{ 
                    backgroundColor: 'var(--techwave-some-a-bg-color)',
                    color: 'var(--techwave-heading-color)',
                    border: '1px solid var(--techwave-border-color)'
                  }}
                >
                  <Filter className="h-4 w-4 inline mr-2" />
                  Limpiar filtros
                </button>
              </div>
            </div>
          </div>

          {/* Notifications List */}
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-16">
              <Bell className="h-16 w-16 mx-auto mb-4" style={{ color: 'var(--techwave-body-color)' }} />
              <h3 className="text-lg font-medium mb-2" style={{ color: 'var(--techwave-heading-color)' }}>
                No hay notificaciones
              </h3>
              <p style={{ color: 'var(--techwave-body-color)' }}>
                {searchTerm || filter !== 'all' || categoryFilter !== 'all' 
                  ? 'No se encontraron notificaciones con los filtros aplicados.'
                  : 'Estás al día con todas las notificaciones.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`rounded-2xl p-6 transition-all duration-200 hover:shadow-lg ${
                    notification.isRead ? 'opacity-75' : ''
                  }`}
                  style={{ 
                    backgroundColor: 'var(--techwave-some-r-bg-color)', 
                    border: '1px solid var(--techwave-border-color)',
                    borderLeft: `4px solid ${getTypeColor(notification.type)}`
                  }}
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 mt-1">
                      {getTypeIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className={`text-lg font-semibold mb-2 ${
                            notification.isRead ? '' : 'font-bold'
                          }`} style={{ color: 'var(--techwave-heading-color)' }}>
                            {notification.title}
                          </h3>
                          <p className="mb-3" style={{ color: 'var(--techwave-body-color)' }}>
                            {notification.message}
                          </p>
                          
                          <div className="flex items-center space-x-4">
                            <span
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                              style={{ 
                                backgroundColor: `${getCategoryColor(notification.category)}20`,
                                color: getCategoryColor(notification.category)
                              }}
                            >
                              {notification.category.charAt(0).toUpperCase() + notification.category.slice(1)}
                            </span>
                            <span className="text-sm" style={{ color: 'var(--techwave-body-color)' }}>
                              {formatTimestamp(notification.timestamp)}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 ml-4">
                          {!notification.isRead && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="p-2 rounded-lg transition-colors hover:bg-gray-100"
                              style={{ color: 'var(--techwave-body-color)' }}
                              title="Marcar como leída"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="p-2 rounded-lg transition-colors hover:bg-red-100"
                            style={{ color: 'var(--techwave-error-color)' }}
                            title="Eliminar"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </FrontendLayout>
    </>
  );
} 