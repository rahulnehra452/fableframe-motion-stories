# Fableframe

An editorial creator studio with a real deterministic Canvas illustration engine and three downloadable, rendered 9:16 sample films.

## Actual implementation status

**This is not yet the complete AI production pipeline in the uploaded brief.** Lovable Cloud activation was declined. No external service connections were supplied. Live prompt generation, narration, accounts, persistent jobs, credits, payments, production queues, and generated-code execution are deliberately disabled. The Generate action explains the missing setup and does not submit, charge, or simulate progress.

Implemented: procedural rabbit, fox, and bear animation; seeded grain and pencil hatching; expressive anatomy; secondary motion; an actual streaming Chromium→FFmpeg renderer; H.264/AAC MP4 output; sample downloads and playback; creator settings; examples; honest guest history/account states; draft legal pages; storyboard, timing, and AST validators; version-controlled internal prompts.

The hosted app retains **TanStack Start / React / Tailwind**, not Next.js, because Lovable fixes the application framework. Native video encoding lives outside the edge web runtime.

## Run the web app locally

Requires Bun and a current Node.js runtime.

```sh
bun install
bun run dev --port 8080
```

The Lovable preview starts the dev server automatically; do not start a second one there.

## Render real samples locally

Requires Python 3, Playwright with Chromium, FFmpeg with libx264, and FFprobe. Outside Lovable, install the Python requirements and Chromium first:

```sh
python3 -m pip install -r workers/render/requirements.txt
python3 -m playwright install --with-deps chromium
python3 workers/render/render_samples.py --origin http://localhost:8080 --output /tmp/fableframe-renders
```

The dev server must be running. This command streams 450 JPEG frames per film directly to FFmpeg (no persistent frame sequence), adds an original synthesized ambient motif, encodes 1080×1920 at 30fps with H.264, yuv420p, AAC and faststart, and verifies all outputs with FFprobe. It writes MP4s, metadata, and three diagnostic PNG frames per story. Narration and captions are **not** included in sample exports. Lower-resolution preview rendering:

```sh
python3 workers/render/render_samples.py --width 360 --height 640 --stories moon --output /tmp/fableframe-preview
```

Optional container workflow, with the dev server already running on the host:

```sh
docker build -f workers/render/Dockerfile -t fableframe-samples .
docker run --rm --add-host=host.docker.internal:host-gateway -v "$PWD/local-renders:/output" fableframe-samples --origin http://host.docker.internal:8080 --output /output
```

This container renders trusted samples only. It is **not** a secure sandbox for generated code.

## Tests actually run

```sh
bunx vitest run src/test/reel-rules.test.ts src/test/app-routing.test.tsx
```

21 tests passed: allowed durations, timeline coverage, scene count, narration fit, required render interface, prohibited JavaScript constructs, deterministic noise, easing, and home-route matching. All three full-size 15-second MP4s passed the renderer's FFprobe assertions. Browser QA exercised prompt suggestions, duration/voice settings, toggles, seeking, pause, honest unavailable-generation state, navigation, and 390px mobile layout. The browser sample checks also verify repeated frames, nonempty artwork, motion, playback metadata, and MP4 download.

## Security boundary

The studio executes only trusted version-controlled drawing code. Acorn parses model source without executing it. AST validation is defense in depth and does not guarantee safety: bounded recursion, computed-code escape attempts, and resource exhaustion still require an OS isolation boundary. The sample renderer must never be handed arbitrary generated JavaScript. No generated-code execution or repair endpoint is exposed.

## Remaining setup and implementation

1. Enable Lovable Cloud and confirm whether user profiles are needed before writing authentication. Apply real tables and least-privilege grants/RLS for profiles, jobs, artifacts, immutable credit transactions, attempts, and audit events. No database schema has been created.
2. Connect a Gemini API credential securely; verify `gemini-4-hydrogen` against the account's models list. Use the official GenAI SDK outside restricted gateway contexts, or an approved connector transport. No model availability or live AI call was verified.
3. Connect ElevenLabs. Implement timestamp-aligned narration and probe measured audio before finalizing scene timings. No speech was generated.
4. Deploy a separately isolated, network-blocked renderer with no secrets, CPU/memory/time ceilings and a low-privilege identity. Keep artifact upload/orchestration outside that sandbox. This is mandatory before generated source can run.
5. Configure Google Cloud resources through an approved least-privilege connection: Cloud Tasks dispatch, Cloud Run Jobs rendering, private GCS artifacts and signed downloads. No cloud resources were provisioned or deployment verified.
6. Implement atomic credit reservation, immutable charging/refunds, idempotent jobs, daily/spending limits, moderation, transient retries, two targeted repairs plus one simplified regeneration, cancellation and recovery. Rules are documented and partially validated but no durable credit mechanism exists.
7. Connect payment credentials and choose configurable prices before Stripe Checkout and verified webhooks are implemented. Billing is inactive, not mocked.
8. Finish per-job usage/cost accounting and obtain legal review. The $0.20 target is not a measured achievement.

`.env.example` lists future configuration **names only** for planning. It does not activate nonexistent services. Provider keys must be stored through secure connections, never committed.
