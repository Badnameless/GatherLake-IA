<?php

use App\Http\Controllers\McpChatController;

Route::post('/mcp-chat', [McpChatController::class, 'chat']);
