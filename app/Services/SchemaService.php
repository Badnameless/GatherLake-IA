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

        // Get the tables
        $tables = DB::connection('dynamic_connection')->select("SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname != 'pg_catalog' AND schemaname != 'information_schema'");

        $schema = [];
        foreach ($tables as $table) {
            $tableName = $table->tablename;
            $columns = DB::connection('dynamic_connection')->select("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = '{$tableName}'");
            $schema[$tableName] = $columns;
        }

        return $schema;
    }
}