import {NextApiRequest, NextApiResponse} from 'next'

export type SkillRecordingsAction = 'send-feedback' | 'test'

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

export interface SkillRecordingsHeader {
  key: string
  value: string
}

export interface OutgoingResponse<
  Body extends string | Record<string, any> | any[] = any,
> {
  status?: number
  headers?: SkillRecordingsHeader[]
  body?: Body
  redirect?: string
  cookies?: any[]
}

export interface SkillRecordingsOptions {}

export interface SkillRecordingsHandlerParams {
  req: IncomingRequest
  options: SkillRecordingsOptions
}

export interface Theme {
  colorScheme: 'auto' | 'dark' | 'light'
  logo?: string
  brandColor?: string
}

export interface PagesOptions {
  test: string
  sendFeedback: string
}

export interface InternalOptions {
  action: string
  url?: string
  theme?: Theme
  debug?: boolean
  pages?: Partial<PagesOptions>
}

/** @internal */
export interface SkillRecordingsRequest extends NextApiRequest {
  options: InternalOptions
}

/** @internal */
export type SkillRecordingsResponse<T = any> = NextApiResponse<T>
