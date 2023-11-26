import {SkillRecordingsOptions} from '../next'
import {InternalOptions} from './types'
import {IncomingRequest} from './index'
import {SkillRecordingsAction, SkillRecordingsProvider} from '../router'

interface InitParams {
  host?: string
  userOptions: SkillRecordingsOptions
  action: SkillRecordingsAction
  providerId?: SkillRecordingsProvider
  /** Is the incoming request a POST request? */
  isPost: boolean
  cookies: IncomingRequest['cookies']
}

/**
 * Initialize options and cookies.
 * @param userOptions
 * @param action
 * @param providerId
 * @param host
 * @param reqCookies
 * @param isPost
 */
export async function init({
  userOptions,
  action,
  host,
  providerId,
  cookies: reqCookies,
  isPost,
}: InitParams): Promise<{
  options: InternalOptions
  cookies: any[]
}> {
  // User provided options are overriden by other options,
  // except for the options with special handling above
  const options: InternalOptions = {
    ...userOptions,
    action,
    providerId,
    debug: false,
    pages: {},
    theme: {
      colorScheme: 'auto',
      logo: '',
      brandColor: '',
    },
  }

  // Init cookies
  const cookies: any[] = []

  return {options, cookies}
}
