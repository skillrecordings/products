import SkillRecordings, {
  SkillRecordingsOptions,
} from '@skillrecordings/skill-api'

import {prisma} from '@skillrecordings/database'

export const skillOptions: SkillRecordingsOptions = {
  site: {
    title: process.env.NEXT_PUBLIC_SITE_TITLE,
    supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL,
  },
  prismaClient: prisma,
}

export default SkillRecordings(skillOptions)
