import {PortableText} from '@portabletext/react'
import {take} from 'lodash'
import Link from 'next/link'
import {portableTextComponents} from '../portable-text'
import {useMuxPlayer} from '../hooks/use-mux-player'
import {useLesson} from '../hooks/use-lesson'

export const LessonDescription: React.FC<{
  productName: string
  loadingIndicator: React.ReactElement
}> = ({productName, loadingIndicator}) => {
  const {canShowVideo, loadingUserStatus} = useMuxPlayer()
  const {lesson, module} = useLesson()
  const {body} = lesson

  const displayedBody = canShowVideo ? body : take(body, 3)
  return (
    <div data-lesson-description="">
      <div data-content="" data-content-visible={canShowVideo.toString()}>
        <PortableText
          value={displayedBody}
          components={portableTextComponents({loadingIndicator})}
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
          {module.moduleType === 'workshop' ? (
            <p>
              This {lesson._type} is part of{' '}
              <Link href={'/buy'}>{productName}</Link> and can be unlocked
              immediately after purchase. Already purchased?{' '}
              <Link href="/login">Log in here.</Link>
            </p>
          ) : (
            <p>Subscribe to unlock this {lesson._type}.</p>
          )}
        </div>
      )}
    </div>
  )
}
