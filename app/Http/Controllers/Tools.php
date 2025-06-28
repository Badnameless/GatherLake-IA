<?php
use PhpMcp\Laravel\Facades\Mcp;

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
