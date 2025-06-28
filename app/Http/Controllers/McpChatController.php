<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use OpenAI;
use PhpMcp\Laravel\Facades\Mcp;

class McpChatController extends Controller
{
    public function chat(Request $request)
    {
        $userMessage = $request->input('message');

        // Step 1: Build tools list from MCP
        $tools = collect(Mcp::registeredTools())->map(function ($tool) {
            return [
                'type' => 'function',
                'function' => [
                    'name' => $tool->name,
                    'description' => $tool->description,
                    'parameters' => $tool->parameters,
                ],
            ];
        })->values()->all();

        // Step 2: Initial user prompt
        $response = OpenAI::client(env('MCP_OPENAI_KEY'))->chat()->create([
            'model' => 'gpt-4o',
            'messages' => [
                ['role' => 'user', 'content' => $userMessage],
            ],
            'tools' => $tools,
            'tool_choice' => 'auto',
        ]);

        // Step 3: See if tool was called
        $toolCall = $response['choices'][0]['message']['tool_calls'][0] ?? null;

        if (!$toolCall) {
            // No tool used, return model's direct answer
            return response()->json([
                'response' => $response['choices'][0]['message']['content'],
            ]);
        }

        // Step 4: Run tool
        $functionName = $toolCall['function']['name'];
        $args = json_decode($toolCall['function']['arguments'], true);

        $toolResult = Mcp::callTool($functionName, $args);

        // Step 5: Respond with tool output
        $secondResponse = OpenAI::client(env('MCP_OPENAI_KEY'))->chat()->create([
            'model' => 'gpt-4o',
            'messages' => [
                ['role' => 'user', 'content' => $userMessage],
                [
                    'role' => 'tool',
                    'tool_call_id' => $toolCall['id'],
                    'name' => $functionName,
                    'content' => json_encode($toolResult),
                ],
            ],
        ]);

        return response()->json([
            'tool' => $functionName,
            'arguments' => $args,
            'result' => $toolResult,
            'response' => $secondResponse['choices'][0]['message']['content'],
        ]);
    }
}
