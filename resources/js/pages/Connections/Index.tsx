import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Database, 
  Plus, 
  Edit, 
  Trash2, 
  CheckCircle, 
  Circle, 
  Settings,
  Zap,
  Shield,
  Globe
} from 'lucide-react';
import axios from 'axios';

interface Connection {
  id: number;
  name: string;
  driver: string;
  host: string;
  port: string;
  database: string;
  username: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export default function Index() {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);
  const [activating, setActivating] = useState<number | null>(null);

  useEffect(() => {
    loadConnections();
  }, []);

  const loadConnections = async () => {
    try {
      const response = await axios.get('/connections');
      setConnections(response.data);
    } catch (error) {
      console.error('Error loading connections:', error);
    } finally {
      setLoading(false);
    }
  };

  const activateConnection = async (connectionId: number) => {
    setActivating(connectionId);
    try {
      await axios.post(`/connections/${connectionId}/activate`);
      await loadConnections(); // Reload to get updated state
    } catch (error) {
      console.error('Error activating connection:', error);
    } finally {
      setActivating(null);
    }
  };

  const deleteConnection = async (connectionId: number) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta conexión?')) {
      try {
        await axios.delete(`/connections/${connectionId}`);
        await loadConnections();
      } catch (error) {
        console.error('Error deleting connection:', error);
      }
    }
  };

  const getDriverIcon = (driver: string) => {
    switch (driver.toLowerCase()) {
      case 'mysql':
        return <Database className="w-5 h-5 text-blue-500" />;
      case 'pgsql':
      case 'postgresql':
        return <Database className="w-5 h-5 text-indigo-500" />;
      case 'sqlite':
        return <Database className="w-5 h-5 text-green-500" />;
      case 'sqlsrv':
        return <Database className="w-5 h-5 text-red-500" />;
      default:
        return <Database className="w-5 h-5 text-gray-500" />;
    }
  };

  const getDriverColor = (driver: string) => {
    switch (driver.toLowerCase()) {
      case 'mysql':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pgsql':
      case 'postgresql':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'sqlite':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'sqlsrv':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <Head title="Conexiones" />
      
      <div className="p-6 mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Mis Conexiones
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Gestiona tus conexiones de base de datos y configura cuál está activa
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Link href="/connections/create">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Nueva Conexión
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Database className="w-8 h-8 text-blue-500 mr-4" />
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Conexiones
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {connections.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Zap className="w-8 h-8 text-green-500 mr-4" />
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Conexión Activa
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {connections.filter(c => c.is_active).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Shield className="w-8 h-8 text-purple-500 mr-4" />
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Tipos de BD
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {new Set(connections.map(c => c.driver)).size}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Connections Grid */}
        {connections.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Database className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No tienes conexiones
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Crea tu primera conexión para empezar a usar el asistente SQL
              </p>
              <Link href="/connections/create">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Crear Primera Conexión
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {connections.map((connection) => (
              <Card 
                key={connection.id} 
                className={`relative transition-all duration-200 hover:shadow-lg ${
                  connection.is_active 
                    ? 'ring-2 ring-green-500 bg-green-50 dark:bg-green-900/20' 
                    : 'hover:ring-2 hover:ring-gray-300'
                }`}
              >
                {/* Active Badge */}
                {connection.is_active && (
                  <div className="absolute -top-2 -right-2">
                    <Badge className="bg-green-500 text-white px-3 py-1">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Activa
                    </Badge>
                  </div>
                )}

                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      {getDriverIcon(connection.driver)}
                      <div>
                        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                          {connection.name}
                        </CardTitle>
                        <Badge 
                          variant="outline" 
                          className={`mt-1 ${getDriverColor(connection.driver)}`}
                        >
                          {connection.driver.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Connection Details */}
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Globe className="w-4 h-4 mr-2" />
                      {connection.host}:{connection.port}
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Database className="w-4 h-4 mr-2" />
                      {connection.database}
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Settings className="w-4 h-4 mr-2" />
                      {connection.username}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex space-x-2">
                                             {!connection.is_active && (
                         <Button
                           variant="outline"
                           size="sm"
                           onClick={() => activateConnection(connection.id)}
                           disabled={activating === connection.id}
                           className="text-green-600 border-green-600 hover:bg-green-50 hover:text-green-700"
                         >
                           {activating === connection.id ? (
                             <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
                           ) : (
                             <CheckCircle className="w-4 h-4 mr-1" />
                           )}
                           <span>Activar</span>
                         </Button>
                       )}
                      
                      <Link href={`/connections/${connection.id}/edit`}>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4 mr-1" />
                          Editar
                        </Button>
                      </Link>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteConnection(connection.id)}
                      className="text-red-600 border-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Help Section */}
        {connections.length > 0 && (
          <Card className="mt-8 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center">
                    <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    ¿Cómo funciona?
                  </h3>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                    Solo una conexión puede estar activa a la vez. La conexión activa es la que se usará 
                    automáticamente en el asistente SQL. Haz clic en "Activar" para cambiar la conexión activa.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}