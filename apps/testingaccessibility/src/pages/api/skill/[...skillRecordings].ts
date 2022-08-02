import SkillRecordings, {
  SkillRecordingsOptions,
} from '@skillrecordings/skill-api'

import {withSentry} from '@sentry/nextjs'

export const skillOptions: SkillRecordingsOptions = {
  site: {
    title: process.env.NEXT_PUBLIC_SITE_TITLE,
    supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL,
  },
  slack: {
    token: process.env.SLACK_TOKEN,
    feedback: {
      channelId: process.env.SLACK_FEEDBACK_CHANNEL_ID,
      botUsername: 'TA Feedback Bot',
    },
  },
}

export default withSentry(SkillRecordings(skillOptions))

export const config = {
  api: {
    externalResolver: true,
  },
}
