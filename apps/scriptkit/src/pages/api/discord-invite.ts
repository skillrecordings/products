import {NextApiRequest, NextApiResponse} from 'next'
import {Client, GatewayIntentBits} from 'discord.js'

const GUILD_ID = '804053880266686464'
const CHANNEL_ID = '804053880266686467'

const client = new Client({
  intents: [GatewayIntentBits.GuildInvites],
})

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await client.login(process.env.DISCORD_BOT_TOKEN)

  let guild = await client.guilds.fetch(GUILD_ID)
  // let channel = await guild.channels.cache.get(CHANNEL_ID)
  let invite = await guild.invites.create(CHANNEL_ID)

  res.send(invite.url)
}
