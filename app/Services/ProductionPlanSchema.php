<?php

namespace App\Services;

use Illuminate\Validation\ValidationException;

class ProductionPlanSchema
{
    /** @return array<string, mixed> */
    public function schema(): array
    {
        $string = ['type' => 'string'];

        return $this->object([
            'objective' => $string,
            'creative_concept' => $string,
            'script' => $string,
            'shot_list' => ['type' => 'array', 'items' => $this->object([
                'number' => ['type' => 'integer'], 'description' => $string, 'framing' => $string, 'notes' => $string,
            ])],
            'voice_over' => $this->object(['required' => ['type' => 'boolean'], 'text' => ['type' => ['string', 'null']], 'notes' => $string]),
            'production_checklist' => ['type' => 'array', 'items' => $this->object(['category' => $string, 'task' => $string])],
        ]);
    }

    /** @param array<string, mixed> $properties
     * @return array<string, mixed>
     */
    private function object(array $properties): array
    {
        return ['type' => 'object', 'properties' => $properties, 'required' => array_keys($properties), 'additionalProperties' => false];
    }

    /** Validate locally even when the provider promises strict output.
     * @return array<string, mixed>
     */
    public function validate(mixed $content): array
    {
        if (! $this->matches($content, $this->schema())) {
            $this->invalid();
        }
        /** @var array<string, mixed> $content */
        /** @var array{required: bool, text: string|null, notes: string} $voice */
        $voice = $content['voice_over'];
        if (($voice['required'] && $voice['text'] === null) || (! $voice['required'] && $voice['text'] !== null)) {
            $this->invalid();
        }
        /** @var list<array{number: int}> $shots */
        $shots = $content['shot_list'];
        foreach ($shots as $index => $shot) {
            if ($shot['number'] !== $index + 1) {
                $this->invalid();
            }
        }

        return $content;
    }

    /** @param array<string, mixed> $schema */
    private function matches(mixed $value, array $schema): bool
    {
        if (is_array($schema['type'])) {
            return $value === null || (is_string($value) && trim($value) !== '' && mb_strlen($value) <= 12000);
        }
        switch ($schema['type']) {
            case 'string':
                return is_string($value) && trim($value) !== '' && mb_strlen($value) <= 12000;
            case 'integer':
                return is_int($value) && $value >= 1 && $value <= 40;
            case 'boolean':
                return is_bool($value);
            case 'array':
                if (! is_array($value) || ! array_is_list($value) || count($value) < 1 || count($value) > 40) {
                    return false;
                }
                foreach ($value as $item) {
                    if (! $this->matches($item, $schema['items'])) {
                        return false;
                    }
                }

                return true;
            case 'object':
                if (! is_array($value) || array_is_list($value) || count($value) !== count($schema['properties'])) {
                    return false;
                }
                foreach ($schema['properties'] as $key => $property) {
                    if (! array_key_exists($key, $value) || ! $this->matches($value[$key], $property)) {
                        return false;
                    }
                }

                return true;
        }

        return false;
    }

    private function invalid(): never
    {
        throw ValidationException::withMessages(['production_plan' => 'The AI response was not a valid production plan. Please try again. Your saved plan is unchanged.']);
    }
}
