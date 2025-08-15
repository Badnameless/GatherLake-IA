<?php

namespace App\Http\Controllers;

use App\Models\Connection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Mcp\NL2SQLTool;
use App\Mcp\ExecutorTool;
use Illuminate\Support\Facades\DB;

class NL2SQLController extends Controller
{
    public function create()
    {
        return Inertia::render('NL2SQL/Create', [
            'connections' => Auth::user()->connections,
        ]);
    }

    public function store(Request $request, NL2SQLTool $nl2sql, ExecutorTool $executor)
    {
        set_time_limit(60); // 60 seconds max
        
        if (!Auth::check() || !Auth::user()) {
            if ($request->wantsJson()) {
                return response()->json(['error' => 'Usuario no autenticado'], 401);
            }
            return back()->with('error', 'Usuario no autenticado');
        }
        
        $request->validate([
            'query' => 'required|string|max:255',
        ]);

        try {
            $connection = Connection::getActiveForUser(Auth::id());
            
            if (!$connection) {
                
                if ($request->wantsJson()) {
                    return response()->json(['error' => 'No tienes una conexión activa. Por favor, crea y activa una conexión primero.'], 400);
                }
                return back()->with('error', 'No tienes una conexión activa. Por favor, crea y activa una conexión primero.');
            }

            $sql = $nl2sql->generate($connection, $request->input('query'));
            
            $trimmedSql = strtolower(trim($sql));
            if (str_starts_with($trimmedSql, 'update') || str_starts_with($trimmedSql, 'delete')) {
                $affectedRecords = $executor->getAffectedRecords($sql, $connection);
                
                if ($request->wantsJson()) {
                    return response()->json([
                        'pendingQuery' => [
                            'sql' => $sql,
                            'type' => str_starts_with($trimmedSql, 'update') ? 'update' : 'delete',
                            'affectedRecords' => $affectedRecords,
                            'affectedCount' => count($affectedRecords)
                        ]
                    ]);
                }
                
                return Inertia::render('NL2SQL/Create', [
                    'connections' => Auth::user()->connections,
                    'pendingQuery' => [
                        'sql' => $sql,
                        'type' => str_starts_with($trimmedSql, 'update') ? 'update' : 'delete',
                        'affectedRecords' => $affectedRecords,
                        'affectedCount' => count($affectedRecords)
                    ],
                ]);
            }

            $result = $executor->execute($sql, $connection);

            $queryType = 'select'; // default
            if (str_starts_with($trimmedSql, 'insert')) {
                $queryType = 'insert';
            } elseif (str_starts_with($trimmedSql, 'update')) {
                $queryType = 'update';
            } elseif (str_starts_with($trimmedSql, 'delete')) {
                $queryType = 'delete';
            }

            if (is_array($result) && isset($result[0]) && is_array($result[0]) && isset($result[0]['success'])) {
                $affectedRows = 0;
                if (isset($result[0]['affected_rows'])) {
                    $affectedRows = $result[0]['affected_rows'];
                }
                
                $updatedData = null;
                if ($queryType === 'insert') {
                    try {
                        if ($connection) {
                            // Configure dynamic connection for this query
                            $connectionConfig = [
                                'driver' => $connection->driver,
                                'host' => $connection->host,
                                'port' => $connection->port,
                                'database' => $connection->database,
                                'username' => $connection->username,
                                'password' => $connection->password,
                            ];
                            
                            config(['database.connections.temp_insert' => $connectionConfig]);
                            DB::purge('temp_insert');
                            
                            $updatedData = DB::connection('temp_insert')->select('SELECT * FROM users ORDER BY created_at DESC LIMIT 10');
                        } else {
                            $updatedData = DB::select('SELECT * FROM users ORDER BY created_at DESC LIMIT 10');
                        }
                    } catch (\Exception $e) {
                        $updatedData = null;
                    }
                }
                
                if ($request->wantsJson()) {
                    return response()->json([
                        'result' => [
                            'sql' => $sql,
                            'data' => $updatedData ?: $result,
                            'type' => $queryType,
                            'affected_rows' => $affectedRows
                        ]
                    ]);
                }
                
                return Inertia::render('NL2SQL/Create', [
                    'connections' => Auth::user()->connections,
                    'result' => [
                        'sql' => $sql,
                        'data' => $updatedData ?: $result,
                        'type' => $queryType,
                        'affected_rows' => $affectedRows
                    ],
                ]);
            }

            if ($request->wantsJson()) {
                return response()->json([
                    'result' => [
                        'sql' => $sql,
                        'data' => $result,
                        'type' => 'select'
                    ]
                ]);
            }
            
            return Inertia::render('NL2SQL/Create', [
                'connections' => Auth::user()->connections,
                'result' => [
                    'sql' => $sql,
                    'data' => $result,
                    'type' => 'select'
                ],
            ]);
            
        } catch (\Exception $e) {
            
            if ($request->wantsJson()) {
                return response()->json(['error' => 'Error procesando la consulta: ' . $e->getMessage()], 500);
            }
            return back()->with('error', 'Error procesando la consulta: ' . $e->getMessage());
        }
    }

    public function confirm(Request $request, ExecutorTool $executor)
    {
        $request->validate([
            'sql' => 'required|string',
            'type' => 'required|in:update,delete',
        ]);

        try {
            $result = $executor->execute($request->input('sql'));
            
            $affectedRows = 0;
            if (isset($result[0]['affected_rows'])) {
                $affectedRows = $result[0]['affected_rows'];
            }
            
            if ($request->wantsJson()) {
                return response()->json([
                    'result' => [
                        'sql' => $request->input('sql'),
                        'data' => $result,
                        'type' => $request->input('type'),
                        'affected_rows' => $affectedRows
                    ]
                ]);
            }
            
            return Inertia::render('NL2SQL/Create', [
                'connections' => Auth::user()->connections,
                'result' => [
                    'sql' => $request->input('sql'),
                    'data' => $result,
                    'type' => $request->input('type'),
                    'affected_rows' => $affectedRows
                ],
            ]);
        } catch (\Exception $e) {
            if ($request->wantsJson()) {
                return response()->json(['error' => 'Error executing query: ' . $e->getMessage()], 500);
            }
            return back()->with('error', 'Error executing query: ' . $e->getMessage());
        }
    }
}