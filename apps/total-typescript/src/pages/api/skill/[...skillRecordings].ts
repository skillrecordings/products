import SkillRecordings, {
  IncomingRequest,
  SkillRecordingsOptions,
} from '@skillrecordings/skill-api'
import {nextAuthOptions} from '../auth/[...nextauth]'
import {NextApiRequest} from 'next'
import {getToken} from 'next-auth/jwt'
import {UserSchema, getCurrentAbility} from '@skillrecordings/skill-lesson'

export const skillOptions: SkillRecordingsOptions = {
  site: {
    title: process.env.NEXT_PUBLIC_SITE_TITLE,
    supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL as string,
  },
  slack: {
    token: process.env.SLACK_TOKEN,
    feedback: {
      channelId: process.env.SLACK_FEEDBACK_CHANNEL_ID,
      botUsername: 'TT Feedback Bot',
    },
    redeem: {
      channelId: process.env.SLACK_ANNOUNCE_CHANNEL_ID,
      botUsername: 'TT Redeemer',
    },
  },
  getAbility: async (req: IncomingRequest) => {
    const token = await getToken({req: req as unknown as NextApiRequest})
    return getCurrentAbility({user: UserSchema.parse(token)})
  },
  nextAuthOptions,
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
