import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, User, Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, TrendingUp, Star, Zap, Clock, Target, BarChart3 } from 'lucide-react';
import { useChat } from '../hooks/useChat';
import FrontendLayout from '../components/FrontendLayout';

export default function PersonalFeed() {
  const { chatData } = useChat();
  const { userInfo } = chatData;
  
  const [selectedFilter, setSelectedFilter] = useState('all');

  const personalPosts = [
    {
      id: 1,
      type: 'achievement',
      title: '¡Nuevo Logro Desbloqueado!',
      content: 'Has completado 50 consultas exitosas en GatherLake AI. ¡Excelente trabajo!',
      icon: '🏆',
      timestamp: 'Hace 2 horas',
      points: 100,
      category: 'Productivity'
    },
    {
      id: 2,
      type: 'recommendation',
      title: 'Recomendación Personalizada',
      content: 'Basado en tu historial, te recomendamos explorar las funcionalidades de modelos finetunados para mejorar la precisión de tus consultas.',
      icon: '💡',
      timestamp: 'Hace 1 día',
      priority: 'high',
      category: 'AI Features'
    },
    {
      id: 3,
      type: 'activity',
      title: 'Resumen de Actividad',
      content: 'Esta semana has usado 234 tokens, realizaste 12 consultas y conectaste 3 bases de datos diferentes.',
      icon: '📊',
      timestamp: 'Hace 3 días',
      stats: {
        tokens: 234,
        queries: 12,
        connections: 3
      },
      category: 'Analytics'
    },
    {
      id: 4,
      type: 'learning',
      title: 'Nuevo Tutorial Disponible',
      content: 'Aprende a optimizar tus consultas SQL usando las mejores prácticas de GatherLake AI.',
      icon: '📚',
      timestamp: 'Hace 5 días',
      progress: 0,
      duration: '15 min',
      category: 'Education'
    },
    {
      id: 5,
      type: 'community',
      title: 'Actividad en la Comunidad',
      content: 'Tu post sobre "Optimización de consultas complejas" recibió 15 likes y 8 comentarios.',
      icon: '👥',
      timestamp: 'Hace 1 semana',
      engagement: {
        likes: 15,
        comments: 8,
        shares: 3
      },
      category: 'Social'
    }
  ];

  const userStats = {
    totalQueries: 156,
    totalTokens: 2847,
    connections: 5,
    achievements: 8,
    communityPoints: 1250,
    level: 'Expert',
    nextLevel: 'Master',
    progressToNext: 75
  };

  const recentActivity = [
    { action: 'Consulta SQL ejecutada', time: '2 min', tokens: 12 },
    { action: 'Conexión de BD verificada', time: '15 min', tokens: 0 },
    { action: 'Modelo finetunado creado', time: '1 hora', tokens: 45 },
    { action: 'Post compartido en comunidad', time: '3 horas', tokens: 0 },
    { action: 'Consulta compleja optimizada', time: '1 día', tokens: 28 }
  ];

  const filters = [
    { id: 'all', label: 'Todos', icon: User },
    { id: 'achievement', label: 'Logros', icon: Star },
    { id: 'recommendation', label: 'Recomendaciones', icon: Target },
    { id: 'activity', label: 'Actividad', icon: BarChart3 },
    { id: 'learning', label: 'Aprendizaje', icon: Bookmark }
  ];

  const filteredPosts = selectedFilter === 'all' 
    ? personalPosts 
    : personalPosts.filter(post => post.type === selectedFilter);

  const getPostIcon = (type: string) => {
    switch (type) {
      case 'achievement':
        return <Star className="h-6 w-6 text-yellow-500" />;
      case 'recommendation':
        return <Target className="h-6 w-6 text-blue-500" />;
      case 'activity':
        return <BarChart3 className="h-6 w-6 text-green-500" />;
      case 'learning':
        return <Bookmark className="h-6 w-6 text-purple-500" />;
      case 'community':
        return <User className="h-6 w-6 text-pink-500" />;
      default:
        return <User className="h-6 w-6 text-gray-500" />;
    }
  };

  return (
    <>
      <Head title="Personal Feed - GatherLake AI" />
      <FrontendLayout userInfo={userInfo} activePage="personal-feed">
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
              <User className="h-10 w-10" style={{ color: 'var(--techwave-heading-color)' }} />
            </div>
            <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--techwave-heading-color)' }}>
              Personal Feed
            </h1>
            <p className="text-xl max-w-3xl mx-auto" style={{ color: 'var(--techwave-body-color)' }}>
              Tu espacio personal con logros, recomendaciones y actividad personalizada en GatherLake AI.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Feed */}
            <div className="lg:col-span-3">
              {/* Filters */}
              <div className="mb-8">
                <div className="flex flex-wrap gap-2">
                  {filters.map((filter) => (
                    <button
                      key={filter.id}
                      onClick={() => setSelectedFilter(filter.id)}
                      className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                        selectedFilter === filter.id 
                          ? 'ring-2 ring-blue-500' 
                          : 'hover:bg-opacity-80'
                      }`}
                      style={{ 
                        backgroundColor: selectedFilter === filter.id 
                          ? 'var(--techwave-some-a-bg-color)' 
                          : 'var(--techwave-some-a-bg-color)'
                      }}
                    >
                      <filter.icon className="h-4 w-4 mr-2" style={{ color: 'var(--techwave-heading-color)' }} />
                      <span style={{ color: 'var(--techwave-heading-color)' }}>
                        {filter.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Posts */}
              <div className="space-y-6">
                {filteredPosts.map((post) => (
                  <div 
                    key={post.id}
                    className="rounded-xl p-6"
                    style={{ backgroundColor: 'var(--techwave-some-r-bg-color)', border: '1px solid var(--techwave-border-color)' }}
                  >
                    {/* Post Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center mr-3 text-2xl">
                          {post.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg" style={{ color: 'var(--techwave-heading-color)' }}>
                            {post.title}
                          </h3>
                          <p className="text-sm" style={{ color: 'var(--techwave-body-color)' }}>
                            {post.timestamp} • {post.category}
                          </p>
                        </div>
                      </div>
                      <button className="p-2 rounded-lg hover:bg-opacity-80" style={{ backgroundColor: 'var(--techwave-some-a-bg-color)' }}>
                        <MoreHorizontal className="h-4 w-4" style={{ color: 'var(--techwave-body-color)' }} />
                      </button>
                    </div>

                    {/* Post Content */}
                    <div className="mb-4">
                      <p className="text-base leading-relaxed mb-3" style={{ color: 'var(--techwave-heading-color)' }}>
                        {post.content}
                      </p>
                      
                      {/* Stats Display */}
                      {post.stats && (
                        <div className="grid grid-cols-3 gap-4 my-4">
                          <div className="text-center p-3 rounded-lg" style={{ backgroundColor: 'var(--techwave-some-a-bg-color)' }}>
                            <div className="text-xl font-bold" style={{ color: 'var(--techwave-heading-color)' }}>
                              {post.stats.tokens}
                            </div>
                            <div className="text-sm" style={{ color: 'var(--techwave-body-color)' }}>
                              Tokens
                            </div>
                          </div>
                          <div className="text-center p-3 rounded-lg" style={{ backgroundColor: 'var(--techwave-some-a-bg-color)' }}>
                            <div className="text-xl font-bold" style={{ color: 'var(--techwave-heading-color)' }}>
                              {post.stats.queries}
                            </div>
                            <div className="text-sm" style={{ color: 'var(--techwave-body-color)' }}>
                              Consultas
                            </div>
                          </div>
                          <div className="text-center p-3 rounded-lg" style={{ backgroundColor: 'var(--techwave-some-a-bg-color)' }}>
                            <div className="text-xl font-bold" style={{ color: 'var(--techwave-heading-color)' }}>
                              {post.stats.connections}
                            </div>
                            <div className="text-sm" style={{ color: 'var(--techwave-body-color)' }}>
                              Conexiones
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Engagement Display */}
                      {post.engagement && (
                        <div className="flex items-center space-x-6 my-4">
                          <div className="flex items-center space-x-2">
                            <Heart className="h-4 w-4 text-red-500" />
                            <span className="text-sm" style={{ color: 'var(--techwave-heading-color)' }}>
                              {post.engagement.likes}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <MessageCircle className="h-4 w-4 text-blue-500" />
                            <span className="text-sm" style={{ color: 'var(--techwave-heading-color)' }}>
                              {post.engagement.comments}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Share2 className="h-4 w-4 text-green-500" />
                            <span className="text-sm" style={{ color: 'var(--techwave-heading-color)' }}>
                              {post.engagement.shares}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Progress Bar for Learning */}
                      {post.progress !== undefined && (
                        <div className="my-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium" style={{ color: 'var(--techwave-heading-color)' }}>
                              Progreso
                            </span>
                            <span className="text-sm" style={{ color: 'var(--techwave-body-color)' }}>
                              {post.progress}% • {post.duration}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${post.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      )}

                      {/* Points Display */}
                      {post.points && (
                        <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                          <Star className="h-4 w-4 mr-1" />
                          +{post.points} puntos
                        </div>
                      )}
                    </div>

                    {/* Post Actions */}
                    <div className="flex items-center justify-between pt-4" style={{ borderTop: '1px solid var(--techwave-border-color)' }}>
                      <div className="flex items-center space-x-6">
                        <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-opacity-80 transition-colors" style={{ backgroundColor: 'var(--techwave-some-a-bg-color)' }}>
                          <Heart className="h-4 w-4" style={{ color: 'var(--techwave-body-color)' }} />
                          <span className="text-sm" style={{ color: 'var(--techwave-heading-color)' }}>
                            Me gusta
                          </span>
                        </button>
                        <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-opacity-80 transition-colors" style={{ backgroundColor: 'var(--techwave-some-a-bg-color)' }}>
                          <MessageCircle className="h-4 w-4" style={{ color: 'var(--techwave-body-color)' }} />
                          <span className="text-sm" style={{ color: 'var(--techwave-heading-color)' }}>
                            Comentar
                          </span>
                        </button>
                        <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-opacity-80 transition-colors" style={{ backgroundColor: 'var(--techwave-some-a-bg-color)' }}>
                          <Share2 className="h-4 w-4" style={{ color: 'var(--techwave-heading-color)' }} />
                          <span className="text-sm" style={{ color: 'var(--techwave-heading-color)' }}>
                            Compartir
                          </span>
                        </button>
                      </div>
                      <button className="p-2 rounded-lg hover:bg-opacity-80 transition-colors" style={{ backgroundColor: 'var(--techwave-some-a-bg-color)' }}>
                        <Bookmark className="h-4 w-4" style={{ color: 'var(--techwave-body-color)' }} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="space-y-6">
                {/* User Stats */}
                <div 
                  className="rounded-xl p-6"
                  style={{ backgroundColor: 'var(--techwave-some-r-bg-color)', border: '1px solid var(--techwave-border-color)' }}
                >
                  <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--techwave-heading-color)' }}>
                    Tus Estadísticas
                  </h3>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold mb-1" style={{ color: 'var(--techwave-heading-color)' }}>
                        {userStats.level}
                      </div>
                      <div className="text-sm" style={{ color: 'var(--techwave-body-color)' }}>
                        Nivel Actual
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold mb-1" style={{ color: 'var(--techwave-heading-color)' }}>
                        {userStats.achievements}
                      </div>
                      <div className="text-sm" style={{ color: 'var(--techwave-body-color)' }}>
                        Logros
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold mb-1" style={{ color: 'var(--techwave-heading-color)' }}>
                        {userStats.communityPoints}
                      </div>
                      <div className="text-sm" style={{ color: 'var(--techwave-body-color)' }}>
                        Puntos Comunidad
                      </div>
                    </div>
                    
                    {/* Progress to Next Level */}
                    <div className="mt-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm" style={{ color: 'var(--techwave-heading-color)' }}>
                          Progreso a {userStats.nextLevel}
                        </span>
                        <span className="text-sm" style={{ color: 'var(--techwave-body-color)' }}>
                          {userStats.progressToNext}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${userStats.progressToNext}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div 
                  className="rounded-xl p-6"
                  style={{ backgroundColor: 'var(--techwave-some-r-bg-color)', border: '1px solid var(--techwave-border-color)' }}
                >
                  <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--techwave-heading-color)' }}>
                    Actividad Reciente
                  </h3>
                  <div className="space-y-3">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-center justify-between p-2 rounded-lg" style={{ backgroundColor: 'var(--techwave-some-a-bg-color)' }}>
                        <div className="flex-1">
                          <p className="text-sm font-medium" style={{ color: 'var(--techwave-heading-color)' }}>
                            {activity.action}
                          </p>
                          <p className="text-xs" style={{ color: 'var(--techwave-body-color)' }}>
                            {activity.time}
                          </p>
                        </div>
                        {activity.tokens > 0 && (
                          <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                            +{activity.tokens}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div 
                  className="rounded-xl p-6"
                  style={{ backgroundColor: 'var(--techwave-some-r-bg-color)', border: '1px solid var(--techwave-border-color)' }}
                >
                  <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--techwave-heading-color)' }}>
                    Acciones Rápidas
                  </h3>
                  <div className="space-y-3">
                    <button className="w-full text-left p-3 rounded-lg transition-colors hover:bg-opacity-80" style={{ backgroundColor: 'var(--techwave-some-a-bg-color)' }}>
                      <div className="flex items-center">
                        <Target className="h-4 w-4 mr-2" style={{ color: 'var(--techwave-heading-color)' }} />
                        <span className="text-sm font-medium" style={{ color: 'var(--techwave-heading-color)' }}>
                          Ver Logros
                        </span>
                      </div>
                    </button>
                    <button className="w-full text-left p-3 rounded-lg transition-colors hover:bg-opacity-80" style={{ backgroundColor: 'var(--techwave-some-a-bg-color)' }}>
                      <div className="flex items-center">
                        <BarChart3 className="h-4 w-4 mr-2" style={{ color: 'var(--techwave-heading-color)' }} />
                        <span className="text-sm font-medium" style={{ color: 'var(--techwave-heading-color)' }}>
                          Estadísticas Detalladas
                        </span>
                      </div>
                    </button>
                    <button className="w-full text-left p-3 rounded-lg transition-colors hover:bg-opacity-80" style={{ backgroundColor: 'var(--techwave-some-a-bg-color)' }}>
                      <div className="flex items-center">
                        <Bookmark className="h-4 w-4 mr-2" style={{ color: 'var(--techwave-heading-color)' }} />
                        <span className="text-sm font-medium" style={{ color: 'var(--techwave-heading-color)' }}>
                          Tutoriales
                        </span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </FrontendLayout>
    </>
  );
} 