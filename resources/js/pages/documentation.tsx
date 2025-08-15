import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, BookOpen, FileText, Code, Database, MessageSquare, Users, Zap, Shield, Globe } from 'lucide-react';
import { useChat } from '../hooks/useChat';
import FrontendLayout from '../components/FrontendLayout';

export default function Documentation() {
  const { chatData } = useChat();
  const { userInfo } = chatData;

  const documentationSections = [
    {
      title: 'Primeros Pasos',
      icon: BookOpen,
      items: [
        { title: 'Instalación y Configuración', description: 'Guía completa para configurar GatherLake AI', href: '#installation' },
        { title: 'Configuración de Base de Datos', description: 'Cómo conectar tu primera base de datos', href: '#database-setup' },
        { title: 'Primera Consulta', description: 'Realiza tu primera consulta en lenguaje natural', href: '#first-query' }
      ]
    },
    {
      title: 'Características Principales',
      icon: Zap,
      items: [
        { title: 'NL2SQL', description: 'Convierte lenguaje natural a consultas SQL', href: '#nl2sql' },
        { title: 'Chat Inteligente', description: 'Asistente AI para consultas de base de datos', href: '#chat' },
        { title: 'Conexiones Múltiples', description: 'Gestiona múltiples bases de datos', href: '#connections' }
      ]
    },
    {
      title: 'API y Desarrollo',
      icon: Code,
      items: [
        { title: 'API REST', description: 'Documentación completa de la API', href: '#api' },
        { title: 'SDKs y Librerías', description: 'Clientes oficiales para diferentes lenguajes', href: '#sdks' },
        { title: 'Webhooks', description: 'Configuración de notificaciones en tiempo real', href: '#webhooks' }
      ]
    },
    {
      title: 'Seguridad y Privacidad',
      icon: Shield,
      items: [
        { title: 'Autenticación', description: 'Sistemas de seguridad implementados', href: '#auth' },
        { title: 'Encriptación', description: 'Protección de datos sensibles', href: '#encryption' },
        { title: 'Compliance', description: 'Cumplimiento de regulaciones de privacidad', href: '#compliance' }
      ]
    }
  ];

  const quickStartSteps = [
    {
      step: 1,
      title: 'Crear Cuenta',
      description: 'Regístrate en GatherLake AI y verifica tu email'
    },
    {
      step: 2,
      title: 'Conectar Base de Datos',
      description: 'Agrega tu primera conexión de base de datos'
    },
    {
      step: 3,
      title: 'Realizar Primera Consulta',
      description: 'Usa el chat para hacer consultas en lenguaje natural'
    },
    {
      step: 4,
      title: 'Explorar Funcionalidades',
      description: 'Descubre todas las herramientas disponibles'
    }
  ];

  return (
    <>
      <Head title="Documentación - GatherLake AI" />
      <FrontendLayout userInfo={userInfo} activePage="documentation">
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

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6" style={{ backgroundColor: 'var(--techwave-some-a-bg-color)', border: '1px solid var(--techwave-border-color)' }}>
              <BookOpen className="h-10 w-10" style={{ color: 'var(--techwave-heading-color)' }} />
            </div>
            <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--techwave-heading-color)' }}>
              Documentación de GatherLake AI
            </h1>
            <p className="text-xl max-w-3xl mx-auto" style={{ color: 'var(--techwave-body-color)' }}>
              Todo lo que necesitas saber para comenzar con GatherLake AI y aprovechar al máximo nuestras herramientas de inteligencia artificial para bases de datos.
            </p>
          </div>

          {/* Quick Start Section */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-8 text-center" style={{ color: 'var(--techwave-heading-color)' }}>
              Comienza en 4 Pasos
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickStartSteps.map((step) => (
                <div 
                  key={step.step}
                  className="text-center p-6 rounded-xl"
                  style={{ backgroundColor: 'var(--techwave-some-r-bg-color)', border: '1px solid var(--techwave-border-color)' }}
                >
                  <div className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center text-lg font-bold" style={{ backgroundColor: 'var(--techwave-some-a-bg-color)', color: 'var(--techwave-heading-color)' }}>
                    {step.step}
                  </div>
                  <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--techwave-heading-color)' }}>
                    {step.title}
                  </h3>
                  <p className="text-sm" style={{ color: 'var(--techwave-body-color)' }}>
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Documentation Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {documentationSections.map((section) => (
              <div 
                key={section.title}
                className="rounded-xl p-6"
                style={{ backgroundColor: 'var(--techwave-some-r-bg-color)', border: '1px solid var(--techwave-border-color)' }}
              >
                <div className="flex items-center mb-4">
                  <section.icon className="h-6 w-6 mr-3" style={{ color: 'var(--techwave-heading-color)' }} />
                  <h3 className="text-xl font-semibold" style={{ color: 'var(--techwave-heading-color)' }}>
                    {section.title}
                  </h3>
                </div>
                <div className="space-y-3">
                  {section.items.map((item) => (
                    <div key={item.title} className="group">
                      <a 
                        href={item.href}
                        className="block p-3 rounded-lg transition-all duration-200 hover:scale-105"
                        style={{ backgroundColor: 'var(--techwave-some-a-bg-color)' }}
                      >
                        <h4 className="font-medium mb-1 group-hover:underline" style={{ color: 'var(--techwave-heading-color)' }}>
                          {item.title}
                        </h4>
                        <p className="text-sm" style={{ color: 'var(--techwave-body-color)' }}>
                          {item.description}
                        </p>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Additional Resources */}
          <div className="mt-16 text-center">
            <h2 className="text-2xl font-bold mb-8" style={{ color: 'var(--techwave-heading-color)' }}>
              Recursos Adicionales
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div 
                className="p-6 rounded-xl text-center"
                style={{ backgroundColor: 'var(--techwave-some-r-bg-color)', border: '1px solid var(--techwave-border-color)' }}
              >
                <Users className="h-12 w-12 mx-auto mb-4" style={{ color: 'var(--techwave-heading-color)' }} />
                <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--techwave-heading-color)' }}>
                  Comunidad
                </h3>
                <p className="text-sm mb-4" style={{ color: 'var(--techwave-body-color)' }}>
                  Únete a nuestra comunidad de desarrolladores
                </p>
                <a 
                  href="#"
                  className="inline-block px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  style={{ backgroundColor: 'var(--techwave-some-a-bg-color)', color: 'var(--techwave-heading-color)' }}
                >
                  Unirse
                </a>
              </div>
              
              <div 
                className="p-6 rounded-xl text-center"
                style={{ backgroundColor: 'var(--techwave-some-r-bg-color)', border: '1px solid var(--techwave-border-color)' }}
              >
                <MessageSquare className="h-12 w-12 mx-auto mb-4" style={{ color: 'var(--techwave-heading-color)' }} />
                <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--techwave-heading-color)' }}>
                  Soporte
                </h3>
                <p className="text-sm mb-4" style={{ color: 'var(--techwave-body-color)' }}>
                  Obtén ayuda de nuestro equipo de soporte
                </p>
                <a 
                  href="/contact"
                  className="inline-block px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  style={{ backgroundColor: 'var(--techwave-some-a-bg-color)', color: 'var(--techwave-heading-color)' }}
                >
                  Contactar
                </a>
              </div>
              
              <div 
                className="p-6 rounded-xl text-center"
                style={{ backgroundColor: 'var(--techwave-some-r-bg-color)', border: '1px solid var(--techwave-border-color)' }}
              >
                <Globe className="h-12 w-12 mx-auto mb-4" style={{ color: 'var(--techwave-heading-color)' }} />
                <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--techwave-heading-color)' }}>
                  Blog
                </h3>
                <p className="text-sm mb-4" style={{ color: 'var(--techwave-body-color)' }}>
                  Últimas noticias y tutoriales
                </p>
                <a 
                  href="#"
                  className="inline-block px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  style={{ backgroundColor: 'var(--techwave-some-a-bg-color)', color: 'var(--techwave-heading-color)' }}
                >
                  Leer
                </a>
              </div>
            </div>
          </div>
        </div>
      </FrontendLayout>
    </>
  );
} 