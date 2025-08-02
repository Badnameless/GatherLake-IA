<?php

namespace App\Http\Controllers;

use App\Models\Connection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Mcp\NL2SQLTool;
use App\Mcp\ExecutorTool;

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
        $request->validate([
            'query' => 'required|string|max:255',
            'connection_id' => 'required|exists:connections,id',
        ]);

        $connection = Connection::findOrFail($request->input('connection_id'));
        $sql = $nl2sql->generate($connection, $request->input('query'));
        
        // Check if it's an UPDATE or DELETE query that needs confirmation
        $trimmedSql = strtolower(trim($sql));
        if (str_starts_with($trimmedSql, 'update') || str_starts_with($trimmedSql, 'delete')) {
            // Get affected records for confirmation
            $affectedRecords = $executor->getAffectedRecords($sql);
            
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

        // Check if it's a success response (INSERT/UPDATE/DELETE) or a SELECT result
        if (is_array($result) && isset($result[0]) && is_array($result[0]) && isset($result[0]['success'])) {
            $message = 'Query executed successfully.';
            if (isset($result[0]['affected_rows'])) {
                $message .= " {$result[0]['affected_rows']} row(s) affected.";
            }
            return back()->with('success', $message);
        }

        return Inertia::render('NL2SQL/Create', [
            'connections' => Auth::user()->connections,
            'result' => $result,
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
            
            $message = 'Query executed successfully.';
            if (isset($result[0]['affected_rows'])) {
                $message .= " {$result[0]['affected_rows']} row(s) affected.";
            }
            
            return back()->with('success', $message);
        } catch (\Exception $e) {
            return back()->with('error', 'Error executing query: ' . $e->getMessage());
        }
    }
}