import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, GitCommit, Star, Bug, Zap, Shield, Package, Users, Globe } from 'lucide-react';
import { useChat } from '../hooks/useChat';
import FrontendLayout from '../components/FrontendLayout';

export default function Changelog() {
  const { chatData } = useChat();
  const { userInfo } = chatData;
  
  const [selectedVersion, setSelectedVersion] = useState('4.1.2');

  const changelogData = {
    '4.1.2': {
      version: '4.1.2',
      date: '15 de Diciembre, 2024',
      type: 'patch',
      highlights: [
        'Mejoras en el rendimiento del chat',
        'Corrección de bugs menores en la interfaz',
        'Actualizaciones de seguridad'
      ],
      changes: {
        added: [
          'Nuevo sistema de notificaciones en tiempo real',
          'Soporte para más tipos de archivos en las importaciones'
        ],
        improved: [
          'Rendimiento del motor de consultas optimizado en un 25%',
          'Interfaz de usuario más responsiva en dispositivos móviles',
          'Mejor manejo de errores en conexiones de base de datos'
        ],
        fixed: [
          'Bug que causaba duplicación de mensajes en el chat',
          'Problema con la validación de formularios en Safari',
          'Error en la exportación de datos a Excel'
        ]
      }
    },
    '4.1.0': {
      version: '4.1.0',
      date: '1 de Diciembre, 2024',
      type: 'minor',
      highlights: [
        'Nueva funcionalidad de modelos finetunados',
        'Mejoras significativas en la precisión del NL2SQL',
        'Interfaz completamente rediseñada'
      ],
      changes: {
        added: [
          'Sistema de modelos finetunados personalizados',
          'Nuevo dashboard de analytics',
          'API GraphQL para desarrolladores',
          'Soporte para bases de datos NoSQL (MongoDB, Redis)'
        ],
        improved: [
          'Precisión del NL2SQL mejorada del 85% al 94%',
          'Tiempo de respuesta del chat reducido en un 40%',
          'Nueva interfaz con tema oscuro/claro',
          'Sistema de búsqueda avanzada en el historial'
        ],
        fixed: [
          'Problemas de compatibilidad con PostgreSQL 15+',
          'Bug en el sistema de autenticación OAuth',
          'Error en la sincronización de conexiones'
        ]
      }
    },
    '4.0.0': {
      version: '4.0.0',
      date: '15 de Noviembre, 2024',
      type: 'major',
      highlights: [
        'Lanzamiento de la nueva arquitectura de IA',
        'Sistema de tokens completamente renovado',
        'Nuevas integraciones con servicios en la nube'
      ],
      changes: {
        added: [
          'Nueva arquitectura de modelos de IA propietarios',
          'Sistema de tokens basado en blockchain',
          'Integración con AWS, Google Cloud y Azure',
          'API REST completamente rediseñada',
          'Sistema de webhooks personalizables'
        ],
        improved: [
          'Rendimiento general mejorado en un 300%',
          'Escalabilidad horizontal automática',
          'Nuevo sistema de caché inteligente',
          'Interfaz completamente reescrita en React 18'
        ],
        fixed: [
          'Todos los problemas de seguridad conocidos',
          'Compatibilidad con navegadores modernos',
          'Optimización de consultas complejas'
        ]
      }
    },
    '3.2.1': {
      version: '3.2.1',
      date: '1 de Noviembre, 2024',
      type: 'patch',
      highlights: [
        'Correcciones de seguridad críticas',
        'Mejoras en la estabilidad del sistema'
      ],
      changes: {
        added: [],
        improved: [
          'Estabilidad del sistema mejorada',
          'Mejor manejo de errores de red'
        ],
        fixed: [
          'Vulnerabilidad de seguridad en autenticación',
          'Bug que causaba pérdida de datos en sesiones largas',
          'Problema de memoria en consultas complejas'
        ]
      }
    }
  };

  const getVersionTypeIcon = (type: string) => {
    switch (type) {
      case 'major':
        return <Star className="h-5 w-5 text-yellow-500" />;
      case 'minor':
        return <Zap className="h-5 w-5 text-blue-500" />;
      case 'patch':
        return <Bug className="h-5 w-5 text-green-500" />;
      default:
        return <GitCommit className="h-5 w-5 text-gray-500" />;
    }
  };

  const getVersionTypeLabel = (type: string) => {
    switch (type) {
      case 'major':
        return 'Major Release';
      case 'minor':
        return 'Minor Release';
      case 'patch':
        return 'Patch Release';
      default:
        return 'Release';
    }
  };

  const currentVersion = changelogData[selectedVersion as keyof typeof changelogData];

  return (
    <>
      <Head title="Changelog - GatherLake AI" />
      <FrontendLayout userInfo={userInfo} activePage="changelog">
        {/* Back to Home Link */}
        <div style={{ marginBottom: '2rem' }}>
          <Link 
            href="/"
            className="inline-flex items-center transition-colors"
            style={{ color: 'var(--techwave-body-color)' }}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al Chat
          </Link>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6" style={{ backgroundColor: 'var(--techwave-some-a-bg-color)', border: '1px solid var(--techwave-border-color)' }}>
              <GitCommit className="h-10 w-10" style={{ color: 'var(--techwave-heading-color)' }} />
            </div>
            <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--techwave-heading-color)' }}>
              Changelog
            </h1>
            <p className="text-xl max-w-3xl mx-auto" style={{ color: 'var(--techwave-body-color)' }}>
              Mantente al día con todas las actualizaciones, nuevas funcionalidades y mejoras de GatherLake AI.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Version Selector */}
            <div className="lg:col-span-1">
              <div 
                className="rounded-xl p-6 sticky top-8"
                style={{ backgroundColor: 'var(--techwave-some-r-bg-color)', border: '1px solid var(--techwave-border-color)' }}
              >
                <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--techwave-heading-color)' }}>
                  Versiones
                </h3>
                <div className="space-y-2">
                  {Object.keys(changelogData).map((version) => (
                    <button
                      key={version}
                      onClick={() => setSelectedVersion(version)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        selectedVersion === version 
                          ? 'ring-2 ring-blue-500' 
                          : 'hover:bg-opacity-80'
                      }`}
                      style={{ 
                        backgroundColor: selectedVersion === version 
                          ? 'var(--techwave-some-a-bg-color)' 
                          : 'var(--techwave-some-a-bg-color)'
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium" style={{ color: 'var(--techwave-heading-color)' }}>
                          v{version}
                        </span>
                        {getVersionTypeIcon(changelogData[version as keyof typeof changelogData].type)}
                      </div>
                      <p className="text-sm mt-1" style={{ color: 'var(--techwave-body-color)' }}>
                        {changelogData[version as keyof typeof changelogData].date}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Version Details */}
            <div className="lg:col-span-3">
              {currentVersion && (
                <div 
                  className="rounded-xl p-8"
                  style={{ backgroundColor: 'var(--techwave-some-r-bg-color)', border: '1px solid var(--techwave-border-color)' }}
                >
                  {/* Version Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <div className="flex items-center mb-2">
                        <h2 className="text-3xl font-bold mr-4" style={{ color: 'var(--techwave-heading-color)' }}>
                          v{currentVersion.version}
                        </h2>
                        {getVersionTypeIcon(currentVersion.type)}
                      </div>
                      <p className="text-lg" style={{ color: 'var(--techwave-body-color)' }}>
                        {currentVersion.date} • {getVersionTypeLabel(currentVersion.type)}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        <Package className="h-4 w-4 mr-1" />
                        {currentVersion.type === 'major' ? 'Breaking Changes' : 'Safe Update'}
                      </span>
                    </div>
                  </div>

                  {/* Highlights */}
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold mb-4" style={{ color: 'var(--techwave-heading-color)' }}>
                      ✨ Destacados
                    </h3>
                    <ul className="space-y-2">
                      {currentVersion.highlights.map((highlight, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-yellow-500 mr-2">•</span>
                          <span style={{ color: 'var(--techwave-heading-color)' }}>
                            {highlight}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Detailed Changes */}
                  <div className="space-y-6">
                    {currentVersion.changes.added.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold mb-3 flex items-center" style={{ color: 'var(--techwave-heading-color)' }}>
                          <Plus className="h-5 w-5 mr-2 text-green-500" />
                          Nuevas Funcionalidades
                        </h3>
                        <ul className="space-y-2">
                          {currentVersion.changes.added.map((item, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-green-500 mr-2">+</span>
                              <span style={{ color: 'var(--techwave-heading-color)' }}>
                                {item}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {currentVersion.changes.improved.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold mb-3 flex items-center" style={{ color: 'var(--techwave-heading-color)' }}>
                          <Zap className="h-5 w-5 mr-2 text-blue-500" />
                          Mejoras
                        </h3>
                        <ul className="space-y-2">
                          {currentVersion.changes.improved.map((item, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-blue-500 mr-2">⚡</span>
                              <span style={{ color: 'var(--techwave-heading-color)' }}>
                                {item}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {currentVersion.changes.fixed.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold mb-3 flex items-center" style={{ color: 'var(--techwave-heading-color)' }}>
                          <Bug className="h-5 w-5 mr-2 text-red-500" />
                          Correcciones
                        </h3>
                        <ul className="space-y-2">
                          {currentVersion.changes.fixed.map((item, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-red-500 mr-2">🐛</span>
                              <span style={{ color: 'var(--techwave-heading-color)' }}>
                                {item}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Additional Information */}
          <div className="mt-16 text-center">
            <div 
              className="rounded-xl p-8"
              style={{ backgroundColor: 'var(--techwave-some-r-bg-color)', border: '1px solid var(--techwave-border-color)' }}
            >
              <Globe className="h-16 w-16 mx-auto mb-4" style={{ color: 'var(--techwave-heading-color)' }} />
              <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--techwave-heading-color)' }}>
                ¿Quieres probar las últimas funcionalidades?
              </h2>
              <p className="text-lg mb-6" style={{ color: 'var(--techwave-body-color)' }}>
                Actualiza a la versión más reciente y disfruta de todas las mejoras.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="/pricing"
                  className="inline-flex items-center px-6 py-3 rounded-lg font-medium transition-colors"
                  style={{ backgroundColor: 'var(--techwave-some-a-bg-color)', color: 'var(--techwave-heading-color)' }}
                >
                  <Star className="h-4 w-4 mr-2" />
                  Ver Planes
                </a>
                <a 
                  href="/documentation"
                  className="inline-flex items-center px-6 py-3 rounded-lg font-medium transition-colors border"
                  style={{ borderColor: 'var(--techwave-border-color)', color: 'var(--techwave-heading-color)' }}
                >
                  <Package className="h-4 w-4 mr-2" />
                  Documentación
                </a>
              </div>
            </div>
          </div>
        </div>
      </FrontendLayout>
    </>
  );
}

// Componente Plus para los iconos
const Plus = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
  </svg>
); 