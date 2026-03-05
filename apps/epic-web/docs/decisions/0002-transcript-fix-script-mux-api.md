---
status: implemented
date: 2026-02-20
decision-makers: cree
---

# Implement transcript/SRT fix script using Mux transcript API

## Context and Problem Statement

ADR-0001 introduced a QA validation script (`scripts/qa-validation.ts`) that audits Sanity content completeness for self-paced products. The first run against "Practical TypeScript: Foundations to Fluency" produced a report with **53 videoResource errors** — all missing one or more of `transcript.text`, `transcript.srt`, or `generatedDescription`.

Breakdown of the 53 errors:
- ~40 are missing only `generatedDescription`
- ~13 are missing all three fields (`transcript.text`, `transcript.srt`, `generatedDescription`)

These videos already have Mux assets in Sanity with valid `muxAsset.muxAssetId` and `muxAsset.muxPlaybackId`. Mux auto-generates transcripts for video assets, so the transcript data is available via the Mux API without needing to re-process through the Deepgram pipeline.

The `generatedDescription` field is currently filled manually in Sanity, but with transcript text available, an LLM can generate a 120-character SEO description automatically.

These gaps must be fixed before the workshops go live.

## Decision

Create a `sanity exec` script at `scripts/transcript-fix.ts` that:

1. **Accepts a `--report` argument** pointing to a QA report JSON file (produced by `scripts/qa-validation.ts`)
2. **Filters for `videoResource` errors** in the report, reading the `missingFields` array on each entry
3. **For each videoResource missing `transcript.text` and/or `transcript.srt`**:
   - Fetches the `muxAsset.muxAssetId` from Sanity using the videoResource `_id`
   - Calls the Mux API to retrieve the auto-generated transcript (text and SRT formats)
   - Patches the videoResource in Sanity with `transcript.text` and `transcript.srt`
4. **For each videoResource missing `generatedDescription`**:
   - Uses the transcript text (either just fetched from Mux, or already present in Sanity) to generate a 120-character SEO description via OpenAI
   - Patches the videoResource in Sanity with `generatedDescription`
5. **For each videoResource where SRT was written**:
   - Adds the SRT as an English subtitle track on the Mux asset (matching the pattern in `src/inngest/functions/tips/add-srt-to-mux-asset.ts`)
6. **Writes directly to Sanity** — no dry-run mode
7. **Prints a summary** to stdout (how many resources processed, how many transcripts fetched, how many descriptions generated, any failures)

### Processing Order

For each videoResource error:
1. Fetch `muxAssetId` from Sanity (if transcript is missing)
2. Fetch transcript from Mux API (if `transcript.text` or `transcript.srt` is missing)
3. Patch Sanity with transcript (if fetched)
4. Generate description via OpenAI (if `generatedDescription` is missing)
5. Patch Sanity with description (if generated)
6. Add SRT subtitle track to Mux asset (if SRT was fetched/written)

### Non-Goals

- Not re-querying Sanity to discover broken resources — relies entirely on the QA report as the source of truth for what needs fixing
- Not using the Deepgram pipeline — Mux already has the transcript data
- Not validating content completeness — that's ADR-0001's job; re-run `qa-validation.ts` after this script to verify
- Not a dry-run/preview mode — writes directly on execution
- Not generating descriptions for videos that have no transcript text anywhere (Mux or Sanity) — these would need manual intervention

## Consequences

- Good, because agents can run a single command to bulk-fix all missing transcripts and descriptions identified by the QA report
- Good, because it uses the Mux API directly — no third-party transcription service needed since assets already exist
- Good, because the `sanity exec` pattern matches ADR-0001 and existing conventions — no new tooling or auth setup
- Good, because SRT subtitle tracks are added to Mux assets in the same pass, keeping video accessibility in sync
- Bad, because the script requires both `MUX_TOKEN_ID` and `MUX_TOKEN_SECRET` environment variables (or Mux SDK default env vars) — these must be available in the shell environment
- Bad, because the OpenAI API key (`OPENAI_API_KEY`) must also be available for description generation
- Bad, because writes are not transactional — if the script fails mid-run, some resources will be partially updated; re-running the QA validation and then re-running this script will pick up remaining issues
- Follow-up: after validating this approach, consider integrating transcript generation into the Inngest pipeline for new videos (replacing Deepgram with Mux transcripts)
- Follow-up: consider adding a `--report latest` convenience flag that auto-detects the most recent report file in `scripts/qa-reports/`

## Implementation Plan

- **Affected paths**:
  - `scripts/transcript-fix.ts` (new) — the main fix script
- **Dependencies**:
  - `@mux/mux-node` — already installed (used in `src/inngest/functions/tips/add-srt-to-mux-asset.ts`)
  - `openai` — already installed (used in `src/inngest/events.ts` types)
  - `sanity/cli` — `getCliClient()` for Sanity reads and writes
- **Environment variables required**:
  - `MUX_TOKEN_ID` and `MUX_TOKEN_SECRET` (for Mux API access)
  - `OPENAI_API_KEY` (for description generation)
- **Patterns to follow**:
  - `scripts/qa-validation.ts` (ADR-0001) — same `sanity exec` script structure, `getCliClient()`, argument parsing from `process.argv`
  - `src/inngest/functions/tips/add-srt-to-mux-asset.ts` — Mux subtitle track creation pattern: remove existing English subtitle track, then `Video.Assets.createTrack()` with type `text`, text_type `subtitles`, language_code `en-US`, name `English`
  - `src/inngest/functions/tips/process-new-tip.ts` — Sanity patching pattern for `transcript: { text, srt }`
- **Patterns to avoid**:
  - Do NOT import from `@skillrecordings/skill-lesson/utils/sanity-client` — scripts use `getCliClient()` from `sanity/cli`
  - Do NOT write to Sanity using the Inngest event system — this is a batch script, not an event-driven workflow
  - Do NOT fetch transcripts via Deepgram — use Mux API exclusively
  - Do NOT re-query Sanity to find broken resources — read the QA report JSON

### Mux Transcript API Strategy

```typescript
import Mux from '@mux/mux-node'

const mux = new Mux()

// For each videoResource with missing transcript:
// 1. Get the asset's tracks
const asset = await mux.video.assets.retrieve(muxAssetId)

// 2. Get auto-generated transcript tracks
// Mux provides transcript text and SRT via the transcription API
// Use mux.video.assets.* methods to retrieve transcript data
```

The exact Mux SDK methods for retrieving transcript text and SRT should be confirmed against the `@mux/mux-node` package version installed in the project. The Mux API provides transcripts in both plain text and SRT format for assets with auto-generated captions.

### OpenAI Description Generation Strategy

```typescript
import OpenAI from 'openai'

const openai = new OpenAI()

const completion = await openai.chat.completions.create({
  model: 'gpt-4o-mini',
  messages: [
    {
      role: 'system',
      content: 'Generate a concise SEO description for a programming tutorial video. Output ONLY the description text, no quotes, no prefix. Maximum 120 characters.',
    },
    {
      role: 'user',
      content: `Video title: "${videoTitle}"\n\nTranscript:\n${transcriptText.slice(0, 2000)}`,
    },
  ],
  max_tokens: 60,
})

const description = completion.choices[0].message.content?.trim()
```

### Sanity Patching Strategy

```typescript
// Patch transcript
await client
  .patch(videoResourceId)
  .set({
    'transcript.text': transcriptText,
    'transcript.srt': srtContent,
  })
  .commit()

// Patch description
await client
  .patch(videoResourceId)
  .set({
    generatedDescription: description,
  })
  .commit()
```

### Mux Subtitle Track Strategy

Following the pattern from `src/inngest/functions/tips/add-srt-to-mux-asset.ts`:

```typescript
// Remove existing English subtitle track if present
const { tracks } = await mux.video.assets.retrieve(muxAssetId)
const existingSubtitle = tracks?.find((track) => track.name === 'English')
if (existingSubtitle) {
  await mux.video.assets.deleteTrack(muxAssetId, existingSubtitle.id)
}

// Add new SRT subtitle track
// The SRT is served via the existing API route
await mux.video.assets.createTrack(muxAssetId, {
  url: `https://www.epicweb.dev/api/videoResource/${videoResourceId}/srt`,
  type: 'text',
  text_type: 'subtitles',
  closed_captions: false,
  language_code: 'en-US',
  name: 'English',
  passthrough: 'English',
})
```

### Agent Usage

```bash
# Run the fix script against a QA report
sanity exec --with-user-token scripts/transcript-fix.ts -- --report scripts/qa-reports/practical-typescript-foundations-to-fluency-20260219-145432.json
```

After running, verify with:
```bash
sanity exec --with-user-token scripts/qa-validation.ts -- --product "Practical TypeScript: Foundations to Fluency"
```

### Verification

- [ ] `sanity exec --with-user-token scripts/transcript-fix.ts -- --report <path-to-report.json>` runs without crashing
- [ ] Script reads the QA report and correctly identifies videoResource errors
- [ ] For videoResources missing `transcript.text`/`transcript.srt`: transcript is fetched from Mux and written to Sanity
- [ ] For videoResources missing `generatedDescription`: a 120-character SEO description is generated via OpenAI and written to Sanity
- [ ] SRT subtitle tracks are added to Mux assets for each videoResource where SRT was fetched
- [ ] Script prints a summary (processed count, transcripts fetched, descriptions generated, failures)
- [ ] Re-running `qa-validation.ts` after the fix script shows reduced or zero videoResource errors
- [ ] Script exits with a non-zero code if the `--report` argument is missing or the file doesn't exist
- [ ] Script handles Mux API errors gracefully (logs the error, continues to next resource)

## Alternatives Considered

- **Re-trigger the Deepgram pipeline via Inngest events**: Rejected because the videos already have Mux assets with auto-generated transcripts available. Going through Deepgram would add unnecessary latency, cost, and a dependency on the `deepgram-wrangler.skillstack.workers.dev` Cloudflare Worker. The Mux API provides the same data directly.
- **Standalone Node.js script (not `sanity exec`)**: Rejected for the same reasons as in ADR-0001 — `sanity exec` provides Sanity client auth out of the box via `getCliClient()`, matching existing conventions and avoiding separate auth setup.
- **Query Sanity fresh instead of reading QA report**: Rejected because the QA validation script already does the work of identifying broken resources. Reading from the report avoids duplicating that logic and keeps a clear separation: ADR-0001 identifies problems, ADR-0002 fixes them.

## More Information

- Depends on: [ADR-0001 — Implement Sanity QA validation script](0001-sanity-qa-validation-script.md) (produces the QA reports this script consumes)
- Existing Mux SDK usage: `src/inngest/functions/tips/add-srt-to-mux-asset.ts`
- Existing transcript processing: `src/inngest/functions/tips/process-new-tip.ts`
- Sanity video resource schema: `schemas/documents/videoResource.tsx`
- Mux asset schema: `schemas/objects/muxAsset.ts`
- Transcript schema: `schemas/objects/transcript.tsx`
- SRT API route: `src/pages/api/videoResource/[id]/srt.ts`
- Sanity project: `i1a93n76`, dataset: `production`
