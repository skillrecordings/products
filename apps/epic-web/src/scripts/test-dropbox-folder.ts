/**
 * Quick test to list a Dropbox folder and verify access
 */
import * as path from 'path'
import {config} from 'dotenv'
import {Dropbox} from 'dropbox'

config({path: path.join(__dirname, '../../.env')})
config({path: path.join(__dirname, '../../.env.local')})

function getDropboxClient(): Dropbox {
  const accessToken = process.env.DROPBOX_ACCESS_TOKEN
  if (!accessToken) throw new Error('DROPBOX_ACCESS_TOKEN not set')

  const options: {accessToken: string; selectUser?: string; pathRoot?: string} =
    {accessToken}

  if (process.env.DROPBOX_TEAM_MEMBER_ID) {
    options.selectUser = process.env.DROPBOX_TEAM_MEMBER_ID
  }

  if (process.env.DROPBOX_TEAM_NAMESPACE_ID) {
    options.pathRoot = JSON.stringify({
      '.tag': 'namespace_id',
      namespace_id: process.env.DROPBOX_TEAM_NAMESPACE_ID,
    })
  }

  return new Dropbox(options)
}

async function main() {
  const folderPath =
    '/02 areas/Epic Web/Epic TypeScript/01-programming-foundations/intro'

  console.log(
    `DROPBOX_TEAM_NAMESPACE_ID: ${process.env.DROPBOX_TEAM_NAMESPACE_ID}`,
  )
  console.log(`Listing: ${folderPath}\n`)

  const dbx = getDropboxClient()

  const result = await dbx.filesListFolder({path: folderPath})
  console.log('Contents:')
  for (const entry of result.result.entries) {
    const tag = entry['.tag'] === 'folder' ? '[folder]' : '[file]'
    console.log(`  ${tag} ${entry.name}`)
    console.log(`    path_lower: ${entry.path_lower}`)
    console.log(`    path_display: ${entry.path_display}`)
  }
}

main().catch((error: any) => {
  console.error('Error:', error?.error?.error_summary || error.message || error)
})
