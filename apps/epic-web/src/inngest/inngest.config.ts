import {inngest} from 'inngest/inngest.server'
import {processNewTip} from 'inngest/functions/tips/process-new-tip'
import {addSrtToMuxAsset} from 'inngest/functions/tips/add-srt-to-mux-asset'
import {stripeCheckoutCompleted} from 'inngest/functions/stripe/checkout-completed'
import {lessonCompleted} from 'inngest/functions/progress/lesson-completed'
import {writeAnEmail} from 'inngest/functions/ai-email/write-an-email'
import {purchaseTransferComplete} from 'inngest/functions/purchase/purchase-transfer-complete'
import {sanityProductFunctions} from 'inngest/functions/sanity/product'
import {stripeWebhookReceived} from 'inngest/functions/stripe/webhook-received'
import {sendWelcomeEmail} from 'inngest/functions/post-purchase-automation/send-welcome-email'
import {generateStripeReport} from 'inngest/functions/financial-reports/request-report-in-stripe'

export const inngestConfig = {
  client: inngest,
  functions: [
    processNewTip,
    addSrtToMuxAsset,
    stripeCheckoutCompleted,
    stripeWebhookReceived,
    // inactivityAfterPurchase,
    // resumeProgressAfterInactivity,
    lessonCompleted,
    writeAnEmail,
    purchaseTransferComplete,
    sendWelcomeEmail,
    ...sanityProductFunctions,
    generateStripeReport,
  ],
}
