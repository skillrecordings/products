# Run flat-layout workshop migration

Single-line command — copy the entire line in the fenced block below and paste into your terminal at `apps/epic-web/`.

## Pre-flight

- `cd apps/epic-web`
- `.env.local` has `DROPBOX_ACCESS_TOKEN`, `MUX_TOKEN_ID`, `MUX_TOKEN_SECRET`, `SANITY_API_TOKEN` (and team vars if applicable).
- Inngest dev server running locally (in another terminal): `npx inngest-cli@latest dev`

## Command

```
pnpm tsx src/scripts/trigger-flat-workshop-migration.ts --workshop-id a53acaa6-bab9-4772-bdb3-897de5c6626b --dropbox-url "https://www.dropbox.com/scl/fo/ui8kukf4yp42x9l228iyh/ANHi4-FCuPoGiRFUOrmCThs?rlkey=6io2uct8429w6a35lws2jhj3z&st=ghjp7nw9&dl=1"
```

## Watch progress

http://localhost:8288 → look for the `workshop-flat-migration` function run.

## Optional flags

| Flag | What |
| --- | --- |
| `--workshop-name "Foo"` | Used in synthetic intro/outro lesson titles |
| `--code-prefix "/foo"` | Adds `workshopApp` resources with `path: <prefix>/<slug>` to lessons/exercises |

## What this does (high level)

1. Resolves the Dropbox shared-folder URL → namespace path (`sharingGetSharedLinkMetadata`).
2. Lists every video file (paginated).
3. Parses filenames into intro / sections / outro per the flat naming grammar.
4. Creates a per-file Dropbox shared link (`?dl=1`) for each video.
5. For each item, **creates a Sanity `videoResource`** with `state: 'new'` and `originalMediaUrl` set to the Dropbox link, then creates the lesson/exercise/section docs and links them.

That's it. The Sanity webhook on `videoResource/created` triggers the existing Inngest pipeline that uploads to Mux and orders Deepgram transcription. This script does **not** touch Mux directly.
