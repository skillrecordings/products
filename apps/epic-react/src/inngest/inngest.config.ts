import {inngest} from '@/inngest/inngest.server'
import {purchaseTransferComplete} from '@/inngest/functions/purchase/purchase-transfer-complete'
import {stripeCheckoutCompleted} from '@/inngest/functions/stripe/checkout-completed'
import {sanityProductFunctions} from '@/inngest/functions/sanity/product'
import {stripeWebhookReceived} from '@/inngest/functions/stripe/webhook-received'
import {convertkitWebhookHandler} from '@/inngest/functions/create-custom-coupon'
import {writeAnEmail} from '@/inngest/functions/ai-email/write-an-email'
import {lessonCompleted} from '@/inngest/functions/progress/lesson-completed'
import {syncDiscordRoles} from '@/inngest/functions/discord/sync-discord-roles'
import {discordAccountLinked} from '@/inngest/functions/discord/discord-account-linked'
import {sendWelcomeEmail} from '@/inngest/functions/post-purchase-automation/send-welcome-email'

export const inngestConfig = {
  client: inngest,
  functions: [
    stripeCheckoutCompleted,
    stripeWebhookReceived,
    purchaseTransferComplete,
    convertkitWebhookHandler,
    writeAnEmail,
    lessonCompleted,
    syncDiscordRoles,
    discordAccountLinked,
    sendWelcomeEmail,
    ...sanityProductFunctions,
  ],
}
