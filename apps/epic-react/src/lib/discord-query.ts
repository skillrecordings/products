'use server'

import {prisma} from '@skillrecordings/database'

export async function getDiscordAccount(userId: string) {
  return prisma.account.findFirst({
    where: {
      userId,
      provider: 'discord',
    },
  })
}

export async function disconnectDiscord(userId: string) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      accounts: {
        where: {
          provider: 'discord',
        },
      },
    },
  })

  const discordAccount = user?.accounts.find(
    (account) => account.provider === 'discord',
  )

  if (!discordAccount) return false

  await prisma.account.delete({
    where: {
      id: discordAccount.id,
      providerAccountId: discordAccount.providerAccountId,
    },
  })

  return true
}

export async function fetchJsonAsDiscordBot<JsonType = unknown>(
  endpoint: string,
  config?: RequestInit,
) {
  const res = await fetchAsDiscordBot(endpoint, {
    ...config,
    headers: {
      'Content-Type': 'application/json',
      ...config?.headers,
    },
  })
  return (await res.json().catch((e) => e)) as JsonType
}

export async function fetchAsDiscordBot(
  endpoint: string,
  config?: RequestInit,
) {
  const url = new URL(`https://discord.com/api/${endpoint}`)
  return await fetch(url.toString(), {
    ...config,
    headers: {
      Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
      ...config?.headers,
    },
  })
}
