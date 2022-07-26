import SkillRecordings, {
  SkillRecordingsOptions,
} from '@skillrecordings/skill-api'

import prisma from '../../../db'

export const skillOptions: SkillRecordingsOptions = {
  site: {
    title: process.env.NEXT_PUBLIC_SITE_TITLE,
    supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL,
  },
  prismaClient: prisma as any,
}

export default SkillRecordings(skillOptions)
