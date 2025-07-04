import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { GenericDataTable } from '@/shared/GenericDataTable';
import { Tag } from 'primereact/tag';
import { Button } from 'primereact/button';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Toast } from 'primereact/toast';
import { useRef } from 'react';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Usuarios',
        href: '/users',
    },
];

type User = {
    id: number;
    name: string;
    email: string;
    role: string;
    status: string;
    created_at: string;
    last_login_at?: string;
    last_login_ip?: string;
    roles?: Array<{ name: string }>;
};

export default function Users() {
    const toast = useRef<Toast>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://127.0.0.1:8000/api/get/user/all');
            const formattedUsers = response.data.map((user: any) => ({
                ...user,
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.roles?.[0]?.name || 'user',
                status: user.status || 'active',
                created_at: user.created_at,
                last_login_at: user.last_login_at,
                last_login_ip: user.last_login_ip
            }));
            setUsers(formattedUsers);
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Error al cargar los usuarios',
                life: 3000
            });
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const deleteUser = async (userId: number) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/delete/user/${userId}`);
            toast.current?.show({
                severity: 'success',
                summary: 'Éxito',
                detail: 'Usuario eliminado correctamente',
                life: 3000
            });
            // Actualizar la lista de usuarios después de eliminar
            fetchUsers();
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Error al eliminar el usuario',
                life: 3000
            });
            console.error('Error deleting user:', error);
        }
    };

    const confirmDelete = (user: User) => {
        confirmDialog({
            message: `¿Estás seguro de que quieres eliminar al usuario ${user.name} (${user.email})?`,
            header: 'Confirmar eliminación',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sí, eliminar',
            rejectLabel: 'Cancelar',
            acceptClassName: 'p-button-danger',
            accept: () => deleteUser(user.id),
        });
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const columns = [
        {
            field: 'id',
            header: 'ID',
            style: { minWidth: '50px' }
        },
        {
            field: 'name',
            header: 'Nombre',
            filter: { type: 'text', placeholder: 'Buscar por nombre' },
            style: { minWidth: '200px' }
        },
        {
            field: 'email',
            header: 'Email',
            filter: { type: 'text', placeholder: 'Buscar por email' }
        },
        {
            field: 'role',
            header: 'Rol',
            filter: {
                type: 'dropdown',
                options: ['admin', 'editor', 'user'],
                placeholder: 'Filtrar por rol'
            },
            body: (rowData: User) => (
                <Tag 
                    value={rowData.role} 
                    severity={
                        rowData.role === 'admin' ? 'danger' : 
                        rowData.role === 'editor' ? 'warning' : 'success'
                    } 
                    className="capitalize"
                />
            )
        },
        {
            field: 'status',
            header: 'Estado',
            filter: {
                type: 'dropdown',
                options: ['active', 'inactive'],
                placeholder: 'Filtrar por estado'
            },
            body: (rowData: User) => (
                <Tag 
                    value={
                        rowData.status === 'activo' ? 'Activo' :
                        rowData.status === 'pendiente' ? 'Pendiente' : 'Inactivo'
                    }
                    severity={
                        rowData.status === 'activo' ? 'success' :
                        rowData.status === 'pendiente' ? 'warning' : 'danger'
                    }
                />
            )
        },
        {
            field: 'actions',
            header: 'Acciones',
            body: (rowData: User) => (
                <div className="flex gap-2">
                    <Link href={`/users/${rowData.id}`}>
                        <Button 
                            icon="pi pi-eye" 
                            rounded 
                            text 
                            severity="info"
                            tooltip="Ver detalles"
                            tooltipOptions={{ position: 'top' }}
                        />
                    </Link>
                    <Link href={`/users/${rowData.id}/edit`}>
                        <Button 
                            icon="pi pi-pencil" 
                            rounded 
                            text 
                            severity="secondary"
                            tooltip="Editar usuario"
                            tooltipOptions={{ position: 'top' }}
                        />
                    </Link>
                    <Button 
                        icon="pi pi-trash" 
                        rounded 
                        text 
                        severity="danger"
                        tooltip="Eliminar usuario"
                        tooltipOptions={{ position: 'top' }}
                        onClick={() => confirmDelete(rowData)}
                    />
                </div>
            )
        }
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gestión de Usuarios" />
            <Toast ref={toast} position="top-right" />
            <ConfirmDialog />
            
            <div className="space-y-6 px-[16px] pt-[40px]">
                <h1 className="text-2xl font-bold tracking-tight">Gestión de Usuarios</h1>
                
                <div className="rounded-lg border border-gray-700 bg-gray-900 shadow-sm">
                    <GenericDataTable
                        dataKey="id"
                        columns={columns}
                        value={users}
                        loading={loading}
                        globalFilterFields={['name', 'email', 'role', 'status']}
                        paginator
                        rows={10}
                    />
                </div>
            </div>
        </AppLayout>
    );
}