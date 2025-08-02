<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Crypt;

class Connection extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'driver',
        'host',
        'port',
        'database',
        'username',
        'password',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function setPasswordAttribute($value)
    {
        if ($value === null || $value === '') {
            $this->attributes['password'] = null;
        } else {
            $this->attributes['password'] = Crypt::encryptString($value);
        }
    }

    public function getPasswordAttribute($value)
    {
        if ($value === null) {
            return null;
        }
        
        try {
            return Crypt::decryptString($value);
        } catch (\Illuminate\Contracts\Encryption\DecryptException $e) {
            return null;
        }
    }

    /**
     * Activate this connection and deactivate all others for the user
     */
    public function activate()
    {
        // Deactivate all other connections for this user
        static::where('user_id', $this->user_id)
            ->where('id', '!=', $this->id)
            ->update(['is_active' => false]);

        // Activate this connection
        $this->update(['is_active' => true]);
    }

    /**
     * Get the active connection for a user
     */
    public static function getActiveForUser($userId)
    {
        return static::where('user_id', $userId)
            ->where('is_active', true)
            ->first();
    }

    /**
     * Check if this connection is active
     */
    public function isActive()
    {
        return $this->is_active;
    }
}
