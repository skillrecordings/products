import {JWT} from 'next-auth/jwt'
import {SkillRecordingsOptions} from '../next'
import {NextApiRequest, NextApiResponse} from 'next'
import {IncomingRequest} from './index'
import {PrismaClient} from '../../generated/prisma/client'

export type SkillRecordingsAction = 'send-feedback' | 'test'

export interface SkillRecordingsHeader {
  key: string
  value: string
}

export interface SkillRecordingsHandlerParams {
  req: IncomingRequest
  token: JWT | null
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

export type SendFeedbackFromUserOptions = {
  userId: string
  feedbackText: string
  context?: FeedbackContext
  prisma: PrismaClient
}

export type FeedbackContext = {
  url?: string
  category?: 'general' | 'help'
  emotion?: ':heart_eyes:' | ':unicorn_face:' | ':sob:'
  location?: string
}
