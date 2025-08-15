@extends('app')

@section('content')
<div class="min-h-screen" style="background-color: var(--techwave-site-bg-color);">
    <!-- Header -->
    <div class="Header">
        <div class="Header__logo">
            <img src="{{ asset('images/logo-desktop-full.png') }}" alt="GatherLake IA" />
        </div>
        <div class="Header__actions">
            <div class="Header__actions--action" onclick="showTokensInfo()">
                <span>Tokens Remain</span>
            </div>
            <div class="Header__actions--action">
                <img src="{{ asset('images/search.svg') }}" alt="Search" />
            </div>
            <div class="Header__actions--action">
                <img src="{{ asset('images/notifications.svg') }}" alt="Notifications" />
            </div>
            <div class="Header__actions--action">
                <img src="{{ asset('images/settings.svg') }}" alt="Settings" />
            </div>
            <div class="Header__actions--action">
                <img src="{{ asset('images/faqsAndHelp.svg') }}" alt="Help" />
            </div>
            <div class="Header__actions--profile">
                <img src="{{ asset('images/avatar.jpg') }}" alt="Profile" />
                <div class="Header__actions--profile-dropdown">
                    <a href="/profile">Profile</a>
                    <a href="/settings">Settings</a>
                    <a href="/billing">Billing</a>
                    <a href="/logout">Logout</a>
                </div>
            </div>
        </div>
    </div>

    <!-- Sidebar -->
    <div class="Sidebar">
        <div class="Sidebar__header">
            <img src="{{ asset('images/logo-desktop-comprimed.png') }}" alt="Logo" />
        </div>
        <nav class="Sidebar__nav">
            <a href="/" class="Sidebar__nav--item active">
                <img src="{{ asset('images/chatbot.svg') }}" alt="Chat" />
                <span>Asistente SQL</span>
            </a>
            <a href="/connections" class="Sidebar__nav--item">
                <img src="{{ asset('images/database.svg') }}" alt="Connections" />
                <span>Conexiones</span>
            </a>
            <a href="/community-feed" class="Sidebar__nav--item">
                <img src="{{ asset('images/communityFeed.svg') }}" alt="Community" />
                <span>Community Feed</span>
            </a>
            <a href="/personal-feed" class="Sidebar__nav--item">
                <img src="{{ asset('images/personalFeed.svg') }}" alt="Personal" />
                <span>Personal Feed</span>
            </a>
            <a href="/finetuned-models" class="Sidebar__nav--item">
                <img src="{{ asset('images/models.svg') }}" alt="Models" />
                <span>Modelos Fine-tuned</span>
            </a>
            <a href="/pricing" class="Sidebar__nav--item">
                <img src="{{ asset('images/pricing.svg') }}" alt="Pricing" />
                <span>Pricing</span>
            </a>
            <a href="/documentation" class="Sidebar__nav--item">
                <img src="{{ asset('images/documentation.svg') }}" alt="Documentation" />
                <span>Documentación</span>
            </a>
            <a href="/faq" class="Sidebar__nav--item">
                <img src="{{ asset('images/faqsAndHelp.svg') }}" alt="FAQ" />
                <span>FAQ</span>
            </a>
            <a href="/changelog" class="Sidebar__nav--item">
                <img src="{{ asset('images/changelog.svg') }}" alt="Changelog" />
                <span>Changelog</span>
            </a>
            <a href="/contact" class="Sidebar__nav--item">
                <img src="{{ asset('images/contact.svg') }}" alt="Contact" />
                <span>Contacto</span>
            </a>
        </nav>
    </div>

    <!-- Main Content -->
    <div class="Content">
        <div class="Content__body">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <!-- Welcome Section -->
                <div class="text-center mb-12">
                    <h1 class="text-4xl font-bold mb-4" style="color: var(--techwave-heading-color);">
                        ¡Bienvenido a GatherLake IA!
                    </h1>
                    <p class="text-xl" style="color: var(--techwave-body-color);">
                        Tu plataforma de inteligencia artificial para consultas SQL
                    </p>
                </div>

                <!-- Key Statistics -->
                <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                    <div class="rounded-xl p-6" style="background-color: var(--techwave-some-r-bg-color); border: 1px solid var(--techwave-border-color);">
                        <div class="flex items-center">
                            <div class="p-3 rounded-lg" style="background-color: var(--techwave-some-a-bg-color);">
                                <svg class="w-6 h-6" style="color: var(--techwave-main-color);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                                </svg>
                            </div>
                            <div class="ml-4">
                                <p class="text-sm font-medium" style="color: var(--techwave-body-color);">Total Usuarios</p>
                                <p class="text-2xl font-bold" style="color: var(--techwave-heading-color);">1,247</p>
                            </div>
                        </div>
                    </div>

                    <div class="rounded-xl p-6" style="background-color: var(--techwave-some-r-bg-color); border: 1px solid var(--techwave-border-color);">
                        <div class="flex items-center">
                            <div class="p-3 rounded-lg" style="background-color: var(--techwave-some-a-bg-color);">
                                <svg class="w-6 h-6" style="color: var(--techwave-main-color);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"></path>
                                </svg>
                            </div>
                            <div class="ml-4">
                                <p class="text-sm font-medium" style="color: var(--techwave-body-color);">Conexiones</p>
                                <p class="text-2xl font-bold" style="color: var(--techwave-heading-color);">89</p>
                            </div>
                        </div>
                    </div>

                    <div class="rounded-xl p-6" style="background-color: var(--techwave-some-r-bg-color); border: 1px solid var(--techwave-border-color);">
                        <div class="flex items-center">
                            <div class="p-3 rounded-lg" style="background-color: var(--techwave-some-a-bg-color);">
                                <svg class="w-6 h-6" style="color: var(--techwave-main-color);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                                </svg>
                            </div>
                            <div class="ml-4">
                                <p class="text-sm font-medium" style="color: var(--techwave-body-color);">Consultas</p>
                                <p class="text-2xl font-bold" style="color: var(--techwave-heading-color);">15,432</p>
                            </div>
                        </div>
                    </div>

                    <div class="rounded-xl p-6" style="background-color: var(--techwave-some-r-bg-color); border: 1px solid var(--techwave-border-color);">
                        <div class="flex items-center">
                            <div class="p-3 rounded-lg" style="background-color: var(--techwave-some-a-bg-color);">
                                <svg class="w-6 h-6" style="color: var(--techwave-main-color);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                                </svg>
                            </div>
                            <div class="ml-4">
                                <p class="text-sm font-medium" style="color: var(--techwave-body-color);">Crecimiento</p>
                                <p class="text-2xl font-bold" style="color: var(--techwave-success-color);">+23%</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Performance Metrics -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                    <div class="rounded-xl p-6" style="background-color: var(--techwave-some-r-bg-color); border: 1px solid var(--techwave-border-color);">
                        <h3 class="text-lg font-semibold mb-4" style="color: var(--techwave-heading-color);">Métricas de Rendimiento</h3>
                        <div class="space-y-4">
                            <div class="flex justify-between items-center">
                                <span style="color: var(--techwave-body-color);">Tiempo de Respuesta</span>
                                <span class="font-semibold" style="color: var(--techwave-heading-color);">1.2s</span>
                            </div>
                            <div class="flex justify-between items-center">
                                <span style="color: var(--techwave-body-color);">Uptime</span>
                                <span class="font-semibold" style="color: var(--techwave-success-color);">99.9%</span>
                            </div>
                            <div class="flex justify-between items-center">
                                <span style="color: var(--techwave-body-color);">Conexiones Activas</span>
                                <span class="font-semibold" style="color: var(--techwave-heading-color);">67</span>
                            </div>
                        </div>
                    </div>

                    <div class="rounded-xl p-6" style="background-color: var(--techwave-some-r-bg-color); border: 1px solid var(--techwave-border-color);">
                        <h3 class="text-lg font-semibold mb-4" style="color: var(--techwave-heading-color);">Acciones Rápidas</h3>
                        <div class="space-y-3">
                            <a href="/connections/create" class="block p-3 rounded-lg transition-colors" style="background-color: var(--techwave-some-a-bg-color); color: var(--techwave-heading-color);">
                                <div class="flex items-center">
                                    <svg class="w-5 h-5 mr-3" style="color: var(--techwave-main-color);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                                    </svg>
                                    Nueva Conexión
                                </div>
                            </a>
                            <a href="/users" class="block p-3 rounded-lg transition-colors" style="background-color: var(--techwave-some-a-bg-color); color: var(--techwave-heading-color);">
                                <div class="flex items-center">
                                    <svg class="w-5 h-5 mr-3" style="color: var(--techwave-main-color);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                                    </svg>
                                    Gestionar Usuarios
                                </div>
                            </a>
                            <a href="/reports" class="block p-3 rounded-lg transition-colors" style="background-color: var(--techwave-some-a-bg-color); color: var(--techwave-heading-color);">
                                <div class="flex items-center">
                                    <svg class="w-5 h-5 mr-3" style="color: var(--techwave-main-color);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                    </svg>
                                    Ver Reportes
                                </div>
                            </a>
                        </div>
                    </div>
                </div>

                <!-- Recent Activity -->
                <div class="rounded-xl p-6 mb-8" style="background-color: var(--techwave-some-r-bg-color); border: 1px solid var(--techwave-border-color);">
                    <h3 class="text-lg font-semibold mb-4" style="color: var(--techwave-heading-color);">Actividad Reciente</h3>
                    <div class="space-y-3">
                        <div class="flex items-center p-3 rounded-lg" style="background-color: var(--techwave-some-a-bg-color);">
                            <div class="w-2 h-2 rounded-full mr-3" style="background-color: var(--techwave-success-color);"></div>
                            <span style="color: var(--techwave-body-color);">Nueva conexión MySQL creada por admin@example.com</span>
                            <span class="ml-auto text-sm" style="color: var(--techwave-body-color);">Hace 2 horas</span>
                        </div>
                        <div class="flex items-center p-3 rounded-lg" style="background-color: var(--techwave-some-a-bg-color);">
                            <div class="w-2 h-2 rounded-full mr-3" style="background-color: var(--techwave-main-color);"></div>
                            <span style="color: var(--techwave-body-color);">Consulta SQL ejecutada en base de datos "production"</span>
                            <span class="ml-auto text-sm" style="color: var(--techwave-body-color);">Hace 4 horas</span>
                        </div>
                        <div class="flex items-center p-3 rounded-lg" style="background-color: var(--techwave-some-a-bg-color);">
                            <div class="w-2 h-2 rounded-full mr-3" style="background-color: var(--techwave-warning-color);"></div>
                            <span style="color: var(--techwave-body-color);">Usuario juan@example.com actualizó su perfil</span>
                            <span class="ml-auto text-sm" style="color: var(--techwave-body-color);">Hace 6 horas</span>
                        </div>
                    </div>
                </div>

                <!-- Platform Features -->
                <div class="rounded-xl p-6" style="background-color: var(--techwave-some-r-bg-color); border: 1px solid var(--techwave-border-color);">
                    <h3 class="text-lg font-semibold mb-4" style="color: var(--techwave-heading-color);">Características de la Plataforma</h3>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div class="text-center p-4 rounded-lg" style="background-color: var(--techwave-some-a-bg-color);">
                            <div class="w-12 h-12 mx-auto mb-3 rounded-lg flex items-center justify-center" style="background-color: var(--techwave-main-color);">
                                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                                </svg>
                            </div>
                            <h4 class="font-semibold mb-2" style="color: var(--techwave-heading-color);">Chat Inteligente</h4>
                            <p class="text-sm" style="color: var(--techwave-body-color);">Consulta tu base de datos en lenguaje natural</p>
                        </div>
                        <div class="text-center p-4 rounded-lg" style="background-color: var(--techwave-some-a-bg-color);">
                            <div class="w-12 h-12 mx-auto mb-3 rounded-lg flex items-center justify-center" style="background-color: var(--techwave-main-color);">
                                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"></path>
                                </svg>
                            </div>
                            <h4 class="font-semibold mb-2" style="color: var(--techwave-heading-color);">Múltiples Conexiones</h4>
                            <p class="text-sm" style="color: var(--techwave-body-color);">Gestiona varias bases de datos desde un solo lugar</p>
                        </div>
                        <div class="text-center p-4 rounded-lg" style="background-color: var(--techwave-some-a-bg-color);">
                            <div class="w-12 h-12 mx-auto mb-3 rounded-lg flex items-center justify-center" style="background-color: var(--techwave-main-color);">
                                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                                </svg>
                            </div>
                            <h4 class="font-semibold mb-2" style="color: var(--techwave-heading-color);">Análisis Avanzado</h4>
                            <p class="text-sm" style="color: var(--techwave-body-color);">Obtén insights detallados de tus consultas</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Tokens Info Modal -->
<div id="tokens_infoModal" class="modal" style="display: none;">
    <div class="modal-content">
        <span class="close">&times;</span>
        <h2>Información de Tokens</h2>
        <div class="tokens-info">
            <div class="token-item">
                <span class="token-label">Plan Actual:</span>
                <span class="token-value">Free</span>
            </div>
            <div class="token-item">
                <span class="token-label">Tokens Disponibles:</span>
                <span class="token-value">100</span>
            </div>
            <div class="token-item">
                <span class="token-label">Tokens Usados:</span>
                <span class="token-value">0</span>
            </div>
            <div class="token-item">
                <span class="token-label">Renovación:</span>
                <span class="token-value">1 de Enero, 2025</span>
            </div>
        </div>
        <div class="tokens-actions">
            <a href="/pricing" class="upgrade-btn">Upgrade Plan</a>
        </div>
    </div>
</div>

<script>
// Tokens Modal
function showTokensInfo() {
    document.getElementById('tokens_infoModal').style.display = 'block';
}

// Close modal when clicking on X
document.querySelector('.close').onclick = function() {
    document.getElementById('tokens_infoModal').style.display = 'none';
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('tokens_infoModal');
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}
</script>
@endsection 