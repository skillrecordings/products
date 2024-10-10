import {prisma} from '@skillrecordings/database'
import {inngest} from 'inngest/inngest.server'
import {OAUTH_PROVIDER_ACCOUNT_LINKED_EVENT} from 'inngest/events'
import {fetchAsDiscordBot} from 'lib/discord-query'
import {syncDiscordRoles} from 'inngest/functions/discord/sync-discord-roles'

export const discordAccountLinked = inngest.createFunction(
  {
    id: `discord-account-linked`,
    name: 'Discord Account Linked',
  },
  {
    event: OAUTH_PROVIDER_ACCOUNT_LINKED_EVENT,
    if: 'event.data.account.provider == "discord"',
  },
  async ({event, step}) => {
    const {account, profile} = event.data

    const user = await step.run('get user', async () => {
      return prisma.user.findFirst({
        where: {
          id: event.user.id,
        },
        include: {
          accounts: true,
          purchases: true,
        },
      })
    })

    if (!user) throw new Error('No user found')

    const discordUser = await step.run('get discord user', async () => {
      const userUrl = new URL('https://discord.com/api/users/@me')
      const userRes = await fetch(userUrl.toString(), {
        headers: {
          authorization: `Bearer ${account.access_token}`,
        },
      })
      return await userRes.json()
    })

    await step.run('add user to discord', async () => {
      return await fetchAsDiscordBot(
        `guilds/${process.env.DISCORD_GUILD_ID}/members/${discordUser.id}`,
        {
          method: 'PUT',
          body: JSON.stringify({access_token: account.access_token}),
          headers: {'Content-Type': 'application/json'},
        },
      )
    })

    await step.sleep('give discord a moment', '10s')

    const discordAccount = await step.run(
      'check if discord is connected',
      async () => {
        return prisma.account.findFirst({
          where: {
            userId: user.id,
            provider: 'discord',
          },
        })
      },
    )

    if (discordAccount) {
      const {discordMember} = await step.invoke('sync-discord-roles', {
        function: syncDiscordRoles,
        data: {} as any,
        user,
      })

      return {
        account,
        profile,
        user: event.user,
        discordMember,
      }
    }

    return 'no discord account found for user'
  },
)
