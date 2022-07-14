import SkillRecordings, {
  SkillRecordingsOptions,
} from '@skillrecordings/skill-api'

import prisma from '../../../db'

export const skillOptions: SkillRecordingsOptions = {
  prismaClient: prisma as any,
}

export default SkillRecordings(skillOptions)
