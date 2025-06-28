<?php
namespace App\Mcp;

use PhpMcp\Server\Attributes\McpTool;

class MyTool
{
    /**
     * Example tool method that calculates the sum of two numbers.
     *
     * @param  int  $a
     * @param  int  $b
     * @return int
     */
    #[McpTool(name: 'calculate_sum', description: 'Calculates the sum of two numbers')]
    public function calculateSum(int $a, int $b): int
    {
        return $a + $b;
    }
}
