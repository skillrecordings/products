import {getModuleProgress} from '@skillrecordings/skill-lesson/lib/module-progress'
import {sanityClientNoCdn} from '@/utils/sanity-client'
import groq from 'groq'
import {z} from 'zod'
import {MODULES_WITH_NO_CERTIFICATE} from './course-certificate'

export async function canEarnCourseCertificate(userId: unknown) {
  if (typeof userId !== 'string' || !userId) return false

  const rows = z.array(z.unknown()).parse(
    await sanityClientNoCdn.fetch(groq`*[
      _type == "module" && moduleType == "workshop" && state == "published" &&
      !(_id in path("drafts.**")) && !(_id in path("versions.**"))
    ]{"slug": slug.current}`),
  )
  const workshopSchema = z.object({slug: z.string().regex(/^\S+$/)})
  const requiredSlugs = rows.flatMap((row) => {
    const workshop = workshopSchema.safeParse(row)
    if (!workshop.success) {
      console.warn(
        'Skipping published workshop with an invalid certificate slug',
      )
      return []
    }
    const {slug} = workshop.data
    return MODULES_WITH_NO_CERTIFICATE.includes(slug) ? [] : [slug]
  })
  if (!requiredSlugs.length) return false

  const progress = await Promise.all(
    requiredSlugs.map((moduleSlug) => getModuleProgress({moduleSlug, userId})),
  )
  return progress.every(({moduleCompleted}) => moduleCompleted)
}
