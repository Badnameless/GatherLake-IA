<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Verificar si el usuario está autenticado
        if (!Auth::check()) {
            if ($request->expectsJson()) {
                return response()->json(['error' => 'No autorizado'], 401);
            }
            return redirect()->route('login');
        }

        // Verificar si el usuario tiene el rol de administrador
        $user = Auth::user();
        $hasAdminRole = DB::table('model_has_roles')
            ->join('roles', 'model_has_roles.role_id', '=', 'roles.id')
            ->where('model_has_roles.model_id', $user->id)
            ->where('model_has_roles.model_type', get_class($user))
            ->where('roles.name', 'admin')
            ->exists();
        
        if (!$hasAdminRole) {
            if ($request->expectsJson()) {
                return response()->json(['error' => 'Acceso denegado. Solo administradores pueden acceder a este recurso.'], 403);
            }
            // Si no es admin, redirigir a la vista de chat
            return redirect()->route('chat');
        }

        return $next($request);
    }
}
