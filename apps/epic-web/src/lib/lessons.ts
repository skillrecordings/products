import {Purchase, User} from '@skillrecordings/database'
import {getModule} from '@skillrecordings/skill-lesson/lib/modules'
import {getSection} from 'lib/sections'
import {getExercise} from 'lib/exercises'
import {getProducts} from '@skillrecordings/skill-lesson/lib/products'
import {getCurrentAbility} from '@skillrecordings/skill-lesson'
import {Lesson} from '@skillrecordings/skill-lesson/schemas/lesson'
import {sanityClient} from '@skillrecordings/skill-lesson/utils/sanity-client'
import groq from 'groq'

type GetLessonProps = {
  useSolution?: boolean
  lessonSlug: string
  moduleSlug: string
  sectionSlug: string
  user?: User & {purchases: Purchase[]}
}
export async function getLessonVideoForDevice({
  useSolution = false,
  lessonSlug,
  moduleSlug,
  sectionSlug,
  user,
}: GetLessonProps) {
  const module = await getModule(moduleSlug)
  const section = await getSection(sectionSlug)
  const lessonData = await getExercise(lessonSlug, false)

  const lesson = useSolution ? (lessonData.solution as Lesson) : lessonData

  const productsPurchased =
    user?.purchases?.map((purchase) => purchase.productId) || []
  const purchasedModules = await getProducts(productsPurchased)

  const ability = getCurrentAbility({
    user,
    purchasedModules,
    lesson,
    section,
    module,
  })

  if (ability.can('view', 'Content')) {
    const videoResource = await sanityClient.fetch(
      groq`*[_type in ['videoResource'] && _id == $id][0]{
      "transcript": transcript.text,
      "muxPlaybackId": muxAsset.muxPlaybackId
    }`,
      {id: lesson.videoResourceId as string},
    )

    return {
      ...videoResource,
      httpUrl: `${process.env.NEXT_PUBLIC_URL}/${
        module.moduleType
      }s/${moduleSlug}/${sectionSlug}/${lessonSlug}${
        useSolution ? '/solution' : ''
      }`,
    }
  }
}
