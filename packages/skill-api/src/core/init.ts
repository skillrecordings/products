import {SkillRecordingsOptions} from '../next'
import {InternalOptions} from './types'
import {IncomingRequest} from './index'

interface InitParams {
  host?: string
  userOptions: SkillRecordingsOptions
  action: InternalOptions['action']
  providerId?: string
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
