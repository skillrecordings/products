import {PortableText} from '@portabletext/react'
import {take} from 'lodash'
import Link from 'next/link'
import PortableTextComponents from 'video/portable-text'
import {useMuxPlayer} from '@skillrecordings/skill-lesson/hooks/use-mux-player'
import {useLesson} from '@skillrecordings/skill-lesson/hooks/use-lesson'

export const LessonDescription: React.FC<{productName: string}> = ({
  productName,
}) => {
  const {canShowVideo, loadingUserStatus} = useMuxPlayer()
  const {lesson} = useLesson()
  const {body} = lesson

  const displayedBody = canShowVideo ? body : take(body, 3)
  return (
    <div data-lesson-description="">
      <div data-content="" data-content-visible={canShowVideo.toString()}>
        <PortableText
          value={displayedBody}
          components={PortableTextComponents}
        />
      </div>
      {!canShowVideo && loadingUserStatus && (
        <div role="status">
          {new Array(6).fill(0).map((_, index) => (
            <div key={index} />
          ))}
          <span className="sr-only">Loading {lesson._type}</span>
        </div>
      )}
      {!canShowVideo && !loadingUserStatus && (
        <div data-cta="">
          <p>
            This {lesson._type} is part of{' '}
            <Link href={'/buy'}>{productName}</Link> and can be unlocked
            immediately after purchase. Already purchased?{' '}
            <Link href="/login">Log in here.</Link>
          </p>
        </div>
      )}
    </div>
  )
}
