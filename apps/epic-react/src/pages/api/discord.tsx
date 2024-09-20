import {NextApiRequest, NextApiResponse} from 'next'
import {getToken} from 'next-auth/jwt'
import {isEqual} from 'lodash'
import {prisma} from '@skillrecordings/database'

const enableLog = true
const log = (...args: any) => enableLog && console.log(...args)

const DISCORD_API_BASE = 'https://discord.com/api'
const DISCORD_EPIC_REACT_ROLE_ID = process.env.DISCORD_EPIC_REACT_ROLE_ID ?? ''
const DISCORD_MEMBER_ROLE_ID = process.env.DISCORD_MEMBER_ROLE_ID ?? ''
const DISCORD_GUILD_ID = process.env.DISCORD_GUILD_ID ?? ''
const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET ?? ''
const DISCORD_SCOPES = process.env.DISCORD_SCOPES ?? ''
const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN ?? ''
const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID ?? ''
const DISCORD_REDIRECT_URI = process.env.DISCORD_REDIRECT_URI ?? ''

export type DiscordUser = {
  id: string
  username: string
  nick?: string
  discriminator: string
  email: string
  avatar?: string
  verified?: boolean
  flags?: number
  banner?: string
  accent_color?: number
  premium_type?: number
  public_flags?: number
}

async function loadDiscordUser(code: string) {
  if (!code) throw new Error('no discord auth token available')

  let params = new URLSearchParams()
  params.append('client_id', DISCORD_CLIENT_ID)
  params.append('client_secret', DISCORD_CLIENT_SECRET)
  params.append('grant_type', 'authorization_code')
  params.append('code', code)
  params.append('redirect_uri', DISCORD_REDIRECT_URI)
  params.append('scope', DISCORD_SCOPES)

  try {
    log('requesting token from oauth code')
    const tokenResponse = await fetch(`${DISCORD_API_BASE}/oauth2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params,
    })

    const discordToken = await tokenResponse.json()

    if (discordToken.error) {
      throw new Error('error getting discord token', discordToken.error)
    }

    log('got a discord token, now getting the discord user')
    const userResponse = await fetch(`${DISCORD_API_BASE}/users/@me`, {
      method: 'GET',
      headers: {
        authorization: `${discordToken.token_type} ${discordToken.access_token}`,
      },
    })
    const discordUser = await userResponse.json()
    log(`got the discord user. It's ${discordUser.id}, ${discordUser.username}`)

    return {user: discordUser, token: discordToken}
  } catch (error) {
    console.error(error)
  }
}

async function updateDiscordRolesForEpicReactUser({
  discordMember,
  epicReactUser,
}: {
  discordMember: any
  epicReactUser: any
}) {
  if (discordMember && epicReactUser) {
    log('updating egghead user', {epicReactUser})

    const epicReactPrismaUser = (await prisma.user.findUnique({
      where: {id: epicReactUser.id},
    })) ?? {fields: {}}

    const updatedUser = await prisma.user.update({
      where: {id: epicReactUser.id},
      data: {
        fields: {
          discord_id: discordMember.user.id,
          ...(epicReactPrismaUser?.fields as object),
        },
      },
    })

    const hasEpicReact = epicReactUser.purchases.length > 0

    log('has epic react:', hasEpicReact)

    log('getting epicReactRole')
    const discordRolesResponse = await fetch(
      // can't get a role by it's ID, so we have to get all the roles
      // and then filter it by the ID
      `${DISCORD_API_BASE}/guilds/${DISCORD_GUILD_ID}/roles`,
      {
        method: 'GET',
        headers: {
          authorization: `Bot ${DISCORD_BOT_TOKEN}`,
        },
      },
    )
    const discordRoles = await discordRolesResponse.json()
    const epicReactRole = discordRoles.find(
      (r: any) => r.id === DISCORD_EPIC_REACT_ROLE_ID,
    )
    const memberRole = discordRoles.find(
      (r: any) => r.id === DISCORD_MEMBER_ROLE_ID,
    )

    if (!epicReactRole || !memberRole) {
      throw new Error(
        'requires DISCORD_EPIC_REACT_ROLE_ID and DISCORD_MEMBER_ROLE_ID within the DISCORD_GUILD_ID to add the role to the user',
      )
    }

    const previousNickname = discordMember.nick || discordMember.user.username
    const previousRoles = discordMember.roles
    let newRoles = Array.from(
      new Set([
        ...discordMember.roles,
        DISCORD_EPIC_REACT_ROLE_ID,
        DISCORD_MEMBER_ROLE_ID,
      ]),
    )
    let newNickname = previousNickname.includes('🚀')
      ? previousNickname
      : `${previousNickname} 🚀`

    if (!hasEpicReact) {
      newRoles = newRoles.filter(
        (roleId) => roleId !== DISCORD_EPIC_REACT_ROLE_ID,
      )
      newNickname = previousNickname.replace('🚀', '').trim()
    }

    const patchData: {nick?: string; roles?: string[]} = {}
    if (newNickname !== previousNickname) patchData.nick = newNickname
    if (!isEqual(newRoles, previousRoles)) patchData.roles = newRoles

    if (Object.keys(patchData).length) {
      console.log(
        `making discord member changes for ${discordMember.user.id}`,
        patchData,
      )
      await fetch(
        `${DISCORD_API_BASE}/guilds/${DISCORD_GUILD_ID}/members/${discordMember.user.id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bot ${DISCORD_BOT_TOKEN}`,
          },
          body: JSON.stringify(patchData),
        },
      )
    } else {
      log('no discord member changes necessary')
    }

    return updatedUser
  } else {
    if (!discordMember) log('no discordMember')
    if (!epicReactUser) log('no epicReactUser')
    throw new Error(`requires egghead and discord users to update`)
  }
}

async function fetchOrInviteDiscordMember(
  discordUser: any,
  discordToken: {access_token: string},
) {
  log('getting the KCD Guild', `${DISCORD_API_BASE}/guilds/${DISCORD_GUILD_ID}`)
  const botGuildResponse = await fetch(
    `${DISCORD_API_BASE}/guilds/${DISCORD_GUILD_ID}`,
    {
      method: 'GET',
      headers: {
        authorization: `Bot ${DISCORD_BOT_TOKEN}`,
      },
    },
  )
  const botGuild = await botGuildResponse.json()

  if (botGuild) {
    log(`getting the guild member: ${discordUser.id}`)
    const memberEndpoint = `${DISCORD_API_BASE}/guilds/${DISCORD_GUILD_ID}/members/${discordUser.id}`
    // there's no harm inviting someone who's already in the server,
    // so we invite them without bothering to check whether they're in the
    // server already
    await fetch(memberEndpoint, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bot ${DISCORD_BOT_TOKEN}`,
      },
      body: JSON.stringify({
        access_token: discordToken.access_token,
      }),
    })
    const discordMemberResponse = await fetch(memberEndpoint, {
      method: 'GET',
      headers: {
        authorization: `Bot ${DISCORD_BOT_TOKEN}`,
      },
    })
    const discordMember = await discordMemberResponse.json()

    console.log({discordMember})
    log(`Got the discord member: ${discordMember.id} ${discordMember.username}`)
    return discordMember
  } else {
    throw new Error('no discord guild was found')
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await getToken({req})
  const {code} = await req.body

  if (!session) {
    res.status(401).end()
  }

  try {
    log('calling loadDiscordUser', {code})
    const discordUser = await loadDiscordUser(code)
    if (!discordUser) {
      log('no discord user found')
      res.status(500).end()
      return
    }

    log('calling fetchOrInviteDiscordMember', discordUser.user.username)
    const discordMember = await fetchOrInviteDiscordMember(
      discordUser.user,
      discordUser.token,
    )

    log('calling updateDiscordRolesForEpicReactUser')
    await updateDiscordRolesForEpicReactUser({
      discordMember,
      epicReactUser: session,
    })

    log('successfully updated egghead and discord user')
    res.status(200).json({discordUser, discordMember, session})
  } catch (error) {
    console.log('there was an error, ', error)
    res.status(500).json({error})
  }
}
