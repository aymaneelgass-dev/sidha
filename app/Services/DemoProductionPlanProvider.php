<?php

namespace App\Services;

use App\Models\Project;

class DemoProductionPlanProvider
{
    public function __construct(private ProductionPlanSchema $schema) {}

    /** @return array{content: array<string, mixed>, model: string, response_id: null} */
    public function generate(Project $project): array
    {
        $project->loadMissing('client');
        $name = $project->name;
        $client = $project->client->name;
        $type = $project->type->value;
        $brief = mb_strimwidth(trim($project->brief), 0, 3000, '…');
        $direction = match ($type) {
            'music-video' => 'Build the edit around performance, rhythm and a simple visual progression.',
            'advertisement' => 'Lead with the audience need, make the message clear, and close on a client-approved call to action.',
            'social-media' => 'Open with a strong visual hook and plan framing and pacing for the intended platform once confirmed.',
            default => 'Tell a focused brand story through people, process and a clear closing image.',
        };

        $content = [
            'objective' => "Develop a practical {$type} production treatment for {$name}, commissioned by {$client}, subject to client approval.",
            'creative_concept' => "Proposed direction: {$direction} Ground the visuals in the project brief: {$brief} Confirm all claims, locations and contributors with {$client} before production.",
            'script' => "OPEN — Introduce {$name} with a relevant visual drawn from the brief; capture clean location sound.\nDEVELOP — Show the central action or message through a sequence of specific details and a wider context.\nCLOSE — Resolve the idea with an approved {$client} end frame. Confirm wording, duration and assets with the client.",
            'shot_list' => [
                ['number' => 1, 'description' => "Opening detail that introduces {$name}.", 'framing' => 'Close-up', 'notes' => 'Choose a brief-relevant subject with the client; record clean natural sound.'],
                ['number' => 2, 'description' => 'Establish the proposed setting and central subject.', 'framing' => 'Wide shot', 'notes' => 'Confirm location access, light and contributor permissions.'],
                ['number' => 3, 'description' => 'Capture the key action or message in progress.', 'framing' => 'Medium shot', 'notes' => 'Plan coverage and continuity around the approved brief.'],
                ['number' => 4, 'description' => 'Show a tangible detail that supports the story.', 'framing' => 'Close-up / insert', 'notes' => 'Avoid unverified product or brand claims.'],
                ['number' => 5, 'description' => "Finish on an approved {$client} closing image.", 'framing' => 'Static closing frame', 'notes' => 'Confirm final wording, brand assets and any call to action.'],
            ],
            'voice_over' => ['required' => false, 'text' => null, 'notes' => 'Use natural sound as the proposed baseline; confirm whether narration is needed during client review.'],
            'production_checklist' => [
                ['category' => 'Client validation', 'task' => "Review the treatment, key message and closing frame with {$client}."],
                ['category' => 'Creative', 'task' => 'Confirm the intended audience, format and duration from the brief.'],
                ['category' => 'Location', 'task' => 'Scout and confirm access, light, power and recording conditions.'],
                ['category' => 'Permissions', 'task' => 'Secure location, talent and asset permissions where applicable.'],
                ['category' => 'Production', 'task' => 'Prepare a shot schedule, camera coverage and continuity notes.'],
                ['category' => 'Audio', 'task' => 'Plan natural sound recording and clear any proposed music.'],
            ],
        ];

        return ['content' => $this->schema->validate($content), 'model' => 'demo', 'response_id' => null];
    }
}
