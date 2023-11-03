import SkillRecordings, {
  IncomingRequest,
  SkillRecordingsOptions,
} from '@skillrecordings/skill-api'
import {nextAuthOptions} from '../auth/[...nextauth]'
import {getToken} from 'next-auth/jwt'
import {NextApiRequest} from 'next'
import {getCurrentAbility, UserSchema} from '@skillrecordings/skill-lesson'

export const skillOptions: SkillRecordingsOptions = {
  site: {
    title: process.env.NEXT_PUBLIC_SITE_TITLE,
    supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL,
  },
  nextAuthOptions,
  getAbility: async (req: IncomingRequest) => {
    const token = await getToken({req: req as unknown as NextApiRequest})
    return getCurrentAbility({user: UserSchema.parse(token)})
  },
}

export default SkillRecordings(skillOptions)

/**
 * bodyParser MUST be false to handle webhooks
 */
export const config = {
  api: {
    bodyParser: false,
  },
}
