export const LessonListing = (props: {
  lesson: {title: string; slug: string}
  moduleSlug: string
}) => {
  const {lesson, moduleSlug} = props

  return (
    <li>
      <a
        href={`${moduleSlug}/${lesson.slug}`}
        className="font-semibold underline"
      >
        {lesson.title}
      </a>
    </li>
  )
}
