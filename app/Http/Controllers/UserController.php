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

    public function all()
    {
        $user = User::with('roles')->get();

        return response()->json($user, 200);
    }

    public function update(Request $req, $id)
    {
        $validRequest = $req->validate([
            'name' => 'string|nullable',
            'email' => 'email|nullable',
            'status' => 'string|nullable',
            'role' => 'string|nullable',
        ]);

        $user = User::where('id', $id)->with('roles')->first();

        // Update user attributes manually
        $user->name = $validRequest['name'] ?? $user->name;
        $user->email = $validRequest['email'] ?? $user->email;
        $user->status = $validRequest['status'] ?? $user->status;
        $user->save(); // Persist changes

        try {
            $user->syncRoles([$validRequest['role']]);
        } catch (\Throwable $th) {
            return response()->json([
                'error' => $th->getMessage(),
                'description' => 'Wrong rol type.'
            ]);
        }

        return response()->json($user->load('roles'), 200);
    }
}
