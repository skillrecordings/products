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
}

export default SkillRecordings(skillOptions)
