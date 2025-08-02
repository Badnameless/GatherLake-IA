<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Models\User;

class TestAuth extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'test:auth {email}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Test authentication and admin role for a user';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $email = $this->argument('email');
        
        $user = User::where('email', $email)->first();
        
        if (!$user) {
            $this->error("User with email '{$email}' not found.");
            return 1;
        }
        
        $this->info("User found: {$user->name} ({$user->email})");
        
        // Check roles
        $roles = $user->roles->pluck('name')->toArray();
        $this->info("Roles: " . implode(', ', $roles));
        
        // Check if has admin role
        $hasAdminRole = $user->hasRole('admin');
        $this->info("Has admin role: " . ($hasAdminRole ? 'YES' : 'NO'));
        
        // Simulate admin middleware check
        $adminCheck = DB::table('model_has_roles')
            ->join('roles', 'model_has_roles.role_id', '=', 'roles.id')
            ->where('model_has_roles.model_id', $user->id)
            ->where('model_has_roles.model_type', get_class($user))
            ->where('roles.name', 'admin')
            ->exists();
            
        $this->info("Admin middleware check: " . ($adminCheck ? 'PASS' : 'FAIL'));
        
        return 0;
    }
} 