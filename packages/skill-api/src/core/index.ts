import {
  SkillRecordingsAction,
  SkillRecordingsHandlerParams,
  SkillRecordingsHeader,
} from './types'
import {init} from './init'
import renderPage from './pages'
import {sendFeedbackFromUser} from './services/send-feedback-from-user'

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
  cookies?: Record<string, string>
  headers?: Record<string, any>
  query?: Record<string, any>
  body?: Record<string, any>
  action: SkillRecordingsAction
  providerId?: string
  error?: string
}

export async function SkillRecordingsHandler<
  Body extends string | Record<string, any> | any[],
>(params: SkillRecordingsHandlerParams): Promise<OutgoingResponse<Body>> {
  const {options: userOptions, req, token} = params

  // TODO: implement errors
  const {action, error, method = 'GET'} = req

  const {options, cookies} = await init({
    userOptions,
    action,
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
    }
  } else if (method === 'POST') {
    switch (action) {
      case 'send-feedback':
        return await sendFeedbackFromUser({
          userId: token?.id as string,
          feedbackText: req?.body?.text,
          context: req?.body?.context,
          config: userOptions,
        })
    }
  }

  return {
    status: 400,
    body: `Error: This action with HTTP ${method} is not supported by Skill Recordings` as any,
  }
}
