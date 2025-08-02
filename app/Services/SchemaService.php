<?php

namespace App\Services;

use App\Models\Connection;
use Illuminate\Support\Facades\DB;

class SchemaService
{
    public function getSchema(Connection $connection): array
    {
        // Set the database connection dynamically
        config([
            'database.connections.dynamic_connection' => [
                'driver' => $connection->driver,
                'host' => $connection->host,
                'port' => $connection->port,
                'database' => $connection->database,
                'username' => $connection->username,
                'password' => $connection->password,
            ],
        ]);

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

    private function getTables(string $driver): array
    {
        switch ($driver) {
            case 'pgsql':
                return DB::connection('dynamic_connection')->select(
                    "SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname != 'pg_catalog' AND schemaname != 'information_schema'"
                );
            
            case 'mysql':
                return DB::connection('dynamic_connection')->select(
                    "SELECT table_name as tablename FROM information_schema.tables WHERE table_schema = DATABASE()"
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
                    "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = ?",
                    [$tableName]
                );
            
            case 'mysql':
                return DB::connection('dynamic_connection')->select(
                    "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = ? AND table_schema = DATABASE()",
                    [$tableName]
                );
            
            default:
                throw new \Exception("Unsupported database driver: {$driver}");
        }
    }
}