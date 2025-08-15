import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { 
    Users, 
    Database, 
    MessageSquare, 
    BarChart3,
    TrendingUp,
    Activity
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard() {
    return (
        <>
            <Head title="Dashboard - GatherLake AI" />
            
            <AppLayout breadcrumbs={breadcrumbs}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-card-foreground">
                            Dashboard
                        </h1>
                        <p className="mt-2 text-muted-foreground">
                            Bienvenido a tu panel de control
                        </p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
                            <div className="flex items-center">
                                <div className="p-3 rounded-lg bg-primary/10">
                                    <Users className="w-6 h-6 text-primary" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-muted-foreground">Total Usuarios</p>
                                    <p className="text-2xl font-bold text-card-foreground">1,247</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
                            <div className="flex items-center">
                                <div className="p-3 rounded-lg bg-green-500/10">
                                    <Database className="w-6 h-6 text-green-500" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-muted-foreground">Conexiones</p>
                                    <p className="text-2xl font-bold text-card-foreground">89</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
                            <div className="flex items-center">
                                <div className="p-3 rounded-lg bg-blue-500/10">
                                    <MessageSquare className="w-6 h-6 text-blue-500" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-muted-foreground">Consultas</p>
                                    <p className="text-2xl font-bold text-card-foreground">15,432</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
                            <div className="flex items-center">
                                <div className="p-3 rounded-lg bg-purple-500/10">
                                    <BarChart3 className="w-6 h-6 text-purple-500" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-muted-foreground">Crecimiento</p>
                                    <p className="text-2xl font-bold text-green-500">+23%</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-card rounded-lg border border-border p-6 mb-8 shadow-sm">
                        <h3 className="text-lg font-semibold text-card-foreground mb-4">Acciones Rápidas</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <a href="/connections" className="block p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-colors">
                                <div className="flex items-center">
                                    <Database className="w-5 h-5 text-primary mr-3" />
                                    <span className="font-medium text-card-foreground">Gestionar Conexiones</span>
                                </div>
                            </a>
                            
                            <a href="/chat" className="block p-4 rounded-lg border border-border hover:border-green-500/50 hover:bg-green-500/5 transition-colors">
                                <div className="flex items-center">
                                    <MessageSquare className="w-5 h-5 text-green-500 mr-3" />
                                    <span className="font-medium text-card-foreground">Chat SQL</span>
                                </div>
                            </a>
                            
                            <a href="/users" className="block p-4 rounded-lg border border-border hover:border-purple-500/50 hover:bg-purple-500/5 transition-colors">
                                <div className="flex items-center">
                                    <Users className="w-5 h-5 text-purple-500 mr-3" />
                                    <span className="font-medium text-card-foreground">Gestionar Usuarios</span>
                                </div>
                            </a>
                        </div>
                    </div>

                    {/* Performance Metrics */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-card-foreground mb-4">Métricas de Rendimiento</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">Tiempo de Respuesta</span>
                                    <span className="font-semibold text-card-foreground">1.2s</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Uptime</span>
                                    <span className="font-semibold text-green-500">99.9%</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Conexiones Activas</span>
                                    <span className="font-semibold text-card-foreground">67</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-card-foreground mb-4">Tendencias</h3>
                            <div className="space-y-4">
                                <div className="flex items-center">
                                    <TrendingUp className="w-5 h-5 text-green-500 mr-3" />
                                    <span className="text-muted-foreground">Consultas SQL</span>
                                    <span className="ml-auto font-semibold text-green-500">+15%</span>
                                </div>
                                <div className="flex items-center">
                                    <Activity className="w-5 h-5 text-blue-500 mr-3" />
                                    <span className="text-sm text-muted-foreground">Usuarios Activos</span>
                                    <span className="ml-auto font-semibold text-blue-500">+8%</span>
                                </div>
                                <div className="flex items-center">
                                    <Database className="w-5 h-5 text-purple-500 mr-3" />
                                    <span className="text-sm text-muted-foreground">Nuevas Conexiones</span>
                                    <span className="ml-auto font-semibold text-purple-500">+12%</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
                        <h3 className="text-lg font-semibold text-card-foreground mb-4">Actividad Reciente</h3>
                        <div className="space-y-3">
                            <div className="flex items-center p-3 rounded-lg bg-muted/50">
                                <div className="w-2 h-2 rounded-full bg-green-500 mr-3"></div>
                                <span className="text-card-foreground">Nueva conexión MySQL creada por admin@example.com</span>
                                <span className="ml-auto text-sm text-muted-foreground">Hace 2 horas</span>
                            </div>
                            <div className="flex items-center p-3 rounded-lg bg-muted/50">
                                <div className="w-2 h-2 rounded-full bg-blue-500 mr-3"></div>
                                <span className="text-card-foreground">Consulta SQL ejecutada en base de datos "production"</span>
                                <span className="ml-auto text-sm text-muted-foreground">Hace 4 horas</span>
                            </div>
                            <div className="flex items-center p-3 rounded-lg bg-muted/50">
                                <div className="w-2 h-2 rounded-full bg-yellow-500 mr-3"></div>
                                <span className="text-card-foreground">Usuario juan@example.com actualizó su perfil</span>
                                <span className="ml-auto text-sm text-muted-foreground">Hace 6 horas</span>
                            </div>
                        </div>
                    </div>
                </div>
            </AppLayout>
        </>
    );
} 