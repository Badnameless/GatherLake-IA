<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class RequireAuth
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!Auth::check()) {
            // Si es una petición API, devolver JSON en lugar de redirigir
            if ($request->expectsJson() || $request->is('api/*')) {
                return response()->json([
                    'error' => 'Usuario no autenticado',
                    'message' => 'Unauthenticated.'
                ], 401);
            }
            
            return redirect()->route('login');
        }

        return $next($request);
    }
}
