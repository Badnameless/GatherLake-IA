import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Users, Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, TrendingUp, Star, Zap } from 'lucide-react';
import { useChat } from '../hooks/useChat';
import FrontendLayout from '../components/FrontendLayout';

export default function CommunityFeed() {
  const { chatData } = useChat();
  const { userInfo } = chatData;
  
  const [selectedFilter, setSelectedFilter] = useState('all');

  const communityPosts = [
    {
      id: 1,
      author: {
        name: 'María García',
        avatar: '/images/avatar.jpg',
        role: 'Data Scientist',
        verified: true
      },
      content: '¡Acabo de descubrir una funcionalidad increíble en GatherLake AI! El sistema de consultas en lenguaje natural me permitió analizar una base de datos compleja en minutos. ¿Alguien más ha probado las nuevas características de NL2SQL?',
      timestamp: '2 horas',
      likes: 24,
      comments: 8,
      shares: 3,
      tags: ['NL2SQL', 'Data Analysis', 'Tips'],
      type: 'discussion'
    },
    {
      id: 2,
      author: {
        name: 'Carlos Rodríguez',
        avatar: '/images/avatar.jpg',
        role: 'Full Stack Developer',
        verified: false
      },
      content: 'Compartiendo mi experiencia integrando GatherLake AI con mi aplicación React. La API es súper intuitiva y la documentación está muy bien estructurada. Aquí está el código de ejemplo:',
      code: `const query = await gatherlake.query({
  text: "Muestra los usuarios más activos del mes",
  connection: "production_db"
});`,
      timestamp: '5 horas',
      likes: 18,
      comments: 12,
      shares: 5,
      tags: ['API', 'React', 'Integration'],
      type: 'code'
    },
    {
      id: 3,
      author: {
        name: 'Ana Martínez',
        avatar: '/images/avatar.jpg',
        role: 'Database Administrator',
        verified: true
      },
      content: '🚀 Nueva actualización disponible: v4.1.2 incluye mejoras significativas en el rendimiento y nuevas funcionalidades de seguridad. ¡Recomiendo actualizar lo antes posible!',
      timestamp: '1 día',
      likes: 45,
      comments: 15,
      shares: 22,
      tags: ['Update', 'Security', 'Performance'],
      type: 'announcement'
    },
    {
      id: 4,
      author: {
        name: 'David López',
        avatar: '/images/avatar.jpg',
        role: 'Business Analyst',
        verified: false
      },
      content: '¿Alguien puede ayudarme con una consulta compleja? Necesito encontrar transacciones duplicadas en una tabla de ventas con millones de registros. GatherLake AI me dio una buena base pero quiero optimizarla.',
      timestamp: '2 días',
      likes: 7,
      comments: 23,
      shares: 1,
      tags: ['Help', 'SQL', 'Optimization'],
      type: 'question'
    }
  ];

  const trendingTopics = [
    { name: 'NL2SQL', count: 156, trend: 'up' },
    { name: 'API Integration', count: 89, trend: 'up' },
    { name: 'Performance Tips', count: 67, trend: 'stable' },
    { name: 'Security Features', count: 45, trend: 'up' },
    { name: 'Database Connections', count: 34, trend: 'down' }
  ];

  const filters = [
    { id: 'all', label: 'Todos', icon: Users },
    { id: 'discussion', label: 'Discusiones', icon: MessageCircle },
    { id: 'code', label: 'Código', icon: Zap },
    { id: 'announcement', label: 'Anuncios', icon: Star },
    { id: 'question', label: 'Preguntas', icon: TrendingUp }
  ];

  const filteredPosts = selectedFilter === 'all' 
    ? communityPosts 
    : communityPosts.filter(post => post.type === selectedFilter);

  const formatNumber = (num: number) => {
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toString();
  };

  return (
    <>
      <Head title="Community Feed - GatherLake AI" />
      <FrontendLayout userInfo={userInfo} activePage="community-feed">
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
              <Users className="h-10 w-10" style={{ color: 'var(--techwave-heading-color)' }} />
            </div>
            <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--techwave-heading-color)' }}>
              Community Feed
            </h1>
            <p className="text-xl max-w-3xl mx-auto" style={{ color: 'var(--techwave-body-color)' }}>
              Conecta con otros desarrolladores, comparte experiencias y descubre las mejores prácticas para usar GatherLake AI.
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
                        <img 
                          src={post.author.avatar} 
                          alt={post.author.name}
                          className="w-12 h-12 rounded-full mr-3"
                        />
                        <div>
                          <div className="flex items-center">
                            <h3 className="font-semibold mr-2" style={{ color: 'var(--techwave-heading-color)' }}>
                              {post.author.name}
                            </h3>
                            {post.author.verified && (
                              <span className="text-blue-500">✓</span>
                            )}
                          </div>
                          <p className="text-sm" style={{ color: 'var(--techwave-body-color)' }}>
                            {post.author.role} • {post.timestamp}
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
                      
                      {/* Code Block */}
                      {post.code && (
                        <div className="my-4 p-4 rounded-lg" style={{ backgroundColor: 'var(--techwave-some-a-bg-color)' }}>
                          <pre className="text-sm overflow-x-auto">
                            <code style={{ color: 'var(--techwave-heading-color)' }}>
                              {post.code}
                            </code>
                          </pre>
                        </div>
                      )}

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2">
                        {post.tags.map((tag) => (
                          <span 
                            key={tag}
                            className="px-3 py-1 rounded-full text-xs font-medium"
                            style={{ backgroundColor: 'var(--techwave-some-a-bg-color)', color: 'var(--techwave-heading-color)' }}
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Post Actions */}
                    <div className="flex items-center justify-between pt-4" style={{ borderTop: '1px solid var(--techwave-border-color)' }}>
                      <div className="flex items-center space-x-6">
                        <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-opacity-80 transition-colors" style={{ backgroundColor: 'var(--techwave-some-a-bg-color)' }}>
                          <Heart className="h-4 w-4" style={{ color: 'var(--techwave-body-color)' }} />
                          <span className="text-sm" style={{ color: 'var(--techwave-heading-color)' }}>
                            {formatNumber(post.likes)}
                          </span>
                        </button>
                        <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-opacity-80 transition-colors" style={{ backgroundColor: 'var(--techwave-some-a-bg-color)' }}>
                          <MessageCircle className="h-4 w-4" style={{ color: 'var(--techwave-body-color)' }} />
                          <span className="text-sm" style={{ color: 'var(--techwave-heading-color)' }}>
                            {formatNumber(post.comments)}
                          </span>
                        </button>
                        <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-opacity-80 transition-colors" style={{ backgroundColor: 'var(--techwave-some-a-bg-color)' }}>
                          <Share2 className="h-4 w-4" style={{ color: 'var(--techwave-body-color)' }} />
                          <span className="text-sm" style={{ color: 'var(--techwave-heading-color)' }}>
                            {formatNumber(post.shares)}
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
                {/* Trending Topics */}
                <div 
                  className="rounded-xl p-6"
                  style={{ backgroundColor: 'var(--techwave-some-r-bg-color)', border: '1px solid var(--techwave-border-color)' }}
                >
                  <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--techwave-heading-color)' }}>
                    Temas Trending
                  </h3>
                  <div className="space-y-3">
                    {trendingTopics.map((topic) => (
                      <div key={topic.name} className="flex items-center justify-between">
                        <span className="text-sm" style={{ color: 'var(--techwave-heading-color)' }}>
                          #{topic.name}
                        </span>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs" style={{ color: 'var(--techwave-body-color)' }}>
                            {topic.count}
                          </span>
                          <span className={`text-xs ${
                            topic.trend === 'up' ? 'text-green-500' : 
                            topic.trend === 'down' ? 'text-red-500' : 'text-gray-500'
                          }`}>
                            {topic.trend === 'up' ? '↗' : topic.trend === 'down' ? '↘' : '→'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Community Stats */}
                <div 
                  className="rounded-xl p-6"
                  style={{ backgroundColor: 'var(--techwave-some-r-bg-color)', border: '1px solid var(--techwave-border-color)' }}
                >
                  <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--techwave-heading-color)' }}>
                    Estadísticas de la Comunidad
                  </h3>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold mb-1" style={{ color: 'var(--techwave-heading-color)' }}>
                        12.5k
                      </div>
                      <div className="text-sm" style={{ color: 'var(--techwave-body-color)' }}>
                        Miembros
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold mb-1" style={{ color: 'var(--techwave-heading-color)' }}>
                        2.3k
                      </div>
                      <div className="text-sm" style={{ color: 'var(--techwave-body-color)' }}>
                        Posts este mes
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold mb-1" style={{ color: 'var(--techwave-heading-color)' }}>
                        98%
                      </div>
                      <div className="text-sm" style={{ color: 'var(--techwave-body-color)' }}>
                        Satisfacción
                      </div>
                    </div>
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
                        <MessageCircle className="h-4 w-4 mr-2" style={{ color: 'var(--techwave-heading-color)' }} />
                        <span className="text-sm font-medium" style={{ color: 'var(--techwave-heading-color)' }}>
                          Crear Post
                        </span>
                      </div>
                    </button>
                    <button className="w-full text-left p-3 rounded-lg transition-colors hover:bg-opacity-80" style={{ backgroundColor: 'var(--techwave-some-a-bg-color)' }}>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2" style={{ color: 'var(--techwave-heading-color)' }} />
                        <span className="text-sm font-medium" style={{ color: 'var(--techwave-heading-color)' }}>
                          Invitar Amigos
                        </span>
                      </div>
                    </button>
                    <button className="w-full text-left p-3 rounded-lg transition-colors hover:bg-opacity-80" style={{ backgroundColor: 'var(--techwave-some-a-bg-color)' }}>
                      <div className="flex items-center">
                        <Bookmark className="h-4 w-4 mr-2" style={{ color: 'var(--techwave-heading-color)' }} />
                        <span className="text-sm font-medium" style={{ color: 'var(--techwave-heading-color)' }}>
                          Ver Guardados
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