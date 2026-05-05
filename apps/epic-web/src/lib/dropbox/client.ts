/**
 * Reusable Dropbox SDK client + small helpers for the flat-layout migration
 * pipeline. Mirrors the option-building logic in
 * `src/scripts/generate-workshop-json-from-dropbox.ts:64-87` so that the
 * Inngest function (worker T3) and any one-off scripts share the same
 * environment-variable contract:
 *
 *   DROPBOX_ACCESS_TOKEN         (required)
 *   DROPBOX_TEAM_MEMBER_ID       (optional — selects a team member)
 *   DROPBOX_TEAM_NAMESPACE_ID    (optional — sets the path root namespace)
 *
 * Note: the original `getSharedLink` in the script returned a sentinel
 * string `DROPBOX_LINK_ERROR:<path>` on failure. Per spec we throw instead
 * so callers can't silently propagate that sentinel as a real URL.
 */

import {Dropbox, type files} from 'dropbox'

import {type FlatEntry} from './flat-layout'

export type DropboxClient = Dropbox

const VIDEO_EXT_RE = /\.(mp4|mov|webm|mkv)$/i

export function getDropboxClient(opts?: {
  accessToken?: string
  teamMemberId?: string
  teamNamespaceId?: string
}): DropboxClient {
  const accessToken = opts?.accessToken ?? process.env.DROPBOX_ACCESS_TOKEN
  if (!accessToken) {
    throw new Error(
      'DROPBOX_ACCESS_TOKEN is required (pass opts.accessToken or set the env var)',
    )
  }

  const teamMemberId = opts?.teamMemberId ?? process.env.DROPBOX_TEAM_MEMBER_ID
  const teamNamespaceId =
    opts?.teamNamespaceId ?? process.env.DROPBOX_TEAM_NAMESPACE_ID

  const options: {
    accessToken: string
    selectUser?: string
    pathRoot?: string
  } = {accessToken}

  if (teamMemberId) {
    options.selectUser = teamMemberId
  }

  if (teamNamespaceId) {
    options.pathRoot = JSON.stringify({
      '.tag': 'namespace_id',
      namespace_id: teamNamespaceId,
    })
  }

  return new Dropbox(options)
}

/**
 * List every file in `folderPath`, paginating via `filesListFolderContinue`
 * while `has_more`. Filters to files only with allowed video extensions.
 *
 * `url` is intentionally left undefined here — populate it later with
 * `getOrCreateSharedLink`.
 */
export async function listAllFilesFlat(
  dbx: DropboxClient,
  folderPath: string,
): Promise<FlatEntry[]> {
  const out: FlatEntry[] = []

  const pushEntries = (entries: Array<files.MetadataReference>) => {
    for (const entry of entries) {
      if (entry['.tag'] !== 'file') continue
      if (!VIDEO_EXT_RE.test(entry.name)) continue
      const fileEntry = entry as files.FileMetadataReference
      out.push({
        name: fileEntry.name,
        path: fileEntry.path_lower ?? fileEntry.path_display ?? '',
      })
    }
  }

  const first = await dbx.filesListFolder({path: folderPath})
  pushEntries(first.result.entries)

  let cursor = first.result.cursor
  let hasMore = first.result.has_more

  while (hasMore) {
    const next = await dbx.filesListFolderContinue({cursor})
    pushEntries(next.result.entries)
    cursor = next.result.cursor
    hasMore = next.result.has_more
  }

  return out
}

function toDirectDownloadUrl(sharedUrl: string): string {
  // Dropbox shared links default to ?dl=0 (preview); Mux + similar tools
  // need ?dl=1 for direct download. Use URL to handle both forms safely.
  const url = new URL(sharedUrl)
  url.searchParams.set('dl', '1')
  return url.toString()
}

/**
 * List every video file inside a Dropbox *shared folder URL* (the
 * `https://www.dropbox.com/scl/fo/...?rlkey=...` form), without requiring the
 * folder to be mounted at a known path in the caller's namespace.
 *
 * Uses `filesListFolder({ path: '', shared_link: { url } })`. Returned
 * entries have paths RELATIVE to the shared folder root (e.g.
 * `/01-00-intro.mp4`); they're used both as the parser's stable key AND
 * as the relative-path component for `buildSharedFolderFileUrl`.
 */
export async function listAllFilesFromSharedLink(
  dbx: DropboxClient,
  sharedUrl: string,
): Promise<FlatEntry[]> {
  const out: FlatEntry[] = []

  const pushEntries = (entries: Array<files.MetadataReference>) => {
    for (const entry of entries) {
      if (entry['.tag'] !== 'file') continue
      if (!VIDEO_EXT_RE.test(entry.name)) continue
      const fileEntry = entry as files.FileMetadataReference
      out.push({
        name: fileEntry.name,
        path:
          fileEntry.path_display ??
          fileEntry.path_lower ??
          `/${fileEntry.name}`,
      })
    }
  }

  const first = await dbx.filesListFolder({
    path: '',
    shared_link: {url: sharedUrl},
  })
  pushEntries(first.result.entries)

  let cursor = first.result.cursor
  let hasMore = first.result.has_more

  while (hasMore) {
    const next = await dbx.filesListFolderContinue({cursor})
    pushEntries(next.result.entries)
    cursor = next.result.cursor
    hasMore = next.result.has_more
  }

  return out
}

/**
 * Construct a per-file direct-download URL from a shared-folder URL plus a
 * relative path inside it. Pattern documented by Dropbox:
 *
 *   https://www.dropbox.com/scl/fo/<id>/<key>/<file>?rlkey=...&dl=1
 *
 * - URL-encodes each path segment (spaces, special chars).
 * - Forces `dl=1` (Mux pulls the file directly).
 * - Drops the signed-token param `st` from the original URL — it's bound
 *   to the folder request and isn't valid for per-file fetches.
 */
export function buildSharedFolderFileUrl(
  folderUrl: string,
  relativePath: string,
): string {
  const u = new URL(folderUrl)
  const rel = relativePath.replace(/^\/+/, '')
  const encodedRel = rel.split('/').map(encodeURIComponent).join('/')
  u.pathname = `${u.pathname.replace(/\/+$/, '')}/${encodedRel}`
  u.searchParams.set('dl', '1')
  u.searchParams.delete('st')
  return u.toString()
}

/**
 * Get an existing shared link for a path, or create one. Mirrors the retry
 * dance from `src/scripts/generate-workshop-json-from-dropbox.ts:175-234`:
 *
 *   1. Try `sharingCreateSharedLinkWithSettings` (public viewer).
 *   2. On `shared_link_already_exists`, prefer the metadata URL embedded in
 *      the error; otherwise fall back to `sharingListSharedLinks` and
 *      take the first link.
 *   3. Always rewrite ?dl=0 → ?dl=1.
 *
 * Throws on any terminal failure — no `DROPBOX_LINK_ERROR:` sentinel
 * (the original review flagged that as a bug; we won't repeat it).
 */
export async function getOrCreateSharedLink(
  dbx: DropboxClient,
  path: string,
): Promise<string> {
  try {
    const created = await dbx.sharingCreateSharedLinkWithSettings({
      path,
      settings: {
        requested_visibility: {'.tag': 'public'},
        audience: {'.tag': 'public'},
        access: {'.tag': 'viewer'},
      },
    })
    return toDirectDownloadUrl(created.result.url)
  } catch (error: unknown) {
    // Detect the "already exists" error shape and recover.
    if (error && typeof error === 'object' && 'error' in error) {
      const dropboxError = error as {
        error?: {
          error_summary?: string
          shared_link_already_exists?: {metadata?: {url?: string}}
        }
      }
      const summary = dropboxError.error?.error_summary ?? ''
      if (summary.includes('shared_link_already_exists')) {
        const metadataUrl =
          dropboxError.error?.shared_link_already_exists?.metadata?.url
        if (metadataUrl) {
          return toDirectDownloadUrl(metadataUrl)
        }
        const existing = await dbx.sharingListSharedLinks({
          path,
          direct_only: true,
        })
        if (existing.result.links.length > 0) {
          return toDirectDownloadUrl(existing.result.links[0].url)
        }
        throw new Error(
          `shared_link_already_exists for ${path} but no link could be retrieved`,
        )
      }
    }
    throw error
  }
}
