import React from 'react';
import { useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Connection } from '@/types';
import DataTable from '@/components/data-table';
import { usePage } from '@inertiajs/react';

interface PageProps {
    success?: string;
    [key: string]: any;
}

export default function Create({ connections, result }: { connections: Connection[]; result?: any[] }) {
    const { props } = usePage<PageProps>();
    const { data, setData, post, processing, errors } = useForm({
        query: '',
        connection_id: '',
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post(route('nl2sql.store'));
    }

    return (
        <AppLayout>
            <div className="p-4 sm:p-6 lg:p-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Natural Language to SQL</CardTitle>
                    </CardHeader>
                    <CardContent>
{props.success && (
    <div className="mb-4 rounded-md bg-green-50 p-4">
        <p className="text-sm font-medium text-green-800">{props.success as string}</p>
    </div>
)}
                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <Label htmlFor="connection_id">Connection</Label>
                                <Select
                                    name="connection_id"
                                    value={data.connection_id}
                                    onValueChange={(value) => setData('connection_id', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a connection" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {connections.map((connection) => (
                                            <SelectItem key={connection.id} value={connection.id.toString()}>
                                                {connection.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.connection_id && (
                                    <p className="text-xs text-red-500">{errors.connection_id}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="query">Enter your query</Label>
                                <Input
                                    type="text"
                                    name="query"
                                    id="query"
                                    value={data.query}
                                    onChange={(e) => setData('query', e.target.value)}
                                />
                                {errors.query && <p className="text-xs text-red-500">{errors.query}</p>}
                            </div>
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Processing...' : 'Submit'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {result && (
                    <Card className="mt-4">
                        <CardHeader>
                            <CardTitle>Query Result</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <DataTable data={result} />
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}