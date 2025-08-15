import React, { useState, useEffect } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { ArrowLeft, Database, Save, Eye, EyeOff } from 'lucide-react';
import { useChat } from '../../hooks/useChat';
import FrontendLayout from '../../components/FrontendLayout';
import axios from 'axios';

interface ConnectionFormData {
  name: string;
  host: string;
  port: string;
  database: string;
  username: string;
  password: string;
  driver: string;
}

interface PageProps {
  id: number;
}

export default function EditConnection() {
  const { chatData } = useChat();
  const { userInfo } = chatData;
  const { id } = usePage<PageProps>().props;
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState<ConnectionFormData>({
    name: '',
    host: 'localhost',
    port: '3306',
    database: '',
    username: '',
    password: '',
    driver: 'mysql'
  });

  const drivers = [
    { value: 'mysql', label: 'MySQL', description: 'Base de datos MySQL' },
    { value: 'pgsql', label: 'PostgreSQL', description: 'Base de datos PostgreSQL' },
    { value: 'sqlite', label: 'SQLite', description: 'Base de datos SQLite' },
    { value: 'sqlsrv', label: 'SQL Server', description: 'Microsoft SQL Server' }
  ];

  useEffect(() => {
    loadConnection();
  }, [id]);

  const loadConnection = async () => {
    try {
      const response = await axios.get(`/api/connections/${id}`);
      if (response.status === 200) {
        const connection = response.data;
        setFormData({
          name: connection.name,
          host: connection.host,
          port: connection.port,
          database: connection.database,
          username: connection.username,
          password: '', // No cargamos la contraseña por seguridad
          driver: connection.driver || 'mysql'
        });
      }
    } catch (error) {
      console.error('Error loading connection:', error);
      if (axios.isAxiosError(error)) {
        console.error('Error de Axios:', error.response?.data);
        console.error('Status:', error.response?.status);
      }
      alert('Error al cargar la conexión');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.host.trim() || !formData.database.trim() || !formData.username.trim()) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.put(`/api/connections/${id}`, formData, {
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        }
      });

      if (response.status === 200) {
        router.visit('/connections');
      } else {
        alert(response.data.error || 'Error al actualizar la conexión');
      }
    } catch (error) {
      console.error('Error:', error);
      if (axios.isAxiosError(error)) {
        console.error('Error de Axios:', error.response?.data);
        console.error('Status:', error.response?.status);
        alert(error.response?.data?.error || 'Error al actualizar la conexión');
      } else {
        alert('Error de conexión al actualizar la conexión');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    window.location.href = '/logout';
  };

  if (isLoading) {
    return (
      <>
        <Head title="Editar Conexión - GatherLake AI" />
        <FrontendLayout userInfo={userInfo} activePage="connections" onLogout={handleLogout}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4" style={{ color: 'var(--techwave-body-color)' }}>Cargando conexión...</p>
            </div>
          </div>
        </FrontendLayout>
      </>
    );
  }

  return (
    <>
      <Head title="Editar Conexión - GatherLake AI" />
      
      <FrontendLayout userInfo={userInfo} activePage="connections" onLogout={handleLogout}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Back to Connections Link */}
          <div style={{ marginBottom: '2rem' }}>
            <Link 
              href="/connections"
              className="inline-flex items-center transition-colors"
              style={{ color: 'var(--techwave-body-color)' }}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a Conexiones
            </Link>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold" style={{ color: 'var(--techwave-heading-color)' }}>
              Editar Conexión
            </h1>
            <p className="mt-2" style={{ color: 'var(--techwave-body-color)' }}>
              Modifica los detalles de tu conexión a la base de datos
            </p>
          </div>

          {/* Form */}
          <div className="rounded-2xl p-8" style={{ backgroundColor: 'var(--techwave-some-r-bg-color)', border: '1px solid var(--techwave-border-color)' }}>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Driver Selection */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--techwave-heading-color)' }}>
                  Tipo de Base de Datos
                </label>
                <select
                  value={formData.driver}
                  onChange={(e) => setFormData({ ...formData, driver: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border transition-colors"
                  style={{ 
                    backgroundColor: 'var(--techwave-some-a-bg-color)',
                    borderColor: 'var(--techwave-border-color)',
                    color: 'var(--techwave-heading-color)'
                  }}
                >
                  {drivers.map((driver) => (
                    <option key={driver.value} value={driver.value}>
                      {driver.label} - {driver.description}
                    </option>
                  ))}
                </select>
              </div>

              {/* Connection Name */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--techwave-heading-color)' }}>
                  Nombre de la Conexión *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border transition-colors"
                  style={{ 
                    backgroundColor: 'var(--techwave-some-a-bg-color)',
                    borderColor: 'var(--techwave-border-color)',
                    color: 'var(--techwave-heading-color)'
                  }}
                  placeholder="Mi Base de Datos"
                  required
                />
              </div>

              {/* Host and Port */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--techwave-heading-color)' }}>
                    Host *
                  </label>
                  <input
                    type="text"
                    value={formData.host}
                    onChange={(e) => setFormData({ ...formData, host: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border transition-colors"
                    style={{ 
                      backgroundColor: 'var(--techwave-some-a-bg-color)',
                      borderColor: 'var(--techwave-border-color)',
                      color: 'var(--techwave-heading-color)'
                    }}
                    placeholder="localhost"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--techwave-heading-color)' }}>
                    Puerto
                  </label>
                  <input
                    type="text"
                    value={formData.port}
                    onChange={(e) => setFormData({ ...formData, port: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border transition-colors"
                    style={{ 
                      backgroundColor: 'var(--techwave-some-a-bg-color)',
                      borderColor: 'var(--techwave-border-color)',
                      color: 'var(--techwave-heading-color)'
                    }}
                    placeholder="3306"
                  />
                </div>
              </div>

              {/* Database Name */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--techwave-heading-color)' }}>
                  Nombre de la Base de Datos *
                </label>
                <input
                  type="text"
                  value={formData.database}
                  onChange={(e) => setFormData({ ...formData, database: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border transition-colors"
                  style={{ 
                    backgroundColor: 'var(--techwave-some-a-bg-color)',
                    borderColor: 'var(--techwave-border-color)',
                    color: 'var(--techwave-heading-color)'
                  }}
                  placeholder="mi_base_datos"
                  required
                />
              </div>

              {/* Username and Password */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--techwave-heading-color)' }}>
                    Usuario *
                  </label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border transition-colors"
                    style={{ 
                      backgroundColor: 'var(--techwave-some-a-bg-color)',
                      borderColor: 'var(--techwave-border-color)',
                      color: 'var(--techwave-heading-color)'
                    }}
                    placeholder="usuario"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--techwave-heading-color)' }}>
                    Contraseña
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full px-4 py-3 pr-12 rounded-lg border transition-colors"
                      style={{ 
                        backgroundColor: 'var(--techwave-some-a-bg-color)',
                        borderColor: 'var(--techwave-border-color)',
                        color: 'var(--techwave-heading-color)'
                      }}
                      placeholder="Dejar en blanco para mantener la actual"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      style={{ color: 'var(--techwave-body-color)' }}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  <p className="mt-1 text-xs" style={{ color: 'var(--techwave-body-color)' }}>
                    Deja en blanco para mantener la contraseña actual
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: 'var(--techwave-main-color)',
                    color: 'white'
                  }}
                >
                  <Save className="h-5 w-5 mr-2" />
                  {isSubmitting ? 'Actualizando...' : 'Actualizar Conexión'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </FrontendLayout>
    </>
  );
} 