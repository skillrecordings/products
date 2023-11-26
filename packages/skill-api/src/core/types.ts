import {JWT} from 'next-auth/jwt'
import {SkillRecordingsOptions} from '../next'
import {NextApiRequest, NextApiResponse} from 'next'
import {IncomingRequest} from './index'
import type {CookieSerializeOptions} from 'cookie'

export interface SkillRecordingsHeader {
  key: string
  value: string
}

export interface SkillRecordingsHandlerParams {
  req: IncomingRequest
  token: JWT | null
  options: SkillRecordingsOptions
  rawReq?: NextApiRequest
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
  providerId?: string
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

export type SendFeedbackFromUserOptions = {
  emailAddress?: string
  feedbackText: string
  context?: FeedbackContext
  config: SkillRecordingsOptions
}

export type FeedbackContext = {
  url?: string
  category?: 'general' | 'help' | 'code'
  emotion?:
    | ':heart_eyes:'
    | ':unicorn_face:'
    | ':sob:'
    | ':neutral_face:'
    | ':wave:'
    | ':smiley:'
  location?: string
}

/** [Documentation](https://next-auth.js.org/configuration/options#cookies) */
export interface CookieOption {
  name: string
  options: CookieSerializeOptions
}

/** [Documentation](https://next-auth.js.org/configuration/options#cookies) */
export interface CookiesOptions {}
