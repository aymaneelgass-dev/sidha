# SIDHA Phase 5 — AI Production Planner

Scope and design approved by the user's Phase 5 instructions. Execute inline; exactly three tasks and one independent final review. Preserve Phases 1–4. Work on `feat/sidha-phase-5-ai-production-planner`, base `97a2799`; final local commit only.

Laravel calls OpenAI Responses API through its HTTP client, with strict JSON Schema, no SDK dependency and no tools. Default configurable model: `gpt-5-mini`. Credentials live exclusively in Laravel config/environment. No real API calls during tests or QA.

One `ProductionPlan` per project, enforced by a unique foreign key. Store JSON content, provider/model/response ID, generated_at and timestamps. Content: objective, creative_concept and script strings; ordered shot_list entries with number, description, framing and notes; voice_over with required flag, nullable text and rationale; production_checklist entries with category and task. Validate bounded content before writing. Existing content survives every generation failure.

Authenticated active verified members can view; only admins can generate using the existing Project policy. Require a nonempty saved brief. Regeneration submits explicit confirmation plus the current plan timestamp; recheck under a project row lock before committing to prevent stale overwrites. A per-project cache lock prevents duplicate concurrent provider calls; throttle generation. No history, automatic retries or project mutations.

Project Detail hosts an editorial production desk: numbered sections, larger objective/concept, script typography, legible shot rows and operational checklist. Accessible loading and error states, confirmation dialog, readable mobile stacking, existing theme tokens. Demo content is fictional and explicitly labeled as demo, never OpenAI-generated.

Errors: missing config, timeout/network, provider rejection, refusal/incomplete output and malformed/invalid content produce safe user messages without raw provider output or secrets. Tests fake HTTP and prevent stray requests. Final checks: complete PHP suite once, Pint, PHPStan, TypeScript, lint/build, targeted browser QA, and one independent review.
