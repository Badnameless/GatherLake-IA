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
                    <DialogContent className="w-[80%] max-h-[90vh] overflow-hidden">
                        <DialogHeader className="border-b border-border pb-4">
                            <DialogTitle className="text-xl font-semibold flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full ${props.pendingQuery?.type === 'delete' ? 'bg-destructive' : 'bg-primary'}`}></div>
                                Confirm {props.pendingQuery?.type === 'update' ? 'Update' : 'Delete'} Operation
                            </DialogTitle>
                            <DialogDescription className="text-muted-foreground mt-2">
                                This operation will affect <span className="font-semibold text-foreground">{props.pendingQuery?.affectedCount}</span> record(s). 
                                Please review the details below before proceeding.
                            </DialogDescription>
                        </DialogHeader>
                        
                        <div className="flex-1 overflow-y-auto py-4 space-y-6">
                            {/* SQL Query Section */}
                            <div className="bg-muted/50 rounded-lg p-4 border border-border">
                                <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
                                    <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                                    </svg>
                                    SQL Query
                                </h4>
                                <div className="bg-card border border-border rounded-md p-4 overflow-x-auto">
                                    <code className="text-primary text-sm font-mono whitespace-pre-wrap">
                                        {props.pendingQuery?.sql}
                                    </code>
                                </div>
                            </div>
                            
                            {/* Records Section */}
                            <div className="bg-muted/50 rounded-lg p-4 border border-border">
                                <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
                                    <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                    Records to be {props.pendingQuery?.type === 'update' ? 'updated' : 'deleted'} ({props.pendingQuery?.affectedCount})
                                </h4>
                                <div className="bg-card rounded-md border border-border overflow-hidden">
                                    <div className="max-h-64 overflow-y-auto">
                                        <DataTable data={props.pendingQuery?.affectedRecords || []} />
                                    </div>
                                </div>
                            </div>

                            {/* Warning Section for Delete */}
                            {props.pendingQuery?.type === 'delete' && (
                                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                                    <div className="flex items-start gap-3">
                                        <svg className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                        </svg>
                                        <div>
                                            <h5 className="font-medium text-destructive">Warning</h5>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                This action will permanently delete {props.pendingQuery?.affectedCount} record(s). This operation cannot be undone.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <DialogFooter className="border-t border-border pt-4 bg-muted/30 -mx-6 -mb-6 px-6 py-4">
                            <div className="flex items-center justify-between w-full">
                                <div className="text-sm text-muted-foreground">
                                    {props.pendingQuery?.type === 'update' ? 'Update' : 'Delete'} operation
                                </div>
                                <div className="flex gap-3">
                                    <Button 
                                        variant="outline" 
                                        onClick={cancelQuery} 
                                        disabled={confirmForm.processing}
                                        className="px-6"
                                    >
                                        Cancel
                                    </Button>
                                    <Button 
                                        variant={props.pendingQuery?.type === 'delete' ? 'destructive' : 'default'}
                                        onClick={confirmQuery} 
                                        disabled={confirmForm.processing}
                                        className="px-6"
                                    >
                                        {confirmForm.processing ? (
                                            <div className="flex items-center gap-2">
                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Processing...
                                            </div>
                                        ) : (
                                            `Confirm ${props.pendingQuery?.type === 'update' ? 'Update' : 'Delete'}`
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}