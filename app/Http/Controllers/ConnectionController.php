<?php

namespace App\Http\Controllers;

use App\Models\Connection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class ConnectionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Verificar si el usuario está autenticado

        if (request()->ajax() || request()->wantsJson()) {
            $connections = Auth::user()->connections;
            return response()->json($connections);
        }

        if (!Auth::check()) {
            \Log::info('Usuario no autenticado en ConnectionController@index');
            return response()->json([
                'error' => 'Usuario no autenticado',
                'message' => 'Unauthenticated.'
            ], 401);
        }

        \Log::info('Usuario autenticado:', ['user_id' => Auth::id()]);
        
        if (request()->wantsJson()) {
            $connections = Auth::user()->connections;
            \Log::info('Conexiones encontradas:', ['count' => $connections->count()]);
            return response()->json($connections);
        }

        return Inertia::render('Connections/Index', [
            'connections' => Auth::user()->connections,
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
        $isFirstConnection = Auth::user()->connections()->count() === 0;

        $connection = Auth::user()->connections()->create($request->all());

        // If this is the first connection, make it active
        if ($isFirstConnection) {
            $connection->activate();
        }

        // Si es una petición API, devolver JSON
        if ($request->expectsJson() || $request->is('api/*')) {
            return response()->json([
                'success' => true,
                'message' => 'Conexión creada exitosamente',
                'connection' => $connection
            ], 201);
        }

        return redirect()->route('connections');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $connection = Auth::user()->connections()->findOrFail($id);
        
        return Inertia::render('Connections/Show', [
            'connection' => $connection,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $connection = Auth::user()->connections()->findOrFail($id);
        
        return Inertia::render('Connections/Edit', [
            'connection' => $connection,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $connection = Auth::user()->connections()->findOrFail($id);

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

        return redirect()->route('connections');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $connection = Auth::user()->connections()->findOrFail($id);
        
        // If this is the active connection, activate another one if available
        if ($connection->is_active) {
            $otherConnection = Auth::user()->connections()
                ->where('id', '!=', $id)
                ->first();
            
            if ($otherConnection) {
                $otherConnection->activate();
            }
        }

        $connection->delete();

        return redirect()->route('connections');
    }

    /**
     * Activate a connection
     */
    public function activate(string $id)
    {
        $connection = Auth::user()->connections()->findOrFail($id);
        $connection->activate();

        return redirect()->route('connections');
    }

    /**
     * Get the active connection for the authenticated user
     */
    public function getActive()
    {
        $activeConnection = Connection::getActiveForUser(Auth::id());
        
        return response()->json([
            'connection' => $activeConnection
        ]);
    }
}
