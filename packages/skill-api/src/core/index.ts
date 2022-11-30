import {
  SkillRecordingsAction,
  SkillRecordingsHandlerParams,
  SkillRecordingsHeader,
} from './types'
import {init} from './init'
import renderPage from './pages'
import {sendFeedbackFromUser} from './services/send-feedback-from-user'
import {loadPrices} from './services/load-prices'
import {stripeCheckout} from './services/stripe-checkout'
import {redeemGoldenTicket} from './services/redeem-golden-ticket'
import {processStripeWebhooks} from './services/process-stripe-webhook'
import {
  convertkitAnswerQuizQuestion,
  convertkitLoadSubscriber,
  subscribeToConvertkit,
} from './services/convertkit'

export interface OutgoingResponse<
  Body extends string | Record<string, any> | any[] = any,
> {
  status?: number
  headers?: SkillRecordingsHeader[]
  body?: Body
  redirect?: string
  cookies?: any[]
}

export interface IncomingRequest {
  /** @default "http://localhost:3000" */
  host?: string
  method?: string
  cookies?: Partial<{
    [key: string]: string
  }>
  headers: Record<string, any>
  query: Record<string, any>
  body: Record<string, any>
  action: SkillRecordingsAction
  providerId?: string
  error?: string
}

export async function SkillRecordingsHandler<
  Body extends string | Record<string, any> | any[],
>(params: SkillRecordingsHandlerParams): Promise<OutgoingResponse<Body>> {
  const {options: userOptions, req, token} = params

  // TODO: implement errors
  const {action, error, providerId, method = 'GET'} = req

  const {options, cookies} = await init({
    userOptions,
    action,
    providerId,
    host: req.host,
    cookies: req.cookies,
    isPost: method === 'POST',
  })

  if (method === 'GET') {
    const render = renderPage({...options, query: req.query, cookies})

    // TODO: implement override pages
    //  pages are overrides so that you can render user defined pages
    // but not implemented here
    const {pages} = options

    switch (action) {
      case 'test':
        return render.test()
      case 'subscriber':
        return await convertkitLoadSubscriber({params})
    }
  } else if (method === 'POST') {
    switch (action) {
      case 'send-feedback':
        return await sendFeedbackFromUser({
          emailAddress: req?.body?.email || token?.email,
          feedbackText: req?.body?.text,
          context: req?.body?.context,
          config: userOptions,
        })
      case 'redeem':
        return await redeemGoldenTicket({params, token})
      case 'prices':
        return await loadPrices({params})
      case 'checkout':
        return stripeCheckout({params})
      case 'webhook':
        return await processStripeWebhooks({params})
      case 'subscribe':
        return await subscribeToConvertkit({params})
      case 'answer':
        return await convertkitAnswerQuizQuestion({params})
    }
  }

  return {
    status: 400,
    body: `Error: This action with HTTP ${method} is not supported by Skill Recordings` as any,
  }
}
