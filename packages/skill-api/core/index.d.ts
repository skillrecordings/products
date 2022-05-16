import {
  SkillRecordingsAction,
  SkillRecordingsHandlerParams,
  SkillRecordingsHeader,
} from './types'
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
export declare function SkillRecordingsHandler<
  Body extends string | Record<string, any> | any[],
>(params: SkillRecordingsHandlerParams): Promise<OutgoingResponse<Body>>
