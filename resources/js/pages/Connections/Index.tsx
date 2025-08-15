import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Plus, Database, Settings, Trash2, Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react';
import { useChat } from '../../hooks/useChat';
import FrontendLayout from '../../components/FrontendLayout';
import axios from 'axios';

interface Connection {
  id: number;
  name: string;
  host: string;
  port: string;
  database: string;
  username: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export default function ConnectionsIndex() {
  const { chatData } = useChat();
  const { userInfo } = chatData;
  const [connections, setConnections] = useState<Connection[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadConnections();
  }, []);

  const loadConnections = async () => {
    try {
      console.log('Cargando conexiones...');
      const response = await axios.get('/api/connections');
      console.log('Response completa:', response);
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      if (response.status === 200) {
        const data = response.data;
        console.log('Datos recibidos:', data);
        console.log('Tipo de datos:', typeof data);
        console.log('Es array:', Array.isArray(data));
        
        if (Array.isArray(data)) {
          setConnections(data);
        } else {
          console.error('La respuesta no es un array:', data);
          setConnections([]);
        }
      } else {
        console.error('Error en response:', response.status, response.statusText);
        console.error('Error response body:', response.data);
        setConnections([]);
      }
    } catch (error) {
      console.error('Error loading connections:', error);
      if (axios.isAxiosError(error)) {
        console.error('Error de Axios:', error.response?.data);
        console.error('Status:', error.response?.status);
      }
      setConnections([]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleConnectionStatus = async (connectionId: number) => {
    try {
      const response = await axios.post(`/api/connections/${connectionId}/activate`, {}, {
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
      });

      if (response.status === 200) {
        // Recargar las conexiones para reflejar el cambio
        loadConnections();
      }
    } catch (error) {
      console.error('Error toggling connection:', error);
      if (axios.isAxiosError(error)) {
        console.error('Error de Axios:', error.response?.data);
        console.error('Status:', error.response?.status);
      }
    }
  };

  const deleteConnection = async (connectionId: number) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta conexión?')) {
      return;
    }

    try {
      const response = await axios.delete(`/api/connections/${connectionId}`, {
        headers: {
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
      });

      if (response.status === 200) {
        loadConnections();
      }
    } catch (error) {
      console.error('Error deleting connection:', error);
      if (axios.isAxiosError(error)) {
        console.error('Error de Axios:', error.response?.data);
        console.error('Status:', error.response?.status);
      }
    }
  };

  const handleLogout = () => {
    window.location.href = '/logout';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <>
        <Head title="Conexiones - GatherLake AI" />
        <FrontendLayout userInfo={userInfo} activePage="connections" onLogout={handleLogout}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4" style={{ color: 'var(--techwave-body-color)' }}>Cargando conexiones...</p>
            </div>
          </div>
        </FrontendLayout>
      </>
    );
  }

  return (
    <>
      <Head title="Conexiones - GatherLake AI" />
      
      <FrontendLayout userInfo={userInfo} activePage="connections" onLogout={handleLogout}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold" style={{ color: 'var(--techwave-heading-color)' }}>
                  Conexiones de Base de Datos
                </h1>
                <p className="mt-2" style={{ color: 'var(--techwave-body-color)' }}>
                  Gestiona tus conexiones a bases de datos para el asistente SQL
                </p>
              </div>
              <Link
                href="/connections/create"
                className="inline-flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
                style={{
                  backgroundColor: 'var(--techwave-main-color)',
                  color: 'white'
                }}
              >
                <Plus className="h-5 w-5 mr-2" />
                Nueva Conexión
              </Link>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="rounded-2xl p-6" style={{ backgroundColor: 'var(--techwave-some-r-bg-color)', border: '1px solid var(--techwave-border-color)' }}>
              <div className="flex items-center">
                <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--techwave-some-a-bg-color)' }}>
                  <Database className="h-6 w-6" style={{ color: 'var(--techwave-main-color)' }} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium" style={{ color: 'var(--techwave-body-color)' }}>Total Conexiones</p>
                  <p className="text-2xl font-bold" style={{ color: 'var(--techwave-heading-color)' }}>{connections.length}</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl p-6" style={{ backgroundColor: 'var(--techwave-some-r-bg-color)', border: '1px solid var(--techwave-border-color)' }}>
              <div className="flex items-center">
                <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--techwave-some-a-bg-color)' }}>
                  <CheckCircle className="h-6 w-6" style={{ color: 'var(--techwave-success-color)' }} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium" style={{ color: 'var(--techwave-body-color)' }}>Activas</p>
                  <p className="text-2xl font-bold" style={{ color: 'var(--techwave-heading-color)' }}>
                    {connections.filter(c => c.is_active).length}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl p-6" style={{ backgroundColor: 'var(--techwave-some-r-bg-color)', border: '1px solid var(--techwave-border-color)' }}>
              <div className="flex items-center">
                <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--techwave-some-a-bg-color)' }}>
                  <XCircle className="h-6 w-6" style={{ color: 'var(--techwave-error-color)' }} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium" style={{ color: 'var(--techwave-body-color)' }}>Inactivas</p>
                  <p className="text-2xl font-bold" style={{ color: 'var(--techwave-heading-color)' }}>
                    {connections.filter(c => !c.is_active).length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Connections List */}
          {connections.length === 0 ? (
            <div className="text-center py-16">
              <Database className="h-16 w-16 mx-auto mb-4" style={{ color: 'var(--techwave-body-color)' }} />
              <h3 className="text-lg font-medium mb-2" style={{ color: 'var(--techwave-heading-color)' }}>
                No hay conexiones configuradas
              </h3>
              <p className="mb-6" style={{ color: 'var(--techwave-body-color)' }}>
                Crea tu primera conexión para comenzar a usar el asistente SQL
              </p>
              <Link
                href="/connections/create"
                className="inline-flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
                style={{
                  backgroundColor: 'var(--techwave-main-color)',
                  color: 'white'
                }}
              >
                <Plus className="h-5 w-5 mr-2" />
                Crear Primera Conexión
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {connections.map((connection) => (
                <div
                key={connection.id} 
                  className="rounded-2xl p-6 transition-all duration-200 hover:shadow-lg"
                  style={{ 
                    backgroundColor: 'var(--techwave-some-r-bg-color)', 
                    border: connection.is_active 
                      ? '2px solid var(--techwave-main-color)' 
                      : '1px solid var(--techwave-border-color)',
                    boxShadow: connection.is_active 
                      ? '0 8px 25px rgba(59, 130, 246, 0.25), 0 4px 6px -1px rgba(0, 0, 0, 0.1)' 
                      : 'none',
                    transform: connection.is_active ? 'scale(1.02)' : 'scale(1)'
                  }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <Database className="h-5 w-5 mr-3" style={{ color: 'var(--techwave-main-color)' }} />
                      <div>
                        <h3 className="font-semibold" style={{ color: 'var(--techwave-heading-color)' }}>
                          {connection.name}
                        </h3>
                        <div className="flex items-center mt-1">
                          <span
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                            style={{
                              backgroundColor: connection.is_active 
                                ? 'var(--techwave-main-color)' 
                                : 'var(--techwave-some-a-bg-color)',
                              color: connection.is_active 
                                ? 'white' 
                                : 'var(--techwave-body-color)',
                              border: connection.is_active 
                                ? 'none' 
                                : '1px solid var(--techwave-border-color)'
                            }}
                        >
                            {connection.is_active ? '⭐ Activa' : 'Inactiva'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => toggleConnectionStatus(connection.id)}
                        className="p-2 rounded-lg transition-colors"
                        style={{ 
                          color: connection.is_active 
                            ? 'rgba(255, 255, 255, 0.8)' 
                            : 'var(--techwave-body-color)',
                          backgroundColor: 'transparent'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = connection.is_active 
                            ? 'rgba(255, 255, 255, 0.1)' 
                            : 'var(--techwave-some-a-bg-color)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                        title={connection.is_active ? 'Desactivar' : 'Activar'}
                      >
                        {connection.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                      <Link
                        href={`/connections/${connection.id}/edit`}
                        className="p-2 rounded-lg transition-colors"
                        style={{ 
                          color: 'var(--techwave-body-color)',
                          backgroundColor: 'transparent'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'var(--techwave-some-a-bg-color)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                        title="Editar"
                      >
                        <Settings className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => deleteConnection(connection.id)}
                        className="p-2 rounded-lg transition-colors"
                        style={{ 
                          color: 'var(--techwave-error-color)',
                          backgroundColor: 'transparent'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'var(--techwave-error-color)';
                          e.currentTarget.style.color = 'white';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = 'var(--techwave-error-color)';
                        }}
                        title="Eliminar"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium" style={{ color: 'var(--techwave-body-color)' }}>Host:</span>
                        <span className="ml-2" style={{ color: 'var(--techwave-heading-color)' }}>{connection.host}</span>
                      </div>
                      <div>
                        <span className="font-medium" style={{ color: 'var(--techwave-body-color)' }}>Puerto:</span>
                        <span className="ml-2" style={{ color: 'var(--techwave-heading-color)' }}>{connection.port}</span>
                      </div>
                      <div>
                        <span className="font-medium" style={{ color: 'var(--techwave-body-color)' }}>Base de Datos:</span>
                        <span className="ml-2" style={{ color: 'var(--techwave-heading-color)' }}>{connection.database}</span>
                      </div>
                      <div>
                        <span className="font-medium" style={{ color: 'var(--techwave-body-color)' }}>Usuario:</span>
                        <span className="ml-2" style={{ color: 'var(--techwave-heading-color)' }}>{connection.username}</span>
                      </div>
                    </div>

                    <div className="pt-3" style={{ borderTop: '1px solid var(--techwave-border-color)' }}>
                      <div className="flex items-center justify-between text-xs" style={{ color: 'var(--techwave-body-color)' }}>
                        <span>Creada: {formatDate(connection.created_at)}</span>
                        <span>Actualizada: {formatDate(connection.updated_at)}</span>
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