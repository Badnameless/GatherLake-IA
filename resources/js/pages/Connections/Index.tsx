import React from 'react';
import { Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Connection } from '@/types';

export default function Index({ connections }: { connections: Connection[] }) {
    return (
        <AppLayout>
            <div className="p-4 sm:p-6 lg:p-8">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Connections</h1>
                    <Link href={route('connections.create')} className={buttonVariants()}>
                        Add Connection
                    </Link>
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {connections.map((connection) => (
                        <Card key={connection.id}>
                            <CardHeader>
                                <CardTitle>{connection.name}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-gray-500">{connection.driver}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}