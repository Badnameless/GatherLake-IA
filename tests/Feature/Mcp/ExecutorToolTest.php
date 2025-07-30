<?php

use App\Mcp\ExecutorTool;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;

uses(RefreshDatabase::class);

test('can execute sql query', function () {
    // Create a user
    \App\Models\User::factory()->create(['name' => 'John Doe']);

    // Create the tool
    $tool = new ExecutorTool(new \Illuminate\Log\Logger(new \Monolog\Logger('test')));

    // Execute the SQL
    $result = $tool->execute('SELECT * FROM users;');

    // Assert that the result is correct
    expect($result)->toHaveCount(1);
    expect($result[0]->name)->toBe('John Doe');
});
