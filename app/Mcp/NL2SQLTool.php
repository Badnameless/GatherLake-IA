<?php

namespace App\Mcp;

use App\Models\Connection;
use App\Services\SchemaService;
use OpenAI;
use PhpMcp\Server\Attributes\McpTool;
use Psr\Log\LoggerInterface;

class NL2SQLTool
{
    public function __construct(
        private LoggerInterface $logger,
        private SchemaService $schemaService
    ) {
    }

    /**
     * Converts a natural language query into a SQL query.
     *
     * @param  Connection  $connection The database connection.
     * @param  string  $query The natural language query.
     * @return string The generated SQL query.
     */
    #[McpTool(name: 'nl2sql', description: 'Converts a natural language query into a SQL query.')]
    public function generate(Connection $connection, string $query): string
    {
        try {
            $schema = $this->schemaService->getSchema($connection);
            $client = OpenAI::client(env('OPENAI_API_KEY'));

            $response = $client->chat()->create([
                'model' => 'gpt-3.5-turbo',
                'messages' => [
                    ['role' => 'system', 'content' => 'You are a helpful assistant that translates natural language into SQL queries. You can generate SELECT and INSERT statements. Only return the SQL query and nothing else. The database schema is as follows: ' . json_encode($schema)],
                    ['role' => 'user', 'content' => $query],
                ],
            ]);

            $sql = $response->choices[0]->message->content;
            if (preg_match('/```(?:sql)?\s*(.*?)\s*```/is', $sql, $matches)) {
                $sql = $matches[1];
            }
            $sql = trim($sql);
            $this->logger->info('Generated SQL', ['sql' => $sql]);

            return $sql;
        } catch (\Exception $e) {
            $this->logger->error('Error generating SQL', ['error' => $e->getMessage()]);
            throw $e;
        }
    }
}