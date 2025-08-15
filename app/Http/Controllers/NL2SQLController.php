<?php

namespace App\Http\Controllers;

use App\Models\Connection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use App\Mcp\NL2SQLTool;
use App\Mcp\ExecutorTool;
use Illuminate\Support\Facades\DB; // Added DB facade

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
        // Debug logs de autenticación
        \Log::info('=== AUTENTICACIÓN DEBUG ===');
        \Log::info('Auth::check(): ' . (Auth::check() ? 'true' : 'false'));
        \Log::info('Auth::id(): ' . Auth::id());
        \Log::info('Auth::user(): ' . (Auth::user() ? 'Usuario encontrado' : 'Usuario NULL'));
        \Log::info('Session ID: ' . $request->session()->getId());
        \Log::info('Request headers: ' . json_encode($request->headers->all()));
        \Log::info('Request cookies: ' . json_encode($request->cookies->all()));
        
        // Verificación de seguridad
        if (!Auth::check() || !Auth::user()) {
            \Log::error('Usuario no autenticado en NL2SQL store');
            if ($request->wantsJson()) {
                return response()->json(['error' => 'Usuario no autenticado'], 401);
            }
            return back()->with('error', 'Usuario no autenticado');
        }
        
        $request->validate([
            'query' => 'required|string|max:255',
        ]);

        // Debug logs
        \Log::info('NL2SQL store method called', [
            'user_id' => Auth::id(),
            'user_authenticated' => Auth::check(),
            'request_data' => $request->all()
        ]);

        // Get the active connection for the authenticated user
        $connection = Connection::getActiveForUser(Auth::id());
        
        \Log::info('Active connection result', [
            'connection' => $connection,
            'connection_id' => $connection ? $connection->id : null,
            'connection_name' => $connection ? $connection->name : null,
            'is_active' => $connection ? $connection->is_active : null
        ]);
        
        if (!$connection) {
            \Log::error('No active connection found for user', [
                'user_id' => Auth::id(),
                'total_connections' => Auth::user()->connections()->count(),
                'all_connections' => Auth::user()->connections()->get(['id', 'name', 'is_active'])
            ]);
            
            if ($request->wantsJson()) {
                return response()->json(['error' => 'No tienes una conexión activa. Por favor, crea y activa una conexión primero.'], 400);
            }
            return back()->with('error', 'No tienes una conexión activa. Por favor, crea y activa una conexión primero.');
        }

        $sql = $nl2sql->generate($connection, $request->input('query'));
        
        // Check if it's an UPDATE or DELETE query that needs confirmation
        $trimmedSql = strtolower(trim($sql));
        if (str_starts_with($trimmedSql, 'update') || str_starts_with($trimmedSql, 'delete')) {
            // Get affected records for confirmation
            $affectedRecords = $executor->getAffectedRecords($sql);
            
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

        // Execute SELECT or INSERT directly
        $result = $executor->execute($sql);

        // Determine the type of query
        $queryType = 'select'; // default
        if (str_starts_with($trimmedSql, 'insert')) {
            $queryType = 'insert';
        } elseif (str_starts_with($trimmedSql, 'update')) {
            $queryType = 'update';
        } elseif (str_starts_with($trimmedSql, 'delete')) {
            $queryType = 'delete';
        }

        // Check if it's a success response (INSERT/UPDATE/DELETE) or a SELECT result
        if (is_array($result) && isset($result[0]) && is_array($result[0]) && isset($result[0]['success'])) {
            $affectedRows = 0;
            if (isset($result[0]['affected_rows'])) {
                $affectedRows = $result[0]['affected_rows'];
            }
            
            // For INSERT operations, get the updated table
            $updatedData = null;
            if ($queryType === 'insert') {
                try {
                    $updatedData = DB::select('SELECT * FROM users ORDER BY created_at DESC LIMIT 10');
                } catch (\Exception $e) {
                    // If we can't get the updated table, continue without it
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

        // For SELECT queries, return the result with SQL
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