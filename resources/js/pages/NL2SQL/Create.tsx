import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Connection } from '@/types';
import DataTable from '@/components/data-table';
import { usePage } from '@inertiajs/react';

interface PageProps {
    success?: string;
    error?: string;
    pendingQuery?: {
        sql: string;
        type: 'update' | 'delete';
        affectedRecords: any[];
        affectedCount: number;
    };
    [key: string]: any;
}

export default function Create({ connections, result }: { connections: Connection[]; result?: any[] }) {
    const { props } = usePage<PageProps>();
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const { data, setData, post, processing, errors } = useForm({
        query: '',
        connection_id: '',
    });

    const confirmForm = useForm({
        sql: '',
        type: '',
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post(route('nl2sql.store'));
    }

    function confirmQuery() {
        confirmForm.post(route('nl2sql.confirm'), {
            onSuccess: () => {
                setShowConfirmModal(false);
                confirmForm.reset();
            },
        });
    }

    function cancelQuery() {
        setShowConfirmModal(false);
        confirmForm.reset();
    }

    // Show confirmation modal if there's a pending query
    React.useEffect(() => {
        if (props.pendingQuery) {
            confirmForm.setData({
                sql: props.pendingQuery.sql,
                type: props.pendingQuery.type,
            });
            setShowConfirmModal(true);
        }
    }, [props.pendingQuery]);

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
                        {props.error && (
                            <div className="mb-4 rounded-md bg-red-50 p-4">
                                <p className="text-sm font-medium text-red-800">{props.error as string}</p>
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

                {/* Confirmation Modal */}
                <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
                    <DialogContent className="max-w-4xl">
                        <DialogHeader>
                            <DialogTitle>
                                Confirm {props.pendingQuery?.type === 'update' ? 'Update' : 'Delete'} Operation
                            </DialogTitle>
                            <DialogDescription>
                                This operation will affect {props.pendingQuery?.affectedCount} record(s). 
                                Please review the records that will be {props.pendingQuery?.type === 'update' ? 'updated' : 'deleted'}:
                            </DialogDescription>
                        </DialogHeader>
                        
                        <div className="max-h-96 overflow-y-auto">
                            <div className="mb-4">
                                <h4 className="font-medium mb-2">SQL Query:</h4>
                                <code className="block bg-gray-100 p-2 rounded text-sm">
                                    {props.pendingQuery?.sql}
                                </code>
                            </div>
                            
                            <div>
                                <h4 className="font-medium mb-2">Records to be affected:</h4>
                                <DataTable data={props.pendingQuery?.affectedRecords || []} />
                            </div>
                        </div>

                        <DialogFooter>
                            <Button variant="outline" onClick={cancelQuery} disabled={confirmForm.processing}>
                                Cancel
                            </Button>
                            <Button 
                                variant={props.pendingQuery?.type === 'delete' ? 'destructive' : 'default'}
                                onClick={confirmQuery} 
                                disabled={confirmForm.processing}
                            >
                                {confirmForm.processing ? 'Processing...' : `Confirm ${props.pendingQuery?.type === 'update' ? 'Update' : 'Delete'}`}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}