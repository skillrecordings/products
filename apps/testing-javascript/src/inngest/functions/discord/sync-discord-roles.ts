import {inngest} from '@/inngest/inngest.server'
import {DiscordError, DiscordMember} from '@/lib/discord'
import {
  fetchAsDiscordBot,
  fetchJsonAsDiscordBot,
  getDiscordUser,
} from '@/lib/discord-query'
import {
  NEW_PURCHASE_CREATED_EVENT,
  PURCHASE_STATUS_UPDATED_EVENT,
} from '@skillrecordings/inngest'
import {prisma} from '@skillrecordings/database'

// @ts-ignore
BigInt.prototype.toJSON = function () {
  return this.toString()
}

const TESTING_JAVASCRIPT_PRODUCT_IDS = [
  'kcd_4f0b26ee-d61d-4245-a204-26f5774355a5',
  'kcd_da6ab36c-b091-4f6f-90aa-d7db2fc798ff',
  'kcd_fb976b99-0633-4329-bbfb-f5f76dc278b3',
]

export const syncDiscordRoles = inngest.createFunction(
  {
    id: `sync-discord-roles`,
    name: 'Discord: Sync Roles for Purchase',
  },
  [
    {event: NEW_PURCHASE_CREATED_EVENT},
    {
      event: PURCHASE_STATUS_UPDATED_EVENT,
    },
    {event: 'user/login'},
    {event: 'user/created'},
  ],
  async ({event, step}) => {
    const user = await step.run('get user', async () => {
      return prisma.user.findUnique({
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
      let discordMember = await step.run('get discord member', async () => {
        return await getDiscordUser(discordAccount.providerAccountId)
      })

      await step.run('update discord roles for user', async () => {
        const purchasedProductIds = user.purchases
          .filter((purchase) =>
            ['Valid', 'Restricted'].includes(purchase.status),
          )
          .map((purchase) => purchase.productId)
        const productRoles = []

        if (
          TESTING_JAVASCRIPT_PRODUCT_IDS.some((productId) =>
            purchasedProductIds.includes(productId),
          )
        ) {
          productRoles.push(process.env.DISCORD_ROLE_TESTING_JAVASCRIPT)
        }

        if (discordMember && 'user' in discordMember) {
          const currentRoles = discordMember.roles.filter(
            (role) => role !== process.env.DISCORD_ROLE_TESTING_JAVASCRIPT,
          )
          const roles = Array.from(new Set([...currentRoles, ...productRoles]))

          return await fetchAsDiscordBot(
            `guilds/${process.env.DISCORD_GUILD_ID}/members/${discordAccount.providerAccountId}`,
            {
              method: 'PATCH',
              body: JSON.stringify({
                roles,
              }),
              headers: {
                'Content-Type': 'application/json',
              },
            },
          )
        }
        return null
      })

      discordMember = await step.run('reload discord member', async () => {
        return await fetchJsonAsDiscordBot<DiscordMember | DiscordError>(
          `guilds/${process.env.DISCORD_GUILD_ID}/members/${discordAccount.providerAccountId}`,
        )
      })

      return {discordMember}
    }

    return {discordMember: null, error: 'No discord account found for user'}
  },
)
