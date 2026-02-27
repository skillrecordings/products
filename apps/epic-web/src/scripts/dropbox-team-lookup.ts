/**
 * Dropbox Team Lookup
 *
 * Finds your DROPBOX_TEAM_MEMBER_ID and DROPBOX_TEAM_NAMESPACE_ID.
 *
 * Usage:
 *   cd apps/epic-web
 *   pnpm tsx src/scripts/dropbox-team-lookup.ts
 */

import * as path from 'path'
import {config} from 'dotenv'

// Load environment variables
config({path: path.join(__dirname, '../../.env')})
config({path: path.join(__dirname, '../../.env.local')})

const DROPBOX_ACCESS_TOKEN = process.env.DROPBOX_ACCESS_TOKEN

async function main() {
  if (!DROPBOX_ACCESS_TOKEN) {
    console.error('DROPBOX_ACCESS_TOKEN is not set in .env.local')
    process.exit(1)
  }

  console.log('Looking up Dropbox team info...\n')

  // Try to get current account info first
  try {
    const accountRes = await fetch(
      'https://api.dropboxapi.com/2/users/get_current_account',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${DROPBOX_ACCESS_TOKEN}`,
        },
      },
    )

    if (accountRes.ok) {
      const account = await accountRes.json()
      console.log('=== Current Account ===')
      console.log(`  Name: ${account.name?.display_name}`)
      console.log(`  Email: ${account.email}`)
      console.log(`  Account ID: ${account.account_id}`)
      if (account.team_member_id) {
        console.log(`  Team Member ID: ${account.team_member_id}`)
      }
      if (account.root_info) {
        console.log(
          `  Root Namespace ID: ${account.root_info.root_namespace_id}`,
        )
        console.log(
          `  Home Namespace ID: ${account.root_info.home_namespace_id}`,
        )
      }
      console.log('')

      // If this is a team account, show the values to use
      if (account.team_member_id || account.root_info?.root_namespace_id) {
        console.log('=== Add to .env.local ===')
        if (account.team_member_id) {
          console.log(`DROPBOX_TEAM_MEMBER_ID=${account.team_member_id}`)
        }
        if (account.root_info?.root_namespace_id) {
          console.log(
            `DROPBOX_TEAM_NAMESPACE_ID=${account.root_info.root_namespace_id}`,
          )
        }
        console.log('')
      }
    } else {
      const errorText = await accountRes.text()
      console.log(
        'Could not get current account:',
        accountRes.status,
        errorText,
      )
    }
  } catch (error) {
    console.error('Error fetching account info:', error)
  }

  // Try team members list (requires team token)
  try {
    console.log('=== Team Members (if team token) ===')
    const membersRes = await fetch(
      'https://api.dropboxapi.com/2/team/members/list_v2',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${DROPBOX_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({limit: 50}),
      },
    )

    if (membersRes.ok) {
      const members = await membersRes.json()
      for (const member of members.members || []) {
        const profile = member.profile
        console.log(
          `  ${profile.name?.display_name} (${profile.email}) → team_member_id: ${profile.team_member_id}`,
        )
      }
    } else {
      console.log(
        '  Not a team token or no team access (this is normal for personal tokens)',
      )
    }
  } catch {
    console.log('  Could not list team members')
  }

  // Try namespaces list
  try {
    console.log('\n=== Team Namespaces (if team token) ===')
    const nsRes = await fetch(
      'https://api.dropboxapi.com/2/team/namespaces/list',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${DROPBOX_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({limit: 50}),
      },
    )

    if (nsRes.ok) {
      const namespaces = await nsRes.json()
      for (const ns of namespaces.namespaces || []) {
        console.log(
          `  [${ns.namespace_type?.['.tag']}] "${ns.name}" → namespace_id: ${ns.namespace_id}`,
        )
      }
    } else {
      console.log(
        '  Not a team token or no namespace access (this is normal for personal tokens)',
      )
    }
  } catch {
    console.log('  Could not list namespaces')
  }
}

main().catch((error) => {
  console.error('Error:', error)
  process.exit(1)
})
