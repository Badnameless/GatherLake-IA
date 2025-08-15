<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class ApiWithSession
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Forzar que la respuesta sea JSON
        $request->headers->set('Accept', 'application/json');
        
        // No verificar autenticación aquí, dejar que el controlador lo maneje
        // ya que las rutas web comparten la misma sesión
        
        return $next($request);
    }
} 