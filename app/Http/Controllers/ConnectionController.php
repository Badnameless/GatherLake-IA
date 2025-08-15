<?php

namespace App\Http\Controllers;

use App\Models\Connection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use PDO;

class ConnectionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {

        if (request()->ajax() || request()->wantsJson()) {
            $connections = Auth::user()->connections;
            return response()->json($connections);
        }

        if (!Auth::check()) {
            return response()->json([
                'error' => 'Usuario no autenticado',
                'message' => 'Unauthenticated.'
            ], 401);
        }

        
        if (request()->wantsJson()) {
            $connections = Auth::user()->connections;
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

        $isFirstConnection = Auth::user()->connections()->count() === 0;

        $connection = Auth::user()->connections()->create($request->all());

        if ($isFirstConnection) {
            $connection->activate();
        }

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

    /**
     * Test database connection and get available extensions
     */
    public function testConnection($id)
    {
        try {
            $connection = Auth::user()->connections()->findOrFail($id);
            
            $extensions = get_loaded_extensions();
            $pdoDrivers = PDO::getAvailableDrivers();
            
            $info = [
                'connection' => $connection,
                'php_extensions' => $extensions,
                'pdo_drivers' => $pdoDrivers,
                'php_version' => PHP_VERSION,
                'php_ini_loaded' => php_ini_loaded_file(),
            ];
            
            return response()->json($info);
            
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ], 500);
        }
    }
}
