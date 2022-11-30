import * as React from 'react'
import {Exercise} from '../../lib/exercises'
import {PortableText} from '@portabletext/react'
import PortableTextComponents from '../portable-text'
import {take} from 'lodash'
import {useMuxPlayer} from '../../hooks/use-mux-player'
import Link from 'next/link'

export const ExerciseDescription: React.FC<{exercise: Exercise}> = ({
  exercise,
}) => {
  const {canShowVideo, loadingUserStatus, lesson} = useMuxPlayer()
  const {body} = exercise

  const displayedBody = canShowVideo ? body : take(body, 1)
  return (
    <div className="prose max-w-none pt-5 prose-headings:font-semibold prose-headings:text-gray-100 prose-p:text-gray-300 sm:prose-lg xl:pt-8 2xl:pt-5">
      <PortableText value={displayedBody} components={PortableTextComponents} />
      {!canShowVideo && loadingUserStatus && (
        <p className="text-gray-300">
          Loading {lesson._type}... (this may take a few seconds)
        </p>
      )}
      {!canShowVideo && !loadingUserStatus && (
        <p className="text-gray-300">
          This {lesson._type} is part of{' '}
          <Link href={'/buy'}>
            <a>Total TypeScript Vol. 1</a>
          </Link>{' '}
          and can be unlocked immediately after purchase. Already purchased?{' '}
          <Link href="/login">
            <a>Log in here.</a>
          </Link>
        </p>
      )}
    </div>
  )
}
