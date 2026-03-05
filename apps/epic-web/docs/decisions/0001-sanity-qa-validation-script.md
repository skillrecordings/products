---
status: implemented
date: 2026-02-19
decision-makers: cree
---

# Implement Sanity QA validation script for agent-driven content audits

## Context and Problem Statement

New workshop modules have been added to the "Practical TypeScript: Foundations to Fluency" self-paced product in Sanity CMS. Before these workshops go live, a structured QA pass is needed to verify content completeness across the full hierarchy: product → modules → sections → lessons/exercises → solutions → video resources.

This validation needs to be **agent-executable** — an AI agent should be able to run a single command, read the structured JSON output, and know exactly which resources are invalid and what's wrong with each one, including all identifiers needed to locate and fix the issue in Sanity.

The Sanity data model for this product is:

```
product (type: "self-paced")
  └── modules[] (ref → module documents, moduleType: "workshop")
        └── resources[] (ref → section documents)
              └── resources[] (ref → exercise | lesson | explainer documents)
                    ├── resources[] → videoResource (ref)
                    └── resources[] → solution (inline object, exercise-only)
                          └── resources[] → videoResource (ref)
```

Key fields on `videoResource` that must be validated:
- `transcript.text` — the modern transcript text
- `transcript.srt` — SRT subtitle content
- `generatedDescription` — AI-generated description (exists in Sanity dataset but not in code schema)

## Decision

Create a `sanity exec` script at `scripts/qa-validation.ts` that:

1. **Accepts a `--product` argument** with the product title to validate
2. **Queries Sanity via GROQ** to fetch the full content tree for that product (product → modules → sections → lessons/exercises with solutions → video resources)
3. **Validates** each level of the hierarchy against these rules:
   - **Module**: must have at least one section with resources
   - **Section**: must have at least one lesson, exercise, or explainer resource
   - **Lesson / Explainer**: must have a videoResource reference in its `resources[]`
   - **Exercise**: must have a videoResource reference AND a solution in its `resources[]`
   - **Solution**: must have a videoResource reference in its `resources[]`
   - **VideoResource**: must have non-empty `transcript.text`, `transcript.srt`, and `generatedDescription`
4. **Outputs a JSON report** to `scripts/qa-reports/<product-slug>-<timestamp>.json` containing all invalid resources with actionable identifiers
5. **Prints a summary** to stdout (total errors, breakdown by type)

### JSON Report Structure

```json
{
  "product": {
    "_id": "abc123",
    "title": "Practical TypeScript: Foundations to Fluency",
    "slug": "practical-typescript-foundations-to-fluency"
  },
  "timestamp": "2026-02-19T12:00:00Z",
  "summary": {
    "totalErrors": 5,
    "byType": {
      "module": 0,
      "section": 1,
      "lesson": 1,
      "exercise": 1,
      "solution": 1,
      "videoResource": 1
    }
  },
  "errors": [
    {
      "_id": "section-abc",
      "_type": "section",
      "title": "Some Section",
      "slug": "some-section",
      "parentModule": {
        "_id": "module-xyz",
        "title": "Module Title",
        "slug": "module-slug"
      },
      "error": "Section has no lesson, exercise, or explainer resources"
    },
    {
      "_id": "exercise-def",
      "_type": "exercise",
      "title": "Some Exercise",
      "slug": "some-exercise",
      "parentSection": {
        "_id": "section-abc",
        "title": "Section Title",
        "slug": "section-slug"
      },
      "parentModule": {
        "_id": "module-xyz",
        "title": "Module Title",
        "slug": "module-slug"
      },
      "error": "Exercise is missing a solution resource"
    },
    {
      "_id": "video-ghi",
      "_type": "videoResource",
      "title": "Video Title",
      "parentResource": {
        "_id": "lesson-jkl",
        "_type": "lesson",
        "title": "Lesson Title",
        "slug": "lesson-slug"
      },
      "parentSection": {
        "_id": "section-abc",
        "title": "Section Title",
        "slug": "section-slug"
      },
      "parentModule": {
        "_id": "module-xyz",
        "title": "Module Title",
        "slug": "module-slug"
      },
      "missingFields": ["transcript.text", "generatedDescription"],
      "error": "VideoResource is missing: transcript.text, generatedDescription"
    }
  ]
}
```

### Agent Usage

```bash
sanity exec --with-user-token scripts/qa-validation.ts -- --product "Practical TypeScript: Foundations to Fluency"
```

An agent reads the output JSON, iterates over `errors[]`, and uses the `_id`, `_type`, parent context, and `error` message to determine what corrective action to take in Sanity.

### Non-Goals

- Not a Sanity Studio plugin or UI component
- Not an API route in the Next.js app
- Not validating legacy `castingwords` transcript fields — only modern `transcript.text` and `transcript.srt`
- Not auto-fixing issues — the script reports only; agents or humans decide how to fix

## Consequences

- Good, because agents can run a single bash command and get a complete, machine-readable audit of any self-paced product's content
- Good, because the JSON report includes full parent context (module → section → resource), so an agent knows exactly where each broken resource lives in the hierarchy
- Good, because the `sanity exec` pattern matches existing conventions (`migrations/pt-to-md.ts`) — no new tooling or auth setup needed
- Bad, because `generatedDescription` is not in the code schema — the GROQ query must fetch it as a raw field, and if the field name changes in Sanity we won't catch it at compile time
- Follow-up: once the script is validated, consider adding more subcommands (e.g., validate a single module by slug, validate all active products)

## Implementation Plan

- **Affected paths**:
  - `scripts/qa-validation.ts` (new) — the main validation script
  - `scripts/qa-reports/` (new, gitignored) — output directory for JSON reports
  - `.gitignore` — add `scripts/qa-reports/` entry
- **Dependencies**: None new — uses `getCliClient` from `sanity/cli` (already available), `groq` (already installed), and Node.js built-ins (`fs`, `path`)
- **Patterns to follow**:
  - `migrations/pt-to-md.ts` — use `getCliClient()` from `sanity/cli`, same script structure
  - `src/lib/products.ts` / `src/lib/tutorials.ts` — existing GROQ query patterns for products, modules, sections, exercises
  - Parse `--product` from `process.argv` (Sanity exec passes args after `--`)
- **Patterns to avoid**:
  - Do NOT import from `@skillrecordings/skill-lesson/utils/sanity-client` — that's for the Next.js app; scripts use `getCliClient()`
  - Do NOT query the course-builder MySQL database — this is Sanity-only validation
  - Do NOT write to Sanity — this script is read-only

### GROQ Query Strategy

Use a single deep GROQ query to fetch the full content tree in one request:

```groq
*[_type == "product" && title == $productTitle][0] {
  _id,
  title,
  "slug": slug.current,
  type,
  modules[]-> {
    _id,
    title,
    "slug": slug.current,
    moduleType,
    "sections": resources[@->._type == 'section']-> {
      _id,
      title,
      "slug": slug.current,
      "lessons": resources[@->._type in ['lesson', 'explainer']]-> {
        _id,
        _type,
        title,
        "slug": slug.current,
        "videoResource": resources[@->._type == 'videoResource'][0]-> {
          _id,
          title,
          "transcript": transcript { text, srt },
          generatedDescription
        }
      },
      "exercises": resources[@->._type == 'exercise']-> {
        _id,
        _type,
        title,
        "slug": slug.current,
        "videoResource": resources[@->._type == 'videoResource'][0]-> {
          _id,
          title,
          "transcript": transcript { text, srt },
          generatedDescription
        },
        "solution": resources[@._type == 'solution'][0] {
          _key,
          _type,
          title,
          "slug": slug.current,
          "videoResource": resources[@->._type == 'videoResource'][0]-> {
            _id,
            title,
            "transcript": transcript { text, srt },
            generatedDescription
          }
        }
      }
    }
  }
}
```

### Validation Logic (Pseudocode)

```
for each module in product.modules:
  if module has no sections → error
  for each section in module.sections:
    if section has no lessons AND no exercises → error
    for each lesson in section.lessons:
      if lesson has no videoResource → error
      else validate videoResource fields
    for each exercise in section.exercises:
      if exercise has no videoResource → error
      else validate videoResource fields
      if exercise has no solution → error
      else:
        if solution has no videoResource → error
        else validate videoResource fields

validate videoResource:
  check transcript.text is non-empty string
  check transcript.srt is non-empty string
  check generatedDescription is non-empty string
  report each missing field individually
```

### Verification

- [ ] `sanity exec --with-user-token scripts/qa-validation.ts -- --product "Practical TypeScript: Foundations to Fluency"` runs without errors
- [ ] Script produces a JSON file at `scripts/qa-reports/<product-slug>-<timestamp>.json`
- [ ] JSON structure matches the schema defined above (product metadata, summary, errors array)
- [ ] Each error entry includes `_id`, `_type`, `title`, `slug`, parent context (`parentModule`, `parentSection`), and descriptive `error` string
- [ ] VideoResource errors include a `missingFields` array listing exactly which fields are invalid
- [ ] Script prints a summary to stdout (total errors + breakdown by type)
- [ ] Running the script with a non-existent product title prints a clear error message and exits with non-zero code
- [ ] `scripts/qa-reports/` is gitignored

## Alternatives Considered

- **Standalone CLI wrapper (commander/yargs)**: Rejected because it requires separate auth setup and doesn't leverage the existing Sanity CLI context. More complexity for no immediate benefit. Can revisit if we need multiple QA subcommands later.
- **GROQ-only (run in Sanity Vision manually)**: Rejected because it's not agent-executable — an agent can't run Vision queries and parse the results programmatically.
- **API route in Next.js**: Rejected because QA validation is a dev/CI concern, not a runtime feature. Adding it as an API route would expose it unnecessarily and couple it to the app's deployment lifecycle.

## More Information

- Existing `sanity exec` pattern: `migrations/pt-to-md.ts`
- Sanity project: `i1a93n76`, dataset: `production`
- Sanity CLI config: `sanity.cli.ts`
- Relevant schemas: `schemas/documents/product.tsx`, `schemas/documents/module.tsx`, `schemas/documents/section.tsx`, `schemas/documents/exercise.tsx`, `schemas/documents/lesson.tsx`, `schemas/documents/explainer.tsx`, `schemas/documents/videoResource.tsx`, `schemas/objects/resources/solution.ts`
- The `generatedDescription` field on `videoResource` exists in the Sanity dataset but is not defined in the code schema — query it as a raw field in GROQ
