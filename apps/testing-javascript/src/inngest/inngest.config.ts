import {inngest} from './inngest.server'
import {discordAccountLinked} from '@/inngest/functions/discord/discord-account-linked'
import {syncDiscordRoles} from '@/inngest/functions/discord/sync-discord-roles'

export const inngestConfig = {
  client: inngest,
  functions: [discordAccountLinked, syncDiscordRoles],
}
