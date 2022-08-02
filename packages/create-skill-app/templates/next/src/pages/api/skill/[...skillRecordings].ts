import SkillRecordings, {
  SkillRecordingsOptions,
} from '@skillrecordings/skill-api'

export const skillOptions: SkillRecordingsOptions = {
  site: {
    title: process.env.NEXT_PUBLIC_SITE_TITLE,
    supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL,
  },
}

export default SkillRecordings(skillOptions)
