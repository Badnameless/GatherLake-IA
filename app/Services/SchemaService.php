<?php

namespace App\Services;

use App\Models\Connection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use PDO;

class SchemaService
{
    public function getSchema(Connection $connection): array
    {
        try {
            // For remote connections (like Supabase), always use PDO as it's more reliable
            if ($this->isRemoteConnection($connection)) {
                Log::info('Remote connection detected, using PDO directly for reliability');
                return $this->getSchemaWithPDO($connection);
            }
            
            // For local connections, try Laravel first, then PDO fallback
            try {
                return $this->getSchemaWithLaravel($connection);
            } catch (\Exception $e) {
                Log::warning('Laravel dynamic connection failed, trying PDO fallback: ' . $e->getMessage());
                return $this->getSchemaWithPDO($connection);
            }
            
        } catch (\Exception $e) {
            Log::error('SchemaService error:', [
                'message' => $e->getMessage(),
                'driver' => $connection->driver,
                'trace' => $e->getTraceAsString()
            ]);
            throw $e;
        }
    }

    private function getSchemaWithLaravel(Connection $connection): array
    {
        // Set the database connection dynamically with proper configuration for each driver
        $connectionConfig = $this->getConnectionConfig($connection);
        
        // Log the configuration being used
        Log::info('Setting dynamic connection config:', [
            'driver' => $connection->driver,
            'host' => $connection->host,
            'port' => $connection->port,
            'database' => $connection->database,
            'username' => $connection->username,
            'config_keys' => array_keys($connectionConfig)
        ]);
        
        config([
            'database.connections.dynamic_connection' => $connectionConfig,
        ]);

        // Purge the connection to ensure fresh configuration
        DB::purge('dynamic_connection');
        
        // Test the connection before proceeding
        $this->testConnection($connection->driver);
        
        // Get the tables based on the database driver
        $tables = $this->getTables($connection->driver);

        $schema = [];
        foreach ($tables as $table) {
            $tableName = $table->tablename ?? $table->table_name ?? $table->name;
            $columns = $this->getColumns($connection->driver, $tableName);
            $schema[$tableName] = $columns;
        }

        return $schema;
    }

    private function getSchemaWithPDO(Connection $connection): array
    {
        Log::info('Using PDO fallback for connection');
        
        // Create PDO connection directly
        $dsn = $this->buildPDODSN($connection);
        $pdo = new PDO($dsn, $connection->username, $connection->password);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        
        // Get tables using PDO
        $tables = $this->getTablesWithPDO($pdo, $connection->driver);
        
        $schema = [];
        foreach ($tables as $table) {
            $tableName = $table->tablename ?? $table->table_name ?? $table->name;
            $columns = $this->getColumnsWithPDO($pdo, $connection->driver, $tableName);
            $schema[$tableName] = $columns;
        }
        
        return $schema;
    }

    private function isRemoteConnection(Connection $connection): bool
    {
        // Check if it's a remote connection (not localhost or 127.0.0.1)
        $remoteHosts = [
            'aws-0-us-east-2.pooler.supabase.com', // Supabase
            'supabase.com',
            'aws.amazonaws.com',
            'googleapis.com',
            'azure.com',
            'digitalocean.com'
        ];
        
        foreach ($remoteHosts as $remoteHost) {
            if (str_contains($connection->host, $remoteHost)) {
                return true;
            }
        }
        
        // Also check for non-local IP addresses
        if (!in_array($connection->host, ['localhost', '127.0.0.1', '::1'])) {
            // Check if it's a private IP range
            if (filter_var($connection->host, FILTER_VALIDATE_IP)) {
                $ip = ip2long($connection->host);
                if (!($ip >= ip2long('10.0.0.0') && $ip <= ip2long('10.255.255.255')) &&
                    !($ip >= ip2long('172.16.0.0') && $ip <= ip2long('172.31.255.255')) &&
                    !($ip >= ip2long('192.168.0.0') && $ip <= ip2long('192.168.255.255'))) {
                    return true;
                }
            }
        }
        
        return false;
    }

    private function testConnection(string $driver): void
    {
        try {
            // Test basic connection
            $pdo = DB::connection('dynamic_connection')->getPdo();
            Log::info("Connection test successful for driver: {$driver}");
        } catch (\Exception $e) {
            Log::error("Connection test failed for driver {$driver}: " . $e->getMessage());
            throw new \Exception("Could not establish connection with driver {$driver}: " . $e->getMessage());
        }
    }

    private function getConnectionConfig(Connection $connection): array
    {
        $baseConfig = [
            'driver' => $connection->driver,
            'host' => $connection->host,
            'port' => $connection->port,
            'database' => $connection->database,
            'username' => $connection->username,
            'password' => $connection->password,
        ];

        // Add driver-specific configurations
        switch ($connection->driver) {
            case 'pgsql':
                return array_merge($baseConfig, [
                    'charset' => 'utf8',
                    'prefix' => '',
                    'prefix_indexes' => true,
                    'search_path' => 'public',
                    'sslmode' => 'prefer',
                ]);
            
            case 'mysql':
                return array_merge($baseConfig, [
                    'charset' => 'utf8mb4',
                    'collation' => 'utf8mb4_unicode_ci',
                    'prefix' => '',
                    'prefix_indexes' => true,
                    'strict' => true,
                    'engine' => null,
                ]);
            
            case 'sqlite':
                return array_merge($baseConfig, [
                    'database' => $connection->database,
                    'prefix' => '',
                    'foreign_key_constraints' => true,
                ]);
            
            case 'sqlsrv':
                return array_merge($baseConfig, [
                    'charset' => 'utf8',
                    'prefix' => '',
                    'prefix_indexes' => true,
                ]);
            
            default:
                return $baseConfig;
        }
    }

    private function buildPDODSN(Connection $connection): string
    {
        switch ($connection->driver) {
            case 'pgsql':
                return "pgsql:host={$connection->host};port={$connection->port};dbname={$connection->database}";
            case 'mysql':
                return "mysql:host={$connection->host};port={$connection->port};dbname={$connection->database};charset=utf8mb4";
            case 'sqlite':
                return "sqlite:{$connection->database}";
            case 'sqlsrv':
                return "sqlsrv:Server={$connection->host},{$connection->port};Database={$connection->database}";
            default:
                throw new \Exception("Unsupported database driver: {$connection->driver}");
        }
    }

    private function getTables(string $driver): array
    {
        try {
            switch ($driver) {
                case 'pgsql':
                    return DB::connection('dynamic_connection')->select(
                        "SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname NOT IN ('pg_catalog', 'information_schema')"
                    );
                
                case 'mysql':
                    return DB::connection('dynamic_connection')->select(
                        "SELECT table_name as tablename FROM information_schema.tables WHERE table_schema = DATABASE()"
                    );
                
                case 'sqlite':
                    return DB::connection('dynamic_connection')->select(
                        "SELECT name as tablename FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'"
                    );
                
                case 'sqlsrv':
                    return DB::connection('dynamic_connection')->select(
                        "SELECT TABLE_NAME as tablename FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE'"
                    );
                
                default:
                    throw new \Exception("Unsupported database driver: {$driver}");
            }
        } catch (\Exception $e) {
            Log::error("Error getting tables for driver {$driver}: " . $e->getMessage());
            throw new \Exception("Could not retrieve tables from database: " . $e->getMessage());
        }
    }

    private function getTablesWithPDO(PDO $pdo, string $driver): array
    {
        switch ($driver) {
            case 'pgsql':
                $stmt = $pdo->query("SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname NOT IN ('pg_catalog', 'information_schema')");
                return $stmt->fetchAll(PDO::FETCH_OBJ);
            
            case 'mysql':
                $stmt = $pdo->query("SELECT table_name as tablename FROM information_schema.tables WHERE table_schema = DATABASE()");
                return $stmt->fetchAll(PDO::FETCH_OBJ);
            
            case 'sqlite':
                $stmt = $pdo->query("SELECT name as tablename FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'");
                return $stmt->fetchAll(PDO::FETCH_OBJ);
            
            case 'sqlsrv':
                $stmt = $pdo->query("SELECT TABLE_NAME as tablename FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE'");
                return $stmt->fetchAll(PDO::FETCH_OBJ);
            
            default:
                throw new \Exception("Unsupported database driver: {$driver}");
        }
    }

    private function getColumns(string $driver, string $tableName): array
    {
        try {
            switch ($driver) {
                case 'pgsql':
                    return DB::connection('dynamic_connection')->select(
                        "SELECT column_name, data_type, is_nullable, column_default 
                         FROM information_schema.columns 
                         WHERE table_name = ? AND table_schema = 'public'
                         ORDER BY ordinal_position",
                        [$tableName]
                    );
                
                case 'mysql':
                    return DB::connection('dynamic_connection')->select(
                        "SELECT column_name, data_type, is_nullable, column_default 
                         FROM information_schema.columns 
                         WHERE table_name = ? AND table_schema = DATABASE()
                         ORDER BY ordinal_position",
                        [$tableName]
                    );
                
                case 'sqlite':
                    return DB::connection('dynamic_connection')->select(
                        "PRAGMA table_info(?)",
                        [$tableName]
                    );
                
                case 'sqlsrv':
                    return DB::connection('dynamic_connection')->select(
                        "SELECT COLUMN_NAME as column_name, DATA_TYPE as data_type, IS_NULLABLE as is_nullable, COLUMN_DEFAULT as column_default
                         FROM INFORMATION_SCHEMA.COLUMNS 
                         WHERE TABLE_NAME = ?
                         ORDER BY ORDINAL_POSITION",
                        [$tableName]
                    );
                
                default:
                    throw new \Exception("Unsupported database driver: {$driver}");
            }
        } catch (\Exception $e) {
            Log::error("Error getting columns for table {$tableName} with driver {$driver}: " . $e->getMessage());
            throw new \Exception("Could not retrieve columns for table {$tableName}: " . $e->getMessage());
        }
    }

    private function getColumnsWithPDO(PDO $pdo, string $driver, string $tableName): array
    {
        switch ($driver) {
            case 'pgsql':
                $stmt = $pdo->prepare("SELECT column_name, data_type, is_nullable, column_default FROM information_schema.columns WHERE table_name = ? AND table_schema = 'public' ORDER BY ordinal_position");
                $stmt->execute([$tableName]);
                return $stmt->fetchAll(PDO::FETCH_OBJ);
            
            case 'mysql':
                $stmt = $pdo->prepare("SELECT column_name, data_type, is_nullable, column_default FROM information_schema.columns WHERE table_name = ? AND table_schema = DATABASE() ORDER BY ordinal_position");
                $stmt->execute([$tableName]);
                return $stmt->fetchAll(PDO::FETCH_OBJ);
            
            case 'sqlite':
                $stmt = $pdo->prepare("PRAGMA table_info(?)");
                $stmt->execute([$tableName]);
                return $stmt->fetchAll(PDO::FETCH_OBJ);
            
            case 'sqlsrv':
                $stmt = $pdo->prepare("SELECT COLUMN_NAME as column_name, DATA_TYPE as data_type, IS_NULLABLE as is_nullable, COLUMN_DEFAULT as column_default FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = ? ORDER BY ORDINAL_POSITION");
                $stmt->execute([$tableName]);
                return $stmt->fetchAll(PDO::FETCH_OBJ);
            
            default:
                throw new \Exception("Unsupported database driver: {$driver}");
        }
    }
}