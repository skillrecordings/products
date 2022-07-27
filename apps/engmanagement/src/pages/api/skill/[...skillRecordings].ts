import SkillRecordings, {
  SkillRecordingsOptions,
} from '@skillrecordings/skill-api'

import {prisma} from '@skillrecordings/database'
import config from '../../../config'

export const skillOptions: SkillRecordingsOptions = {
  site: {
    title: config.defaultTitle,
    supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL,
  },
  prismaClient: prisma,
}

export default SkillRecordings(skillOptions)
