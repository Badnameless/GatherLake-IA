<?php

use App\Models\Connection;
use App\Models\User;
use App\Mcp\NL2SQLTool;
use App\Mcp\ExecutorTool;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('can store a query and return a result', function () {
    // Create a user and a connection
    $user = User::factory()->create();
    $connection = Connection::factory()->create(['user_id' => $user->id]);

    // Mock the tools
    $nl2sqlMock = $this->mock(NL2SQLTool::class);
    $nl2sqlMock->shouldReceive('generate')->andReturn('SELECT * FROM users;');
    $executorMock = $this->mock(ExecutorTool::class);
    $executorMock->shouldReceive('execute')->andReturn([['name' => 'John Doe']]);

    // Make the request
    $response = $this->actingAs($user)->post(route('nl2sql.store'), [
        'query' => 'get all users',
        'connection_id' => $connection->id,
    ]);

    // Assert that the response is correct
    $response->assertRedirect();
    $response->assertSessionHas('result', [['name' => 'John Doe']]);
});
