import SkillRecordings, {
  SkillRecordingsOptions,
} from '@skillrecordings/skill-api'

import prisma from '../../../db'
import config from '../../../config'

export const skillOptions: SkillRecordingsOptions = {
  site: {
    title: config.defaultTitle,
    supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL,
  },
  prismaClient: prisma as any,
  slack: {
    token: process.env.SLACK_TOKEN,
    feedback: {
      channelId: process.env.SLACK_FEEDBACK_CHANNEL_ID,
      botUsername: 'TA Feedback Bot',
    },
  },
}

export default SkillRecordings(skillOptions)
