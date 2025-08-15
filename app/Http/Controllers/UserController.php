<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rules\Password;

class UserController extends Controller
{
    public function fetch(Request $request)
    {
        $req = $request->validate([
            'id' => 'numeric|required',
        ]);

        $user = User::where('id', $req['id'])->with('roles')->first();

        return response()->json($user, 200);
    }

    public function all()
    {
        $user = User::with('roles')->get();

        return response()->json($user, 200);
    }

    public function create(Request $request)
    {
        $validRequest = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => ['required', Password::defaults()],
            'status' => 'string|nullable|in:activo,inactivo,pendiente',
            'role' => 'string|nullable|in:admin,guest,premium,user',
        ]);

        $user = User::create([
            'name' => $validRequest['name'],
            'email' => $validRequest['email'],
            'password' => Hash::make($validRequest['password']),
            'status' => $validRequest['status'] ?? 'activo',
        ]);

        if (isset($validRequest['role'])) {
            try {
                $user->assignRole($validRequest['role']);
            } catch (\Throwable $th) {
                return response()->json([
                    'error' => $th->getMessage(),
                    'description' => 'Error al asignar rol.'
                ], 400);
            }
        }

        return response()->json($user->load('roles'), 201);
    }

    public function update(Request $req)
    {
        $validRequest = $req->validate([
            'id' => 'numeric|required',
            'name' => 'string|max:255',
            'email' => 'email|unique:users,email,' . $req['id'],
            'password' => [Password::defaults()],
            'status' => 'string|nullable|in:activo,inactivo,pendiente',
            'role' => 'string|nullable|in:admin,guest,premium,user',
        ]);

        $user = User::findOrFail($req['id']);

        if (isset($validRequest['password'])) {
            $validRequest['password'] = Hash::make($validRequest['password']);
        }

        $user->update($validRequest);

        if (isset($validRequest['role'])) {
            try {
                $user->syncRoles([$validRequest['role']]);
            } catch (\Throwable $th) {
                return response()->json([
                    'error' => $th->getMessage(),
                    'description' => 'Error al actualizar rol.'
                ], 400);
            }
        }

        return response()->json($user->load('roles'), 200);
    }

    public function upgradeToPremium(Request $request)
    {
        $user = $request->user();
        
        if (!$user) {
            return response()->json(['error' => 'Usuario no autenticado'], 401);
        }

        try {
            $user->syncRoles(['premium']);
            return response()->json([
                'message' => 'Usuario actualizado a premium exitosamente',
                'user' => $user->load('roles')
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'error' => $th->getMessage(),
                'description' => 'Error al actualizar a premium.'
            ], 400);
        }
    }

    public function getCurrentUser(Request $request)
    {
        $user = $request->user();
        
        if (!$user) {
            return response()->json(['error' => 'Usuario no autenticado'], 401);
        }

        $userWithRoles = $user->load('roles');
        
        // Determinar el plan basado en el rol
        $plan = 'Free';
        $tokensRemaining = 200;
        $dailyTokenLimit = 200;
        
        if ($userWithRoles->hasRole('premium')) {
            $plan = 'Premium';
            $tokensRemaining = 999999; // Ilimitado
            $dailyTokenLimit = 999999;
        } elseif ($userWithRoles->hasRole('guest')) {
            $plan = 'Guest';
            $tokensRemaining = 50;
            $dailyTokenLimit = 100;
        }

        return response()->json([
            'user' => $userWithRoles,
            'plan' => $plan,
            'tokensRemaining' => $tokensRemaining,
            'tokensResetTime' => '24 hours',
            'dailyTokenLimit' => $dailyTokenLimit
        ], 200);
    }

    public function delete($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'error' => 'Usuario no encontrado'
            ], 404);
        }

        try {
            $user->delete();
            return response()->json([
                'message' => 'Usuario eliminado correctamente'
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'error' => $th->getMessage(),
                'description' => 'Error al eliminar usuario.'
            ], 500);
        }
    }

    public function emailIsTaken(Request $request)
    {
        $req = $request->validate([
            'email' => 'email|required'
        ]);

        $email = User::where('email', $req['email'])->first();

        if ($email) {
            return response()->json(true, 200);
        } else {
            return response()->json(false, 200);
        }
    }

    /**
     * Actualizar perfil del usuario autenticado
     */
    public function updateProfile(Request $request)
    {
        Log::info('updateProfile called', ['request' => $request->all()]);
        
        $user = $request->user();
        
        if (!$user) {
            Log::warning('updateProfile: User not authenticated');
            return response()->json(['error' => 'Usuario no autenticado'], 401);
        }

        Log::info('updateProfile: User authenticated', ['user_id' => $user->id]);

        $validRequest = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
        ]);

        try {
            $user->update($validRequest);
            
            Log::info('updateProfile: Profile updated successfully', ['user_id' => $user->id]);
            
            return response()->json([
                'message' => 'Perfil actualizado exitosamente',
                'user' => $user->fresh()
            ], 200);
        } catch (\Throwable $th) {
            Log::error('updateProfile: Error updating profile', ['error' => $th->getMessage(), 'user_id' => $user->id]);
            return response()->json([
                'error' => $th->getMessage(),
                'description' => 'Error al actualizar perfil.'
            ], 400);
        }
    }

    /**
     * Actualizar contraseña del usuario autenticado
     */
    public function updatePassword(Request $request)
    {
        Log::info('updatePassword called', ['request' => $request->all()]);
        
        $user = $request->user();
        
        if (!$user) {
            Log::warning('updatePassword: User not authenticated');
            return response()->json(['error' => 'Usuario no autenticado'], 401);
        }

        Log::info('updatePassword: User authenticated', ['user_id' => $user->id]);

        $validRequest = $request->validate([
            'current_password' => 'required|string',
            'password' => ['required', 'confirmed', Password::defaults()],
        ]);

        // Verificar contraseña actual
        if (!Hash::check($validRequest['current_password'], $user->password)) {
            Log::warning('updatePassword: Current password incorrect', ['user_id' => $user->id]);
            return response()->json([
                'error' => 'La contraseña actual es incorrecta'
            ], 422);
        }

        try {
            $user->update([
                'password' => Hash::make($validRequest['password'])
            ]);
            
            Log::info('updatePassword: Password updated successfully', ['user_id' => $user->id]);
            
            return response()->json([
                'message' => 'Contraseña actualizada exitosamente'
            ], 200);
        } catch (\Throwable $th) {
            Log::error('updatePassword: Error updating password', ['error' => $th->getMessage(), 'user_id' => $user->id]);
            return response()->json([
                'error' => $th->getMessage(),
                'description' => 'Error al actualizar contraseña.'
            ], 400);
        }
    }
}
