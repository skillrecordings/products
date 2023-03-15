import {getTutorial} from 'lib/tutorials'
import {NextResponse} from 'next/server'

export const sectionlessPattern =
  /^\/tutorials\/([^/]+)\/([^/]+)(\/(exercise|solution))?$/

export const legacySectionlessRedirect = async (url: any) => {
  const matches = url.pathname.match(sectionlessPattern)
  const module = matches?.[1]
  const lesson = matches?.[2]

  const exerciseOrSolution = matches?.[4]

  const tutorial = await getTutorial(module as string)

  if (!tutorial) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_URL}/404`)
  }

  const lessonExists = tutorial?.sections?.find((section: any) => {
    return section.lessons.find((l: any) => {
      return l.slug === lesson
    })
  })

  if (!lessonExists) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_URL}/404`)
  }

  const section = tutorial?.sections?.find((section: any) => {
    return section.lessons.find((l: any) => {
      return l.slug === lesson
    })
  })?.slug

  if (exerciseOrSolution) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_URL}/tutorials/${module}/${section}/${lesson}/${exerciseOrSolution}`,
    )
  }

  return NextResponse.redirect(
    `${process.env.NEXT_PUBLIC_URL}/tutorials/${module}/${section}/${lesson}`,
  )
}
