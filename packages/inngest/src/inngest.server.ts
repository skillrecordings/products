import {Inngest} from 'inngest'

type Events = {
  'test/hello.world': {
    name: string
    data: {
      name: string
      email: string
    }
  }
  'stripe/checkout.session.completed': {
    name: string
    data: {
      checkoutSessionId: string
    }
  }
  'convertkit/survey.answered': {
    name: string
    data: {
      question: string
      answer: string
      subscriber: {
        id: string
        first_name: string
        email_address: string
      }
    }
  }
}

export const inngest = new Inngest<Events>({
  name: process.env.NEXT_PUBLIC_SITE_TITLE,
})
