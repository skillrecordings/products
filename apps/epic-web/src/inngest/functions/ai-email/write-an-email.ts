import {inngest} from 'inngest/inngest.server'
import {STRIPE_CHECKOUT_COMPLETED_EVENT} from '@skillrecordings/inngest'
import {EMAIL_WRITING_REQUESTED_EVENT} from 'inngest/events'

export const writeAnEmail = inngest.createFunction(
  {id: `write-an-email`, name: 'GPT-4 Email Writer'},
  {event: EMAIL_WRITING_REQUESTED_EVENT},
  async ({event, step}) => {
    return 'yup, here we are'
  },
)
