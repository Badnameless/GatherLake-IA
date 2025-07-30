import React from 'react';
import { useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        driver: 'pgsql',
        host: '127.0.0.1',
        port: '5432',
        database: '',
        username: '',
        password: '',
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post(route('connections.store'));
    }

    return (
        <AppLayout>
            <div className="p-4 sm:p-6 lg:p-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Add Connection</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    type="text"
                                    name="name"
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                />
                                {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                            </div>

                            <div>
                                <Label htmlFor="driver">Driver</Label>
                                <Input
                                    type="text"
                                    name="driver"
                                    id="driver"
                                    value={data.driver}
                                    onChange={(e) => setData('driver', e.target.value)}
                                />
                                {errors.driver && <p className="text-xs text-red-500">{errors.driver}</p>}
                            </div>

                            <div>
                                <Label htmlFor="host">Host</Label>
                                <Input
                                    type="text"
                                    name="host"
                                    id="host"
                                    value={data.host}
                                    onChange={(e) => setData('host', e.target.value)}
                                />
                                {errors.host && <p className="text-xs text-red-500">{errors.host}</p>}
                            </div>

                            <div>
                                <Label htmlFor="port">Port</Label>
                                <Input
                                    type="text"
                                    name="port"
                                    id="port"
                                    value={data.port}
                                    onChange={(e) => setData('port', e.target.value)}
                                />
                                {errors.port && <p className="text-xs text-red-500">{errors.port}</p>}
                            </div>

                            <div>
                                <Label htmlFor="database">Database</Label>
                                <Input
                                    type="text"
                                    name="database"
                                    id="database"
                                    value={data.database}
                                    onChange={(e) => setData('database', e.target.value)}
                                />
                                {errors.database && <p className="text-xs text-red-500">{errors.database}</p>}
                            </div>

                            <div>
                                <Label htmlFor="username">Username</Label>
                                <Input
                                    type="text"
                                    name="username"
                                    id="username"
                                    value={data.username}
                                    onChange={(e) => setData('username', e.target.value)}
                                />
                                {errors.username && <p className="text-xs text-red-500">{errors.username}</p>}
                            </div>

                            <div>
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    type="password"
                                    name="password"
                                    id="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                />
                                {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
                            </div>

                            <Button type="submit" disabled={processing}>
                                {processing ? 'Saving...' : 'Save'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}