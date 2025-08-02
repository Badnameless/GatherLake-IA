<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class UserController extends Controller
{
    public function get($id)
    {
        $user = User::with('roles')->find($id);
        return response()->json($user, 200);
    }

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

    public function update(Request $req, $id = null)
    {
        $validRequest = $req->validate([
            'id' => 'numeric|nullable',
            'name' => 'string|nullable',
            'email' => 'email|nullable',
            'status' => 'string|nullable',
            'role' => 'string|nullable',
        ]);

        // Use ID from parameter or from request
        $userId = $id ?? $validRequest['id'];
        $user = User::where('id', $userId)->with('roles')->first();

        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        // Update user attributes manually
        $user->name = $validRequest['name'] ?? $user->name;
        $user->email = $validRequest['email'] ?? $user->email;
        $user->status = $validRequest['status'] ?? $user->status;
        $user->save(); // Persist changes

        try {
            if (isset($validRequest['role'])) {
                $user->syncRoles([$validRequest['role']]);
            }
        } catch (\Throwable $th) {
            return response()->json([
                'error' => $th->getMessage(),
                'description' => 'Wrong role type.'
            ], 400);
        }

        return response()->json($user->load('roles'), 200);
    }

    public function emailIsTaken(Request $request)
    {
        $req = $request->validate([
            'email' => 'email|required'
        ]);

        $email = User::where('email', $req['email'])->first();

        return response()->json(!!$email, 200);
    }
}
