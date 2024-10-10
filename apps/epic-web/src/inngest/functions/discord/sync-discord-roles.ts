import {
  NEW_PURCHASE_CREATED_EVENT,
  PURCHASE_STATUS_UPDATED_EVENT,
} from '@skillrecordings/inngest'
import {prisma} from '@skillrecordings/database'
import {inngest} from 'inngest/inngest.server'
import {
  fetchAsDiscordBot,
  fetchJsonAsDiscordBot,
  getDiscordUser,
} from 'lib/discord-query'
import {DiscordError, DiscordMember} from 'lib/discord'

// @ts-ignore
BigInt.prototype.toJSON = function () {
  return this.toString()
}

const EPIC_WEB_PRODUCT_IDS = [
  '0143b3f6-d5dd-4f20-9898-38da609799ca',
  '172870b5-73ef-4551-b3f5-93f90a2cd93b',
  '1b6e7ed6-8a15-48f1-8dd7-e76612581ee8',
  '2267e543-51fa-4d71-a02f-ad9ba71a1f8e',
  '2e5b2993-d069-4e43-a7f1-24cffa83f7ac',
  '5ffdd0ef-a7a3-431e-b36b-f4232da7e454',
  '776463e4-7758-494d-b0f5-eb7cbd62e518',
  '7872d512-ba34-4108-b510-7db9cbcee98c',
  'dc9b750c-e3bc-4b0a-b7d2-d04a481afa0d',
  'f3f85931-e67e-456f-85c4-eec95a0e4ddd',
  'kcd_product_dbf94bf0-66b0-11ee-8c99-0242ac120002',
  'kcd_product-f000186d-78c2-4b02-a763-85b2e5feec7b',
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
          EPIC_WEB_PRODUCT_IDS.some((productId) =>
            purchasedProductIds.includes(productId),
          )
        ) {
          productRoles.push(process.env.DISCORD_ROLE_EPIC_WEB)
        }

        if (discordMember && 'user' in discordMember) {
          const currentRoles = discordMember.roles.filter(
            (role) => role !== process.env.DISCORD_ROLE_EPIC_WEB,
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
