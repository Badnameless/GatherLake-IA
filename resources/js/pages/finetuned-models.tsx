import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Brain, Plus, Settings, Play, Pause, Trash2, Download, Upload, BarChart3, Zap, Target, Clock } from 'lucide-react';
import { useChat } from '../hooks/useChat';
import FrontendLayout from '../components/FrontendLayout';

export default function FinetunedModels() {
  const { chatData } = useChat();
  const { userInfo } = chatData;
  
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const finetunedModels = [
    {
      id: 'model-1',
      name: 'SQL Expert Pro',
      description: 'Modelo especializado en consultas SQL complejas y optimización de bases de datos',
      status: 'active',
      accuracy: 94.2,
      trainingData: '10,000 queries',
      lastUpdated: 'Hace 2 días',
      usage: 156,
      performance: {
        responseTime: '0.8s',
        successRate: 96.5,
        userSatisfaction: 4.8
      },
      tags: ['SQL', 'Database', 'Optimization'],
      version: '2.1.0'
    },
    {
      id: 'model-2',
      name: 'Business Analytics AI',
      description: 'Modelo entrenado para análisis de datos empresariales y reportes ejecutivos',
      status: 'training',
      accuracy: 87.3,
      trainingData: '5,000 reports',
      lastUpdated: 'En entrenamiento',
      usage: 89,
      performance: {
        responseTime: '1.2s',
        successRate: 91.2,
        userSatisfaction: 4.6
      },
      tags: ['Analytics', 'Business', 'Reports'],
      version: '1.3.0'
    },
    {
      id: 'model-3',
      name: 'E-commerce Specialist',
      description: 'Modelo optimizado para consultas relacionadas con comercio electrónico y análisis de ventas',
      status: 'inactive',
      accuracy: 92.1,
      trainingData: '8,000 transactions',
      lastUpdated: 'Hace 1 semana',
      usage: 234,
      performance: {
        responseTime: '0.9s',
        successRate: 94.8,
        userSatisfaction: 4.7
      },
      tags: ['E-commerce', 'Sales', 'Transactions'],
      version: '1.8.0'
    }
  ];

  const modelStats = {
    totalModels: 3,
    activeModels: 1,
    trainingModels: 1,
    totalUsage: 479,
    averageAccuracy: 91.2,
    totalTrainingData: '23,000 samples'
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-500 bg-green-100';
      case 'training':
        return 'text-yellow-500 bg-yellow-100';
      case 'inactive':
        return 'text-gray-500 bg-gray-100';
      default:
        return 'text-gray-500 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Play className="h-4 w-4" />;
      case 'training':
        return <Clock className="h-4 w-4" />;
      case 'inactive':
        return <Pause className="h-4 w-4" />;
      default:
        return <Pause className="h-4 w-4" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Activo';
      case 'training':
        return 'Entrenando';
      case 'inactive':
        return 'Inactivo';
      default:
        return 'Desconocido';
    }
  };

  return (
    <>
      <Head title="Modelos Finetunados - GatherLake AI" />
      <FrontendLayout userInfo={userInfo} activePage="finetuned-models">
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
              <Brain className="h-10 w-10" style={{ color: 'var(--techwave-heading-color)' }} />
            </div>
            <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--techwave-heading-color)' }}>
              Modelos Finetunados
            </h1>
            <p className="text-xl max-w-3xl mx-auto" style={{ color: 'var(--techwave-body-color)' }}>
              Crea, entrena y gestiona modelos de IA personalizados para optimizar tus consultas específicas y mejorar la precisión de GatherLake AI.
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div 
              className="rounded-xl p-6 text-center"
              style={{ backgroundColor: 'var(--techwave-some-r-bg-color)', border: '1px solid var(--techwave-border-color)' }}
            >
              <Brain className="h-8 w-8 mx-auto mb-3" style={{ color: 'var(--techwave-heading-color)' }} />
              <div className="text-2xl font-bold mb-1" style={{ color: 'var(--techwave-heading-color)' }}>
                {modelStats.totalModels}
              </div>
              <div className="text-sm" style={{ color: 'var(--techwave-body-color)' }}>
                Modelos Totales
              </div>
            </div>
            <div 
              className="rounded-xl p-6 text-center"
              style={{ backgroundColor: 'var(--techwave-some-r-bg-color)', border: '1px solid var(--techwave-border-color)' }}
            >
              <Zap className="h-8 w-8 mx-auto mb-3" style={{ color: 'var(--techwave-heading-color)' }} />
              <div className="text-2xl font-bold mb-1" style={{ color: 'var(--techwave-heading-color)' }}>
                {modelStats.activeModels}
              </div>
              <div className="text-sm" style={{ color: 'var(--techwave-body-color)' }}>
                Modelos Activos
              </div>
            </div>
            <div 
              className="rounded-xl p-6 text-center"
              style={{ backgroundColor: 'var(--techwave-some-r-bg-color)', border: '1px solid var(--techwave-border-color)' }}
            >
              <Target className="h-8 w-8 mx-auto mb-3" style={{ color: 'var(--techwave-heading-color)' }} />
              <div className="text-2xl font-bold mb-1" style={{ color: 'var(--techwave-heading-color)' }}>
                {modelStats.averageAccuracy}%
              </div>
              <div className="text-sm" style={{ color: 'var(--techwave-body-color)' }}>
                Precisión Promedio
              </div>
            </div>
            <div 
              className="rounded-xl p-6 text-center"
              style={{ backgroundColor: 'var(--techwave-some-r-bg-color)', border: '1px solid var(--techwave-border-color)' }}
            >
              <BarChart3 className="h-8 w-8 mx-auto mb-3" style={{ color: 'var(--techwave-heading-color)' }} />
              <div className="text-2xl font-bold mb-1" style={{ color: 'var(--techwave-heading-color)' }}>
                {modelStats.totalUsage}
              </div>
              <div className="text-sm" style={{ color: 'var(--techwave-body-color)' }}>
                Usos Totales
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <button 
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center px-6 py-3 rounded-lg font-medium transition-colors"
              style={{ backgroundColor: 'var(--techwave-some-a-bg-color)', color: 'var(--techwave-heading-color)' }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Crear Nuevo Modelo
            </button>
            <button className="inline-flex items-center px-6 py-3 rounded-lg font-medium transition-colors border" style={{ borderColor: 'var(--techwave-border-color)', color: 'var(--techwave-heading-color)' }}>
              <Upload className="h-4 w-4 mr-2" />
              Importar Modelo
            </button>
            <button className="inline-flex items-center px-6 py-3 rounded-lg font-medium transition-colors border" style={{ borderColor: 'var(--techwave-border-color)', color: 'var(--techwave-heading-color)' }}>
              <BarChart3 className="h-4 w-4 mr-2" />
              Ver Analytics
            </button>
          </div>

          {/* Models Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {finetunedModels.map((model) => (
              <div 
                key={model.id}
                className={`rounded-xl p-6 cursor-pointer transition-all duration-200 hover:scale-105 ${
                  selectedModel === model.id ? 'ring-2 ring-blue-500' : ''
                }`}
                style={{ backgroundColor: 'var(--techwave-some-r-bg-color)', border: '1px solid var(--techwave-border-color)' }}
                onClick={() => setSelectedModel(model.id)}
              >
                {/* Model Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--techwave-heading-color)' }}>
                      {model.name}
                    </h3>
                    <p className="text-sm mb-3" style={{ color: 'var(--techwave-body-color)' }}>
                      {model.description}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(model.status)}`}>
                      {getStatusIcon(model.status)}
                      <span className="ml-1">{getStatusLabel(model.status)}</span>
                    </span>
                  </div>
                </div>

                {/* Model Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center p-3 rounded-lg" style={{ backgroundColor: 'var(--techwave-some-a-bg-color)' }}>
                    <div className="text-lg font-bold" style={{ color: 'var(--techwave-heading-color)' }}>
                      {model.accuracy}%
                    </div>
                    <div className="text-xs" style={{ color: 'var(--techwave-body-color)' }}>
                      Precisión
                    </div>
                  </div>
                  <div className="text-center p-3 rounded-lg" style={{ backgroundColor: 'var(--techwave-some-a-bg-color)' }}>
                    <div className="text-lg font-bold" style={{ color: 'var(--techwave-heading-color)' }}>
                      {model.usage}
                    </div>
                    <div className="text-xs" style={{ color: 'var(--techwave-body-color)' }}>
                      Usos
                    </div>
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-2" style={{ color: 'var(--techwave-heading-color)' }}>
                    Métricas de Rendimiento
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span style={{ color: 'var(--techwave-body-color)' }}>Tiempo de Respuesta:</span>
                      <span style={{ color: 'var(--techwave-heading-color)' }}>{model.performance.responseTime}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span style={{ color: 'var(--techwave-body-color)' }}>Tasa de Éxito:</span>
                      <span style={{ color: 'var(--techwave-heading-color)' }}>{model.performance.successRate}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span style={{ color: 'var(--techwave-body-color)' }}>Satisfacción:</span>
                      <span style={{ color: 'var(--techwave-heading-color)' }}>{model.performance.userSatisfaction}/5</span>
                    </div>
                  </div>
                </div>

                {/* Tags and Version */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex flex-wrap gap-2">
                    {model.tags.map((tag) => (
                      <span 
                        key={tag}
                        className="px-2 py-1 rounded-full text-xs font-medium"
                        style={{ backgroundColor: 'var(--techwave-some-a-bg-color)', color: 'var(--techwave-heading-color)' }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <span className="text-xs font-medium px-2 py-1 rounded-full" style={{ backgroundColor: 'var(--techwave-some-a-bg-color)', color: 'var(--techwave-body-color)' }}>
                    v{model.version}
                  </span>
                </div>

                {/* Model Actions */}
                <div className="flex items-center justify-between pt-4" style={{ borderTop: '1px solid var(--techwave-border-color)' }}>
                  <div className="text-xs" style={{ color: 'var(--techwave-body-color)' }}>
                    Actualizado: {model.lastUpdated}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 rounded-lg hover:bg-opacity-80 transition-colors" style={{ backgroundColor: 'var(--techwave-some-a-bg-color)' }}>
                      <Settings className="h-4 w-4" style={{ color: 'var(--techwave-body-color)' }} />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-opacity-80 transition-colors" style={{ backgroundColor: 'var(--techwave-some-a-bg-color)' }}>
                      <Download className="h-4 w-4" style={{ color: 'var(--techwave-body-color)' }} />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-opacity-80 transition-colors" style={{ backgroundColor: 'var(--techwave-some-a-bg-color)' }}>
                      <Trash2 className="h-4 w-4" style={{ color: 'var(--techwave-body-color)' }} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Additional Information */}
          <div className="mt-16 text-center">
            <div 
              className="rounded-xl p-8"
              style={{ backgroundColor: 'var(--techwave-some-r-bg-color)', border: '1px solid var(--techwave-border-color)' }}
            >
              <Brain className="h-16 w-16 mx-auto mb-4" style={{ color: 'var(--techwave-heading-color)' }} />
              <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--techwave-heading-color)' }}>
                ¿Listo para crear tu primer modelo personalizado?
              </h2>
              <p className="text-lg mb-6" style={{ color: 'var(--techwave-body-color)' }}>
                Los modelos finetunados te permiten adaptar GatherLake AI a tus necesidades específicas y mejorar significativamente la precisión de tus consultas.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={() => setShowCreateModal(true)}
                  className="inline-flex items-center px-6 py-3 rounded-lg font-medium transition-colors"
                  style={{ backgroundColor: 'var(--techwave-some-a-bg-color)', color: 'var(--techwave-heading-color)' }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Comenzar Ahora
                </button>
                <a 
                  href="/documentation"
                  className="inline-flex items-center px-6 py-3 rounded-lg font-medium transition-colors border"
                  style={{ borderColor: 'var(--techwave-border-color)', color: 'var(--techwave-heading-color)' }}
                >
                  <Brain className="h-4 w-4 mr-2" />
                  Ver Documentación
                </a>
              </div>
            </div>
          </div>
        </div>
      </FrontendLayout>
    </>
  );
} 