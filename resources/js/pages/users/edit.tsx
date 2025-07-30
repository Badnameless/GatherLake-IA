import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Divider } from 'primereact/divider';
import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast';
import { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { classNames } from 'primereact/utils';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Usuarios',
        href: '/users',
    },
];

const roles = [
    { label: 'Administrador', value: 'admin' },
    { label: 'Invitado', value: 'guest' },
    { label: 'Premium', value: 'premium' }
];

const statuses = [
    { label: 'Activo', value: 'activo' },
    { label: 'Inactivo', value: 'inactivo' },
    { label: 'Pendiente', value: 'pendiente' }
];

interface UserEditProps {
    userId: string | number;
}

export default function UserEdit({ userId }: UserEditProps) {
    const toast = useRef<Toast>(null);
    const { id } = useParams();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: '',
        status: ''
    });
    const [errors, setErrors] = useState<any>({});

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
                    setFormData({
                        name: response.data.name,
                        email: response.data.email,
                        role: response.data.roles?.[0]?.name || 'user',
                        status: response.data.status
                    });
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        
        try {
            const response = await axios.post('/api/update/user', {
                id: userId || id, // Usamos el ID original que recibimos como prop
                name: formData.name,
                email: formData.email,
                status: formData.status,
                role: formData.role
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            toast.current?.show({
                severity: 'success',
                summary: 'Éxito',
                detail: 'Usuario actualizado correctamente',
                life: 3000
            });
            
            // Actualizamos los datos pero mantenemos el ID original
            setUser({
                ...response.data,
                id: userId || id
            });
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: error.response?.data?.message || error.message || 'Hubo un problema al actualizar el usuario',
                life: 3000
            });
            
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            }
        } finally {
            setProcessing(false);
        }
    };

    const handleChange = (field: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        
        if (errors[field]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    if (loading || !user) {
        return (
            <AppLayout breadcrumbs={[...breadcrumbs, { title: 'Cargando...', href: '' }]}>
                <Head title="Cargando usuario..." />
                <div className="flex justify-center items-center h-64 bg-[#0A0A0A]">
                    <i className="pi pi-spinner pi-spin text-2xl text-blue-500"></i>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout breadcrumbs={[
            ...breadcrumbs,
            { title: user.name, href: `/users/${user.id}` },
            { title: 'Editar', href: `/users/${user.id}/edit` }
        ]}>
            <Head title={`Editar Usuario: ${user.name}`} />
            <Toast ref={toast} position="top-right" />
            
            <div className="space-y-6 p-6 bg-[#0A0A0A] min-h-screen">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold tracking-tight text-white">Editar Usuario</h1>
                    <div className="flex gap-2">
                        <Link href={`/users/${user.id}`}>
                            <Button 
                                label="Cancelar" 
                                icon="pi pi-times" 
                                severity="secondary"
                                className="border border-[#2D2D2D] bg-[#171717] text-white hover:bg-[#1F1F1F]"
                                disabled={processing}
                            />
                        </Link>
                    </div>
                </div>

                <Card className="border border-[#2D2D2D] bg-[#171717] shadow-sm">
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                                        Nombre completo
                                    </label>
                                    <InputText
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => handleChange('name', e.target.value)}
                                        className={classNames('w-full bg-[#1F1F1F] border-[#2D2D2D] text-white', { 'p-invalid': errors.name })}
                                        disabled={processing}
                                    />
                                    {errors.name && <small className="p-error">{errors.name}</small>}
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                                        Correo electrónico
                                    </label>
                                    <InputText
                                        id="email"
                                        value={formData.email}
                                        onChange={(e) => handleChange('email', e.target.value)}
                                        className={classNames('w-full bg-[#1F1F1F] border-[#2D2D2D] text-white', { 'p-invalid': errors.email })}
                                        disabled={processing}
                                    />
                                    {errors.email && <small className="p-error">{errors.email}</small>}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="role" className="block text-sm font-medium text-gray-300 mb-2">
                                        Rol
                                    </label>
                                    <Dropdown
                                        id="role"
                                        value={formData.role}
                                        onChange={(e) => handleChange('role', e.value)}
                                        options={roles}
                                        optionLabel="label"
                                        className={classNames('w-full bg-[#1F1F1F] border-[#2D2D2D] text-white', { 'p-invalid': errors.role })}
                                        disabled={processing}
                                        placeholder="Seleccione un rol"
                                    />
                                    {errors.role && <small className="p-error">{errors.role}</small>}
                                </div>

                                <div>
                                    <label htmlFor="status" className="block text-sm font-medium text-gray-300 mb-2">
                                        Estado
                                    </label>
                                    <Dropdown
                                        id="status"
                                        value={formData.status}
                                        onChange={(e) => handleChange('status', e.value)}
                                        options={statuses}
                                        optionLabel="label"
                                        className={classNames('w-full bg-[#1F1F1F] border-[#2D2D2D] text-white', { 'p-invalid': errors.status })}
                                        disabled={processing}
                                        placeholder="Seleccione un estado"
                                    />
                                    {errors.status && <small className="p-error">{errors.status}</small>}
                                </div>
                            </div>
                        </div>

                        <Divider className="border-[#2D2D2D] my-6" />

                        <div className="flex justify-end gap-2 p-6">
                            <Button 
                                label="Guardar cambios" 
                                icon="pi pi-check" 
                                type="submit"
                                loading={processing}
                                className="bg-blue-600 border-blue-600 hover:bg-blue-700 hover:border-blue-700"
                            />
                        </div>
                    </form>
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
                
                .p-inputtext {
                    background: #1F1F1F !important;
                    border-color: #2D2D2D !important;
                    color: #E5E5E5 !important;
                }
                
                .p-inputtext:enabled:hover {
                    border-color: #3D3D3D !important;
                }
                
                .p-inputtext:enabled:focus {
                    box-shadow: none !important;
                    border-color: #3D3D3D !important;
                }
                
                .p-dropdown {
                    background: #1F1F1F !important;
                    border-color: #2D2D2D !important;
                    color: #E5E5E5 !important;
                }
                
                .p-dropdown:not(.p-disabled).p-focus {
                    box-shadow: none !important;
                    border-color: #3D3D3D !important;
                }
                
                .p-dropdown-panel {
                    background: #1F1F1F !important;
                    border-color: #2D2D2D !important;
                    color: #E5E5E5 !important;
                }
                
                .p-dropdown-items-wrapper {
                    background: #1F1F1F !important;
                }
                
                .p-dropdown-item {
                    color: #E5E5E5 !important;
                }
                
                .p-dropdown-item:hover {
                    background: #2D2D2D !important;
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