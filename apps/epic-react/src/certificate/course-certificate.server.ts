import {getModuleProgress} from '@skillrecordings/skill-lesson/lib/module-progress'
import {sanityClientNoCdn} from '@/utils/sanity-client'
import groq from 'groq'
import {z} from 'zod'
import {MODULES_WITH_NO_CERTIFICATE} from './course-certificate'

export async function canEarnCourseCertificate(userId: unknown) {
  if (typeof userId !== 'string' || !userId) return false

  const slugs = z.array(z.string().min(1)).parse(
    await sanityClientNoCdn.fetch(groq`*[
      _type == "module" && moduleType == "workshop" && state == "published" &&
      !(_id in path("drafts.**"))
    ].slug.current`),
  )
  const requiredSlugs = slugs.filter(
    (slug) => !MODULES_WITH_NO_CERTIFICATE.includes(slug),
  )
  if (!requiredSlugs.length) return false

  const progress = await Promise.all(
    requiredSlugs.map((moduleSlug) => getModuleProgress({moduleSlug, userId})),
  )
  return progress.every(({moduleCompleted}) => moduleCompleted)
}
