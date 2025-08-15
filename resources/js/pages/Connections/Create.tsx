import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Database, Save, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
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

export default function CreateConnection() {
  const { userInfo } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    
    if (!formData.name.trim() || !formData.host.trim() || !formData.database.trim() || !formData.username.trim()) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post('/api/connections', formData, {
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
      });

      if (response.data.success) {
        router.visit('/connections');
      } else {
        alert(response.data.message || 'Error al crear la conexión');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión al crear la conexión');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    router.post('/logout');
  };

    return (
    <>
      <Head title="Crear Conexión - GatherLake AI" />
      
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
              Crear Nueva Conexión
            </h1>
            <p className="mt-2" style={{ color: 'var(--techwave-body-color)' }}>
              Configura una nueva conexión a base de datos para el asistente SQL
            </p>
          </div>

          {/* Form */}
          <div className="rounded-2xl p-8" style={{ backgroundColor: 'var(--techwave-some-r-bg-color)', border: '1px solid var(--techwave-border-color)' }}>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Driver Selection */}
                            <div>
                <label className="block text-sm font-medium mb-3" style={{ color: 'var(--techwave-heading-color)' }}>
                  Tipo de Base de Datos *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {drivers.map((driver) => (
                    <label
                      key={driver.value}
                      className="relative flex cursor-pointer rounded-lg border p-4 transition-all hover:shadow-md"
                      style={{
                        borderColor: formData.driver === driver.value
                          ? 'var(--techwave-main-color)'
                          : 'var(--techwave-border-color)',
                        backgroundColor: formData.driver === driver.value
                          ? 'var(--techwave-some-a-bg-color)'
                          : 'var(--techwave-some-r-bg-color)'
                      }}
                    >
                      <input
                        type="radio"
                        name="driver"
                        value={driver.value}
                        checked={formData.driver === driver.value}
                        onChange={(e) => setFormData({ ...formData, driver: e.target.value })}
                        className="sr-only"
                      />
                      <div className="flex items-center">
                        <Database className="h-5 w-5 mr-3" style={{ color: 'var(--techwave-main-color)' }} />
                        <div>
                          <div className="font-medium" style={{ color: 'var(--techwave-heading-color)' }}>
                            {driver.label}
                          </div>
                          <div className="text-sm" style={{ color: 'var(--techwave-body-color)' }}>
                            {driver.description}
                          </div>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
                            </div>

              {/* Connection Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--techwave-heading-color)' }}>
                    Nombre de la Conexión *
                  </label>
                  <input
                                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Mi Base de Datos"
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2"
                    style={{
                      backgroundColor: 'var(--techwave-some-a-bg-color)',
                      borderColor: 'var(--techwave-border-color)',
                      color: 'var(--techwave-heading-color)',
                      '--tw-ring-color': 'var(--techwave-main-color)'
                    } as React.CSSProperties}
                  />
                            </div>

                            <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--techwave-heading-color)' }}>
                    Host *
                  </label>
                  <input
                                    type="text"
                    value={formData.host}
                    onChange={(e) => setFormData({ ...formData, host: e.target.value })}
                    placeholder="localhost"
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2"
                    style={{
                      backgroundColor: 'var(--techwave-some-a-bg-color)',
                      borderColor: 'var(--techwave-border-color)',
                      color: 'var(--techwave-heading-color)',
                      '--tw-ring-color': 'var(--techwave-main-color)'
                    } as React.CSSProperties}
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
                    placeholder="3306"
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2"
                    style={{
                      backgroundColor: 'var(--techwave-some-a-bg-color)',
                      borderColor: 'var(--techwave-border-color)',
                      color: 'var(--techwave-heading-color)',
                      '--tw-ring-color': 'var(--techwave-main-color)'
                    } as React.CSSProperties}
                  />
                            </div>

                            <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--techwave-heading-color)' }}>
                    Base de Datos *
                  </label>
                  <input
                                    type="text"
                    value={formData.database}
                    onChange={(e) => setFormData({ ...formData, database: e.target.value })}
                    placeholder="nombre_base_datos"
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2"
                    style={{
                      backgroundColor: 'var(--techwave-some-a-bg-color)',
                      borderColor: 'var(--techwave-border-color)',
                      color: 'var(--techwave-heading-color)',
                      '--tw-ring-color': 'var(--techwave-main-color)'
                    } as React.CSSProperties}
                  />
                            </div>

                            <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--techwave-heading-color)' }}>
                    Usuario *
                  </label>
                  <input
                                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    placeholder="usuario"
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2"
                    style={{
                      backgroundColor: 'var(--techwave-some-a-bg-color)',
                      borderColor: 'var(--techwave-border-color)',
                      color: 'var(--techwave-heading-color)',
                      '--tw-ring-color': 'var(--techwave-main-color)'
                    } as React.CSSProperties}
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
                      placeholder="contraseña"
                      className="w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2"
                      style={{
                        backgroundColor: 'var(--techwave-some-a-bg-color)',
                        borderColor: 'var(--techwave-border-color)',
                        color: 'var(--techwave-heading-color)',
                        '--tw-ring-color': 'var(--techwave-main-color)'
                      } as React.CSSProperties}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-md hover:bg-gray-100"
                      style={{ color: 'var(--techwave-body-color)' }}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                            </div>

              {/* Submit Button */}
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 flex items-center justify-center"
                  style={{
                    backgroundColor: 'var(--techwave-main-color)',
                    color: 'white'
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creando...
                    </>
                  ) : (
                    <>
                      <Save className="h-5 w-5 mr-2" />
                      Crear Conexión
                    </>
                  )}
                </button>
              </div>
                        </form>
          </div>
            </div>
      </FrontendLayout>
    </>
    );
}