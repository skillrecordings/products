import {SkillRecordingsOptions} from '../next'
import {InternalOptions} from './types'
import {IncomingRequest} from './index'
interface InitParams {
  host?: string
  userOptions: SkillRecordingsOptions
  action: InternalOptions['action']
  /** Is the incoming request a POST request? */
  isPost: boolean
  cookies: IncomingRequest['cookies']
}
/**
 * Initialize options and cookies.
 * @param userOptions
 * @param action
 * @param host
 * @param reqCookies
 * @param isPost
 */
export declare function init({
  userOptions,
  action,
  host,
  cookies: reqCookies,
  isPost,
}: InitParams): Promise<{
  options: InternalOptions
  cookies: any[]
}>
export {}
