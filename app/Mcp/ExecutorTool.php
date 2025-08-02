<?php

namespace App\Mcp;

use Illuminate\Support\Facades\DB;
use PhpMcp\Server\Attributes\McpTool;
use Psr\Log\LoggerInterface;

class ExecutorTool
{
    public function __construct(private LoggerInterface $logger)
    {
    }

    /**
     * Executes a raw SQL query and returns the result.
     *
     * @param  string  $sql The raw SQL query to execute.
     * @return array The result of the query.
     */
    #[McpTool(name: 'execute_sql', description: 'Executes a raw SQL query.')]
    public function execute(string $sql): array
    {
        try {
            // For now, we'll use the default database connection.
            // In a later phase, we'll add support for dynamic connections.
            return DB::transaction(function () use ($sql) {
                $trimmedSql = strtolower(trim($sql));
                if (str_starts_with($trimmedSql, 'select')) {
                    $this->logger->info('Executing SQL', ['sql' => $sql]);
                    return DB::select($sql);
                }

                if (str_starts_with($trimmedSql, 'insert')) {
                    $this->logger->info('Executing SQL', ['sql' => $sql]);
                    DB::insert($sql);
                    return [['success' => true]];
                }

                if (str_starts_with($trimmedSql, 'update')) {
                    $this->logger->info('Executing SQL', ['sql' => $sql]);
                    $affectedRows = DB::update($sql);
                    return [['success' => true, 'affected_rows' => $affectedRows]];
                }

                if (str_starts_with($trimmedSql, 'delete')) {
                    $this->logger->info('Executing SQL', ['sql' => $sql]);
                    $affectedRows = DB::delete($sql);
                    return [['success' => true, 'affected_rows' => $affectedRows]];
                }

                throw new \Exception('Only SELECT, INSERT, UPDATE and DELETE queries are allowed.');
            });
        } catch (\Exception $e) {
            $this->logger->error('Error executing SQL', ['error' => $e->getMessage()]);
            throw $e;
        }
    }

    /**
     * Get records that would be affected by an UPDATE or DELETE query
     *
     * @param  string  $sql The SQL query to analyze
     * @return array The records that would be affected
     */
    public function getAffectedRecords(string $sql): array
    {
        try {
            $trimmedSql = strtolower(trim($sql));
            
            if (str_starts_with($trimmedSql, 'update')) {
                // Convert UPDATE to SELECT to see what would be affected
                $selectSql = $this->convertUpdateToSelect($sql);
                return DB::select($selectSql);
            }
            
            if (str_starts_with($trimmedSql, 'delete')) {
                // Convert DELETE to SELECT to see what would be affected
                $selectSql = $this->convertDeleteToSelect($sql);
                return DB::select($selectSql);
            }
            
            return [];
        } catch (\Exception $e) {
            $this->logger->error('Error getting affected records', ['error' => $e->getMessage()]);
            throw $e;
        }
    }

    /**
     * Convert UPDATE query to SELECT to preview affected records
     */
    private function convertUpdateToSelect(string $updateSql): string
    {
        // Simple conversion: UPDATE table SET ... WHERE ... -> SELECT * FROM table WHERE ...
        $pattern = '/^update\s+(\w+)\s+set\s+(.+?)\s+where\s+(.+)$/i';
        if (preg_match($pattern, $updateSql, $matches)) {
            $table = $matches[1];
            $whereClause = $matches[3];
            return "SELECT * FROM {$table} WHERE {$whereClause}";
        }
        
        // Fallback: try to extract table and WHERE clause more generically
        $pattern = '/^update\s+(\w+)\s+set\s+(.+?)(?:\s+where\s+(.+))?$/i';
        if (preg_match($pattern, $updateSql, $matches)) {
            $table = $matches[1];
            $whereClause = isset($matches[3]) ? $matches[3] : '1=1';
            return "SELECT * FROM {$table} WHERE {$whereClause}";
        }
        
        throw new \Exception('Could not parse UPDATE query');
    }

    /**
     * Convert DELETE query to SELECT to preview affected records
     */
    private function convertDeleteToSelect(string $deleteSql): string
    {
        // Simple conversion: DELETE FROM table WHERE ... -> SELECT * FROM table WHERE ...
        $pattern = '/^delete\s+from\s+(\w+)\s+where\s+(.+)$/i';
        if (preg_match($pattern, $deleteSql, $matches)) {
            $table = $matches[1];
            $whereClause = $matches[2];
            return "SELECT * FROM {$table} WHERE {$whereClause}";
        }
        
        // Fallback: try to extract table and WHERE clause more generically
        $pattern = '/^delete\s+from\s+(\w+)(?:\s+where\s+(.+))?$/i';
        if (preg_match($pattern, $deleteSql, $matches)) {
            $table = $matches[1];
            $whereClause = isset($matches[2]) ? $matches[2] : '1=1';
            return "SELECT * FROM {$table} WHERE {$whereClause}";
        }
        
        throw new \Exception('Could not parse DELETE query');
    }
}