import {PortableText} from '@portabletext/react'
import {take} from 'lodash'
import Link from 'next/link'
import {portableTextComponents} from '../portable-text'
import {useMuxPlayer} from '../hooks/use-mux-player'
import {useLesson} from '../hooks/use-lesson'
import {MDXRemoteProps, MDXRemoteSerializeResult} from 'next-mdx-remote'
import MDX from '../markdown/mdx'
import {cn} from '../utils/cn'
import {Lesson} from '../schemas/lesson'

export const LessonDescription: React.FC<{
  lessonMDXBody?: MDXRemoteSerializeResult
  lessonBodyPreview?: MDXRemoteSerializeResult
  productName: string
  loadingIndicator: React.ReactElement
  mdxComponents?: MDXRemoteProps['components']
  className?: string
  loadingRenderer?: (lesson: Lesson) => JSX.Element
  proCtaRenderer?: (lesson: Lesson, productName?: string) => JSX.Element
}> = ({
  productName,
  loadingIndicator,
  loadingRenderer = (lesson) => {
    return (
      <div role="status">
        {new Array(6).fill(0).map((_, index) => (
          <div key={index} />
        ))}
        <span className="sr-only">Loading {lesson._type}</span>
      </div>
    )
  },
  proCtaRenderer = (lesson, productName) => {
    return (
      <p>
        This {lesson._type} is part of <Link href={'/buy'}>{productName}</Link>{' '}
        and can be unlocked immediately after purchase. Already purchased?{' '}
        <Link href="/login">Log in here.</Link>
      </p>
    )
  },
  lessonMDXBody,
  lessonBodyPreview,
  mdxComponents = {},
  className,
}) => {
  const {canShowVideo, loadingUserStatus} = useMuxPlayer()
  const {lesson, module} = useLesson()
  const {body} = lesson

  const displayedBody = canShowVideo ? body : take(body, 3)
  const mdx = canShowVideo ? lessonMDXBody : lessonBodyPreview

  return (
    <div data-lesson-description="">
      <div
        data-content=""
        className={cn(className)}
        data-content-visible={canShowVideo.toString()}
      >
        {lessonMDXBody ? (
          <MDX
            contents={mdx as MDXRemoteSerializeResult}
            components={mdxComponents}
          />
        ) : (
          <PortableText
            value={displayedBody}
            components={portableTextComponents({loadingIndicator})}
          />
        )}
      </div>
      {!canShowVideo && loadingUserStatus && loadingRenderer(lesson)}
      {!canShowVideo && !loadingUserStatus && (
        <div data-cta="">
          {module.moduleType === 'workshop' ? (
            proCtaRenderer(lesson, productName)
          ) : (
            <p>Subscribe to unlock this {lesson._type}.</p>
          )}
        </div>
      )}
    </div>
  )
}
