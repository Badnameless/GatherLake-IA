<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

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

    public function update(Request $req)
    {
        $validRequest = $req->validate([
            'id' => 'numeric|required',
            'name' => 'string|nullable',
            'email' => 'email|nullable',
            'status' => 'string|nullable',
            'role' => 'string|nullable',
        ]);

        $user = User::where('id', $validRequest['id'])->with('roles')->first();

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
}
