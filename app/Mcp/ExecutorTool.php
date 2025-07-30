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

                throw new \Exception('Only SELECT and INSERT queries are allowed.');
            });
        } catch (\Exception $e) {
            $this->logger->error('Error executing SQL', ['error' => $e->getMessage()]);
            throw $e;
        }
    }
}