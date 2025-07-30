<?php

namespace App\Http\Controllers;

use App\Models\Connection;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Mcp\NL2SQLTool;
use App\Mcp\ExecutorTool;

class NL2SQLController extends Controller
{
    public function create()
    {
        return Inertia::render('NL2SQL/Create', [
            'connections' => auth()->user()->connections,
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
        $result = $executor->execute($sql);

        if (isset($result[0]['success'])) {
            return back()->with('success', 'Query executed successfully.');
        }

        return Inertia::render('NL2SQL/Create', [
            'connections' => auth()->user()->connections,
            'result' => $result,
        ]);
    }
}