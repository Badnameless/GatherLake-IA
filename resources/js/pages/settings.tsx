import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { useChat } from '../hooks/useChat';
import FrontendLayout from '../components/FrontendLayout';
import Notification from '../components/ui/notification';
import axios from 'axios';

interface ProfileFormData {
  name: string;
  email: string;
}

interface PasswordFormData {
  current_password: string;
  password: string;
  password_confirmation: string;
}

type SettingsTab = 'profile' | 'password' | 'appearance';

export default function Settings() {
  const { chatData, setChatData } = useChat();
  const { userInfo } = chatData;
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
    isVisible: boolean;
  }>({
    type: 'success',
    message: '',
    isVisible: false
  });

  const [profileData, setProfileData] = useState<ProfileFormData>({
    name: userInfo.name || '',
    email: userInfo.email || '',
  });

  const [passwordData, setPasswordData] = useState<PasswordFormData>({
    current_password: '',
    password: '',
    password_confirmation: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({
      type,
      message,
      isVisible: true
    });
  };

  const hideNotification = () => {
    setNotification(prev => ({ ...prev, isVisible: false }));
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación básica del lado del cliente
    if (!profileData.name.trim() || !profileData.email.trim()) {
      showNotification('error', 'Por favor completa todos los campos');
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('Enviando datos:', profileData);
      
      const response = await axios.post('/api/profile/update', profileData, {
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
          'Accept': 'application/json',
        }
      });

      console.log('Respuesta del servidor:', response.status, response.statusText);

      if (response.status === 200) {
        const result = response.data;
        console.log('Respuesta exitosa:', result);
        
        showNotification('success', 'Perfil actualizado exitosamente');
        
        // Actualizar el userInfo local
        if (setChatData && chatData.userInfo) {
          setChatData({
            ...chatData,
            userInfo: {
              ...chatData.userInfo,
              name: profileData.name,
              email: profileData.email
            }
          });
        }
      } else {
        const result = response.data;
        console.error('Error del servidor:', result);
        
        let errorMessage = 'Error al actualizar el perfil';
        
        if (result.error) {
          errorMessage = result.error;
        } else if (result.message) {
          errorMessage = result.message;
        } else if (response.status === 401) {
          errorMessage = 'No tienes autorización para realizar esta acción';
        } else if (response.status === 422) {
          errorMessage = 'Datos de validación incorrectos';
        } else if (response.status >= 500) {
          errorMessage = 'Error interno del servidor';
        }
        
        showNotification('error', errorMessage);
      }
    } catch (error) {
      console.error('Error de conexión:', error);
      if (axios.isAxiosError(error)) {
        console.error('Error de Axios:', error.response?.data);
        console.error('Status:', error.response?.status);
      }
      showNotification('error', 'Error de conexión al actualizar el perfil');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación básica del lado del cliente
    if (!passwordData.current_password || !passwordData.password || !passwordData.password_confirmation) {
      showNotification('error', 'Por favor completa todos los campos');
      return;
    }

    if (passwordData.password !== passwordData.password_confirmation) {
      showNotification('error', 'Las contraseñas no coinciden');
      return;
    }

    if (passwordData.password.length < 8) {
      showNotification('error', 'La contraseña debe tener al menos 8 caracteres');
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('Enviando datos de contraseña');
      
      const response = await axios.put('/api/password/update', passwordData, {
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
          'Accept': 'application/json',
        }
      });

      console.log('Respuesta del servidor:', response.status, response.statusText);

      if (response.status === 200) {
        const result = response.data;
        console.log('Respuesta exitosa:', result);
        
        showNotification('success', 'Contraseña actualizada exitosamente');
        // Limpiar el formulario
        setPasswordData({
          current_password: '',
          password: '',
          password_confirmation: '',
        });
      } else {
        const result = response.data;
        console.error('Error del servidor:', result);
        
        let errorMessage = 'Error al actualizar la contraseña';
        
        if (result.error) {
          errorMessage = result.error;
        } else if (result.message) {
          errorMessage = result.message;
        } else if (response.status === 401) {
          errorMessage = 'No tienes autorización para realizar esta acción';
        } else if (response.status === 422) {
          errorMessage = 'Datos de validación incorrectos';
        } else if (response.status >= 500) {
          errorMessage = 'Error interno del servidor';
        }
        
        showNotification('error', errorMessage);
      }
    } catch (error) {
      console.error('Error de conexión:', error);
      showNotification('error', 'Error de conexión al actualizar la contraseña');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    window.location.href = '/logout';
  };

  const tabs = [
    { id: 'profile' as SettingsTab, name: 'Perfil', icon: '👤' },
    { id: 'password' as SettingsTab, name: 'Contraseña', icon: '🔒' },
    { id: 'appearance' as SettingsTab, name: 'Apariencia', icon: '🎨' },
  ];

  return (
    <>
      <Head title="Settings - GatherLake AI" />
      
      <FrontendLayout userInfo={userInfo} activePage="settings" onLogout={handleLogout}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold" style={{ color: 'var(--techwave-heading-color)' }}>
              Configuración
            </h1>
            <p className="mt-2" style={{ color: 'var(--techwave-body-color)' }}>
              Gestiona tu cuenta y preferencias
            </p>
          </div>

          {/* Tabs */}
          <div className="border-b mb-8" style={{ borderColor: 'var(--techwave-border-color)' }}>
            <nav className="flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent hover:border-gray-300'
                  }`}
                  style={{
                    color: activeTab === tab.id 
                      ? 'var(--techwave-main-color)' 
                      : 'var(--techwave-body-color)',
                    borderColor: activeTab === tab.id 
                      ? 'var(--techwave-main-color)' 
                      : 'transparent'
                  }}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="rounded-2xl p-6" style={{ backgroundColor: 'var(--techwave-some-r-bg-color)', border: '1px solid var(--techwave-border-color)' }}>
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div>
                <h3 className="text-lg font-semibold mb-6" style={{ color: 'var(--techwave-heading-color)' }}>
                  Información del Perfil
                </h3>
                
                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--techwave-heading-color)' }}>
                      Nombre Completo
                    </label>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
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
                      Email
                    </label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2"
                      style={{
                        backgroundColor: 'var(--techwave-some-a-bg-color)',
                        borderColor: 'var(--techwave-border-color)',
                        color: 'var(--techwave-heading-color)',
                        '--tw-ring-color': 'var(--techwave-main-color)'
                      } as React.CSSProperties}
                    />
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
                      style={{
                        backgroundColor: 'var(--techwave-main-color)',
                        color: 'white'
                      }}
                    >
                      {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Password Tab */}
            {activeTab === 'password' && (
              <div>
                <h3 className="text-lg font-semibold mb-6" style={{ color: 'var(--techwave-heading-color)' }}>
                  Cambiar Contraseña
                </h3>
                
                <form onSubmit={handlePasswordSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--techwave-heading-color)' }}>
                      Contraseña Actual
                    </label>
                    <input
                      type="password"
                      value={passwordData.current_password}
                      onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
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
                      Nueva Contraseña
                    </label>
                    <input
                      type="password"
                      value={passwordData.password}
                      onChange={(e) => setPasswordData({ ...passwordData, password: e.target.value })}
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
                      Confirmar Nueva Contraseña
                    </label>
                    <input
                      type="password"
                      value={passwordData.password_confirmation}
                      onChange={(e) => setPasswordData({ ...passwordData, password_confirmation: e.target.value })}
                      className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2"
                      style={{
                        backgroundColor: 'var(--techwave-some-a-bg-color)',
                        borderColor: 'var(--techwave-border-color)',
                        color: 'var(--techwave-heading-color)',
                        '--tw-ring-color': 'var(--techwave-main-color)'
                      } as React.CSSProperties}
                    />
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
                      style={{
                        backgroundColor: 'var(--techwave-main-color)',
                        color: 'white'
                      }}
                    >
                      {isSubmitting ? 'Actualizando...' : 'Actualizar Contraseña'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Appearance Tab */}
            {activeTab === 'appearance' && (
              <div>
                <h3 className="text-lg font-semibold mb-6" style={{ color: 'var(--techwave-heading-color)' }}>
                  Apariencia
                </h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-4" style={{ color: 'var(--techwave-heading-color)' }}>
                      Tema
                    </label>
                    <div className="grid grid-cols-3 gap-4">
                      <button className="p-4 border-2 rounded-lg text-center transition-all hover:scale-105"
                              style={{ 
                                borderColor: 'var(--techwave-border-color)',
                                backgroundColor: 'var(--techwave-some-a-bg-color)',
                                color: 'var(--techwave-heading-color)'
                              }}>
                        <div className="text-2xl mb-2">🌞</div>
                        <div className="text-sm font-medium">Claro</div>
                      </button>
                      
                      <button className="p-4 border-2 rounded-lg text-center transition-all hover:scale-105"
                              style={{ 
                                borderColor: 'var(--techwave-main-color)',
                                backgroundColor: 'var(--techwave-some-a-bg-color)',
                                color: 'var(--techwave-heading-color)'
                              }}>
                        <div className="text-2xl mb-2">🌙</div>
                        <div className="text-sm font-medium">Oscuro</div>
                      </button>
                      
                      <button className="p-4 border-2 rounded-lg text-center transition-all hover:scale-105"
                              style={{ 
                                borderColor: 'var(--techwave-border-color)',
                                backgroundColor: 'var(--techwave-some-a-bg-color)',
                                color: 'var(--techwave-heading-color)'
                              }}>
                        <div className="text-2xl mb-2">🔄</div>
                        <div className="text-sm font-medium">Automático</div>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-4" style={{ color: 'var(--techwave-heading-color)' }}>
                      Densidad de la Interfaz
                    </label>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input type="radio" name="density" value="compact" className="mr-3" />
                        <span style={{ color: 'var(--techwave-body-color)' }}>Compacta</span>
                      </label>
                      <label className="flex items-center">
                        <input type="radio" name="density" value="comfortable" className="mr-3" defaultChecked />
                        <span style={{ color: 'var(--techwave-body-color)' }}>Cómoda</span>
                      </label>
                      <label className="flex items-center">
                        <input type="radio" name="density" value="spacious" className="mr-3" />
                        <span style={{ color: 'var(--techwave-body-color)' }}>Espaciosa</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Notification Component */}
        <Notification
          type={notification.type}
          message={notification.message}
          isVisible={notification.isVisible}
          onClose={hideNotification}
          duration={5000}
        />
      </FrontendLayout>
    </>
  );
} 