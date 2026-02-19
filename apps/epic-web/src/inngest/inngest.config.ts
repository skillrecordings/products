import {inngest} from 'inngest/inngest.server'
import {processNewTip} from 'inngest/functions/tips/process-new-tip'
import {addSrtToMuxAsset} from 'inngest/functions/tips/add-srt-to-mux-asset'
import {stripeCheckoutCompleted} from 'inngest/functions/stripe/checkout-completed'
import {lessonCompleted} from 'inngest/functions/progress/lesson-completed'
import {writeAnEmail} from 'inngest/functions/ai-email/write-an-email'
import {purchaseTransferComplete} from 'inngest/functions/purchase/purchase-transfer-complete'
import {sanityProductFunctions} from 'inngest/functions/sanity/product'
import {
  migrateWorkshopContent,
  migrateWorkshopFromAws,
} from 'inngest/functions/sanity/workshop-migration'
import {stripeWebhookReceived} from 'inngest/functions/stripe/webhook-received'
import {sendWelcomeEmail} from 'inngest/functions/post-purchase-automation/send-welcome-email'
import {discordAccountLinked} from 'inngest/functions/discord/discord-account-linked'
import {syncDiscordRoles} from 'inngest/functions/discord/sync-discord-roles'
import {slackDailyReporter} from './functions/stripe/slack-daily-reporter'
import {slackMonthlyReporter} from './functions/stripe/slack-monthly-reporter'
import {syncConversions} from 'inngest/functions/sync-conversions'
import {megaBundle} from './functions/post-purchase-automation/mega-bundle'
import {liveEventBundle} from './functions/post-purchase-automation/live-event-bundle'
import {chargeRefunded} from './functions/post-purchase-automation/charge-refunded'
// Video processing functions
import {processVideoResource} from 'inngest/functions/video/order-transcript'
import {autoGenerateSeoDescription} from 'inngest/functions/seo/auto-generate-description'

export const inngestConfig = {
  client: inngest,
  functions: [
    // Video processing
    processNewTip,
    addSrtToMuxAsset,
    processVideoResource,
    autoGenerateSeoDescription,
    // Stripe
    stripeCheckoutCompleted,
    stripeWebhookReceived,
    // Progress
    lessonCompleted,
    // AI
    writeAnEmail,
    // Purchase
    purchaseTransferComplete,
    sendWelcomeEmail,
    megaBundle,
    liveEventBundle,
    chargeRefunded,
    // Discord
    discordAccountLinked,
    syncDiscordRoles,
    // Reporting
    slackDailyReporter,
    slackMonthlyReporter,
    // Sync
    syncConversions,
    // Sanity
    ...sanityProductFunctions,
    migrateWorkshopContent,
    migrateWorkshopFromAws,
  ],
}
