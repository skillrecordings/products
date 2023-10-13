import {serve} from 'inngest/next'
import {inngest} from 'inngest/inngest.server'
import {processNewTip} from 'inngest/functions/tips/process-new-tip'
import {addSrtToMuxAsset} from 'inngest/functions/tips/add-srt-to-mux-asset'
import {stripeCheckoutCompleted} from 'inngest/functions/stripe/checkout-completed'

export default serve(inngest, [
  processNewTip,
  addSrtToMuxAsset,
  stripeCheckoutCompleted,
])
