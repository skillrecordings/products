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
import {PurchaseStatusUpdatedEvent} from '@skillrecordings/inngest/src'

// @ts-ignore
BigInt.prototype.toJSON = function () {
  return this.toString()
}

const EPIC_REACT_V1_PRODUCT_IDS = [
  'kcd_910c9191-5a69-4019-ad1d-c55bea7e9714',
  'kcd_8acc60f1-8c3f-4093-b20d-f60fc6e0cf61',
  'kcd_2b4f4080-4ff1-45e7-b825-7d0fff266e38',
]

const EPIC_REACT_V2_PRODUCT_IDS = [
  'kcd_product-clzlrf0g5000008jm0czdanmz',
  'kcd_product_b394271c-d6d6-4403',
  'kcd_product_15d22ad4-b668-4e81-bb5a',
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
          EPIC_REACT_V1_PRODUCT_IDS.some((productId) =>
            purchasedProductIds.includes(productId),
          )
        ) {
          productRoles.push(process.env.DISCORD_ROLE_ER_V1)
        }

        if (
          EPIC_REACT_V2_PRODUCT_IDS.some((productId) =>
            purchasedProductIds.includes(productId),
          )
        ) {
          productRoles.push(process.env.DISCORD_ROLE_ER_V2)
        }

        if (discordMember && 'user' in discordMember) {
          const currentRoles = discordMember.roles.filter(
            (role) =>
              role !== process.env.DISCORD_ROLE_ER_V1 &&
              role !== process.env.DISCORD_ROLE_ER_V2,
          )
          const roles = Array.from(
            new Set([...discordMember.roles, ...productRoles]),
          )

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
