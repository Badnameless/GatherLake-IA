import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Divider } from 'primereact/divider';
import { Avatar } from 'primereact/avatar';
import { Tag } from 'primereact/tag';
import { Badge } from 'primereact/badge';
import { Panel } from 'primereact/panel';
import { Toast } from 'primereact/toast';
import { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Usuarios',
        href: '/users',
    },
];

interface UserShowProps {
    userId: string | number;
}

export default function UserShow({ userId }: UserShowProps) {
    const toast = useRef<Toast>(null);
    const { id } = useParams();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                setLoading(true);
                const response = await axios.post('/api/fetch/user', {
                    id: userId || id
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                });

                if (response.data) {
                    setUser(response.data);
                } else {
                    throw new Error('Usuario no encontrado');
                }
            } catch (error) {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: error.response?.data?.message || error.message || 'Error al cargar los datos del usuario',
                    life: 3000
                });
                console.error('Error fetching user:', error);
            } finally {
                setLoading(false);
            }
        };

        if (userId || id) {
            fetchUser();
        }
    }, [userId, id]);

    if (loading) {
        return (
            <AppLayout breadcrumbs={[...breadcrumbs, { title: 'Cargando...', href: '' }]}>
                <Head title="Cargando usuario..." />
                <div className="flex justify-center items-center h-64 bg-[#0A0A0A]">
                    <i className="pi pi-spinner pi-spin text-2xl text-blue-500"></i>
                </div>
            </AppLayout>
        );
    }

    if (!user) {
        return (
            <AppLayout breadcrumbs={[...breadcrumbs, { title: 'No encontrado', href: '' }]}>
                <Head title="Usuario no encontrado" />
                <div className="flex justify-center items-center h-64 bg-[#0A0A0A]">
                    <p className="text-gray-300">Usuario no encontrado</p>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout breadcrumbs={[
            ...breadcrumbs,
            { title: user.name, href: `/users/${user.id}` }
        ]}>
            <Head title={`Usuario: ${user.name}`} />
            <Toast ref={toast} position="top-right" />
            
            <div className="space-y-6 p-6 bg-[#0A0A0A] min-h-screen">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold tracking-tight text-white">Detalles del Usuario</h1>
                    <div className="flex gap-2">
                        <Link href="/users">
                            <Button 
                                label="Volver" 
                                icon="pi pi-arrow-left" 
                                severity="secondary"
                                className="border border-[#2D2D2D] bg-[#171717] text-white hover:bg-[#1F1F1F]"
                            />
                        </Link>
                        <Link href={`/users/${user.id}/edit`}>
                            <Button 
                                label="Editar" 
                                icon="pi pi-pencil" 
                                className="border border-blue-500 bg-[#171717] text-white hover:bg-[#1F1F1F]"
                            />
                        </Link>
                    </div>
                </div>

                <Card className="border border-[#2D2D2D] bg-[#171717] shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-4">
                        <div className="md:col-span-1 flex flex-col items-center">
                            <div className="relative mb-4">
                                <Avatar 
                                    label={user.name.charAt(0)} 
                                    size="xlarge" 
                                    shape="circle" 
                                    className="bg-[#2D2D2D] text-2xl text-white"
                                />
                                <Badge 
                                    value={
                                        user.status === 'activo' ? 'Activo' :
                                        user.status === 'pendiente' ? 'Pendiente' : 'Inactivo'
                                    }
                                    severity={
                                        user.status === 'activo' ? 'success' :
                                        user.status === 'pendiente' ? 'warning' : 'danger'
                                    }
                                    className="absolute -bottom-2 -right-2 bg-[#0A0A0A]"
                                />
                            </div>
                            {Array.isArray(user.roles) && user.roles.length > 0 ? (
                                user.roles.map((role: any) => (
                                    <Tag
                                        key={role.id}
                                        value={role.name}
                                        severity={
                                            role.name === 'admin' ? 'danger' : 
                                            role.name === 'guest' ? 'warning' : 'success'
                                        }
                                        className="capitalize bg-[#2D2D2D] text-white"
                                    />
                                ))
                            ) : (
                                <Tag
                                    value={'N/A'}
                                    severity={'warning'}
                                    className="capitalize bg-[#2D2D2D] text-white"
                                />
                            )}
                        </div>
                        
                        <div className="md:col-span-3">
                            <Panel header="Información Básica" toggleable className="border border-[#2D2D2D] bg-[#1F1F1F]">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                                    <div className="space-y-1">
                                        <p className="text-sm text-gray-400">Nombre completo</p>
                                        <p className="text-gray-200 font-medium">{user.name}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm text-gray-400">Correo electrónico</p>
                                        <p className="text-gray-200 font-medium">{user.email}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm text-gray-400">Rol</p>
                                        {Array.isArray(user.roles) && user.roles.length > 0 ? (
                                            user.roles.map((role: any) => (
                                                <Tag
                                                    key={role.id}
                                                    value={role.name}
                                                    severity={
                                                        role.name === 'admin' ? 'danger' : 
                                                        role.name === 'guest' ? 'warning' : 'success'
                                                    }
                                                    className="capitalize bg-[#2D2D2D] text-white"
                                                />
                                            ))
                                        ) : (
                                            <span className="text-gray-400">N/A</span>
                                        )}
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm text-gray-400">Estado</p>
                                        <Tag 
                                            value={
                                                user.status === 'activo' ? 'Activo' :
                                                user.status === 'pendiente' ? 'Pendiente' : 'Inactivo'
                                            }
                                            severity={
                                                user.status === 'activo' ? 'success' :
                                                user.status === 'pendiente' ? 'warning' : 'danger'
                                            }
                                            className="bg-[#2D2D2D] text-white"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm text-gray-400">Fecha de creación</p>
                                        <p className="text-gray-200 font-medium">
                                            {new Date(user.created_at).toLocaleDateString('es-ES', {
                                                day: '2-digit',
                                                month: 'long',
                                                year: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm text-gray-400">Última actualización</p>
                                        <p className="text-gray-200 font-medium">
                                            {new Date(user.updated_at).toLocaleDateString('es-ES', {
                                                day: '2-digit',
                                                month: 'long',
                                                year: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </Panel>

                            <Divider className="border-[#2D2D2D] my-6" />

                            <Panel header="Actividad" toggleable className="border border-[#2D2D2D] bg-[#1F1F1F]">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                                    <div className="space-y-1">
                                        <p className="text-sm text-gray-400">Último inicio de sesión</p>
                                        <p className="text-gray-200 font-medium">
                                            {user.last_login_at ? 
                                                new Date(user.last_login_at).toLocaleString('es-ES') : 
                                                'Nunca ha iniciado sesión'}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm text-gray-400">Dirección IP</p>
                                        <p className="text-gray-200 font-medium">
                                            {user.last_login_ip || 'No disponible'}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm text-gray-400">ID del usuario</p>
                                        <p className="text-gray-200 font-medium">{user.id}</p>
                                    </div>
                                </div>
                            </Panel>

                            <Divider className="border-[#2D2D2D] my-6" />

                            <Panel header="Roles y Permisos" toggleable className="border border-[#2D2D2D] bg-[#1F1F1F]">
                                <div className="space-y-4 p-4">
                                    <div className="space-y-1">
                                        <p className="text-sm text-gray-400">Roles asignados</p>
                                        <div className="flex flex-wrap gap-2">
                                        {Array.isArray(user.roles) && user.roles.length > 0 ? (
                                            user.roles.map((role: any) => (
                                                <Tag
                                                    key={role.id}
                                                    value={role.name}
                                                    severity={
                                                        role.name === 'admin' ? 'danger' : 
                                                        role.name === 'guest' ? 'warning' : 'success'
                                                    }
                                                    className="capitalize bg-[#2D2D2D] text-white"
                                                />
                                            ))
                                        ) : (
                                            <span className="text-gray-400">N/A</span>
                                        )}
                                        </div>
                                    </div>
                                </div>
                            </Panel>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Estilos globales para componentes PrimeReact */}
            <style jsx global>{`
                .p-card {
                    background: #171717 !important;
                    color: #E5E5E5 !important;
                    border-color: #2D2D2D !important;
                }
                
                .p-card .p-card-body {
                    padding: 0 !important;
                }
                
                .p-card .p-card-content {
                    padding: 0 !important;
                }
                
                .p-panel {
                    background: #1F1F1F !important;
                    color: #E5E5E5 !important;
                    border-color: #2D2D2D !important;
                    border: none !important;
                    border-radius: 6px !important;
                }
                
                .p-panel .p-panel-header {
                    background: #0A0A0A !important;
                    border-color: #2D2D2D !important;
                    color: #FFFFFF !important;
                }
                
                .p-panel .p-panel-content {
                    background: #1F1F1F !important;
                    border-color: #2D2D2D !important;
                    padding: 1rem !important;
                }
                
                .p-tag {
                    background: #2D2D2D !important;
                    color: #FFFFFF !important;
                    border-color: #2D2D2D !important;
                }
                
                .p-badge {
                    background: #0A0A0A !important;
                    color: #FFFFFF !important;
                }
                
                .p-avatar {
                    background: #2D2D2D !important;
                    color: #FFFFFF !important;
                }
                
                .p-button {
                    background: #171717 !important;
                    border-color: #2D2D2D !important;
                    color: #FFFFFF !important;
                }
                
                .p-button:hover {
                    background: #1F1F1F !important;
                    border-color: #2D2D2D !important;
                }
                
                .p-button:focus {
                    box-shadow: none !important;
                }
                
                .p-divider {
                    border-color: #2D2D2D !important;
                }
                
                .p-toast {
                    background: #171717 !important;
                    border-color: #2D2D2D !important;
                    color: #FFFFFF !important;
                }
                
                .p-toast .p-toast-message {
                    background: #171717 !important;
                    border-color: #2D2D2D !important;
                    color: #FFFFFF !important;
                }
                
                .p-toast .p-toast-message-content {
                    background: #171717 !important;
                    color: #FFFFFF !important;
                }
            `}</style>
        </AppLayout>
    );
}