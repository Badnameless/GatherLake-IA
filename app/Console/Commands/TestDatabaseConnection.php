<?php

namespace App\Console\Commands;

use App\Models\Connection;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class TestDatabaseConnection extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'db:test-connection {connection_id}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Test a database connection by ID';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $connectionId = $this->argument('connection_id');
        
        try {
            $connection = Connection::findOrFail($connectionId);
            
            $this->info("Testing connection: {$connection->name}");
            $this->info("Driver: {$connection->driver}");
            $this->info("Host: {$connection->host}:{$connection->port}");
            $this->info("Database: {$connection->database}");
            $this->info("Username: {$connection->username}");
            
            // Test the connection
            $this->testConnection($connection);
            
        } catch (\Exception $e) {
            $this->error("Error: " . $e->getMessage());
            return 1;
        }
        
        return 0;
    }
    
    private function testConnection(Connection $connection)
    {
        try {
            // Configure dynamic connection
            $connectionConfig = $this->getConnectionConfig($connection);
            
            config([
                'database.connections.dynamic_connection' => $connectionConfig,
            ]);
            
            // Purge the connection to ensure fresh configuration
            DB::purge('dynamic_connection');
            
            // Test basic connection
            $this->info("Testing basic connection...");
            DB::connection('dynamic_connection')->getPdo();
            $this->info("✅ Basic connection successful!");
            
            // Test getting tables
            $this->info("Testing table retrieval...");
            $tables = $this->getTables($connection->driver);
            $this->info("✅ Found " . count($tables) . " tables!");
            
            // Show first few tables
            if (count($tables) > 0) {
                $this->info("Sample tables:");
                foreach (array_slice($tables, 0, 5) as $table) {
                    $tableName = $table->tablename ?? $table->table_name ?? $table->name;
                    $this->line("  - {$tableName}");
                }
                
                if (count($tables) > 5) {
                    $this->line("  ... and " . (count($tables) - 5) . " more");
                }
            }
            
            // Test getting columns for first table
            if (count($tables) > 0) {
                $firstTable = $tables[0];
                $tableName = $firstTable->tablename ?? $firstTable->table_name ?? $firstTable->name;
                
                $this->info("Testing column retrieval for table: {$tableName}");
                $columns = $this->getColumns($connection->driver, $tableName);
                $this->info("✅ Found " . count($columns) . " columns!");
                
                // Show first few columns
                if (count($columns) > 0) {
                    $this->info("Sample columns:");
                    foreach (array_slice($columns, 0, 5) as $column) {
                        $columnName = $column->column_name ?? $column->name ?? 'unknown';
                        $dataType = $column->data_type ?? $column->type ?? 'unknown';
                        $this->line("  - {$columnName} ({$dataType})");
                    }
                    
                    if (count($columns) > 5) {
                        $this->line("  ... and " . (count($columns) - 5) . " more");
                    }
                }
            }
            
            $this->info("🎉 All tests passed! Connection is working correctly.");
            
        } catch (\Exception $e) {
            $this->error("❌ Connection test failed: " . $e->getMessage());
            throw $e;
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
    
    private function getTables(string $driver): array
    {
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
    }
    
    private function getColumns(string $driver, string $tableName): array
    {
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
    }
} 