import * as React from 'react'
import {Exercise} from '../../lib/exercises'
import {PortableText} from '@portabletext/react'
import PortableTextComponents from '../portable-text'

export const ExerciseDescription: React.FC<{exercise: Exercise}> = ({
  exercise,
}) => {
  const {body} = exercise
  return (
    <div className="prose max-w-none pt-5 prose-headings:font-semibold prose-headings:text-gray-100 prose-p:text-gray-300 sm:prose-lg xl:pt-8 2xl:pt-5">
      <PortableText value={body} components={PortableTextComponents} />
    </div>
  )
}
