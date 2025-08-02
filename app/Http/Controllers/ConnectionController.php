<?php

namespace App\Http\Controllers;

use App\Models\Connection;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ConnectionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        if (request()->wantsJson()) {
            return response()->json(auth()->user()->connections);
        }

        return Inertia::render('Connections/Index', [
            'connections' => auth()->user()->connections,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Connections/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'driver' => 'required|string|max:255',
            'host' => 'required|string|max:255',
            'port' => 'required|string|max:255',
            'database' => 'required|string|max:255',
            'username' => 'required|string|max:255',
            'password' => 'nullable|string|max:255',
        ]);

        // Check if this will be the first connection
        $isFirstConnection = $request->user()->connections()->count() === 0;

        $connection = $request->user()->connections()->create($request->all());

        // If this is the first connection, make it active
        if ($isFirstConnection) {
            $connection->activate();
        }

        return redirect()->route('connections.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $connection = auth()->user()->connections()->findOrFail($id);
        
        return Inertia::render('Connections/Show', [
            'connection' => $connection,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $connection = auth()->user()->connections()->findOrFail($id);
        
        return Inertia::render('Connections/Edit', [
            'connection' => $connection,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $connection = auth()->user()->connections()->findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255',
            'driver' => 'required|string|max:255',
            'host' => 'required|string|max:255',
            'port' => 'required|string|max:255',
            'database' => 'required|string|max:255',
            'username' => 'required|string|max:255',
            'password' => 'nullable|string|max:255',
        ]);

        $connection->update($request->all());

        return redirect()->route('connections.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $connection = auth()->user()->connections()->findOrFail($id);
        
        // If this is the active connection, activate another one if available
        if ($connection->is_active) {
            $otherConnection = auth()->user()->connections()
                ->where('id', '!=', $id)
                ->first();
            
            if ($otherConnection) {
                $otherConnection->activate();
            }
        }

        $connection->delete();

        return redirect()->route('connections.index');
    }

    /**
     * Activate a connection
     */
    public function activate(string $id)
    {
        $connection = auth()->user()->connections()->findOrFail($id);
        $connection->activate();

        return redirect()->route('connections.index');
    }

    /**
     * Get the active connection for the authenticated user
     */
    public function getActive()
    {
        $activeConnection = Connection::getActiveForUser(auth()->id());
        
        return response()->json([
            'connection' => $activeConnection
        ]);
    }
}
