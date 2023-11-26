import {
  SkillRecordingsAction,
  SkillRecordingsHandlerParams,
  SkillRecordingsHeader,
} from './types'
import {init} from './init'
import {actionRouter} from '../router'

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
  const {action, method = 'GET'} = req

  return await actionRouter({
    method,
    req,
    action,
    params,
    userOptions,
    token,
  })
}
