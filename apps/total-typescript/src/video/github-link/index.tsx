import * as React from 'react'
import {track} from '@skillrecordings/skill-lesson/utils/analytics'
import {Icon} from '@skillrecordings/skill-lesson/icons'
import {useMuxPlayer} from '@skillrecordings/skill-lesson/hooks/use-mux-player'
import {Lesson} from '@skillrecordings/skill-lesson/schemas/lesson'
import {Module} from '@skillrecordings/skill-lesson/schemas/module'

const GitHubLink: React.FC<{
  exercise: Lesson
  module: Module
  loadingIndicator: React.ReactElement
  url: string
  repository?: string | null
  file?: string
}> = ({exercise, module, loadingIndicator, url, file, repository}) => {
  const {canShowVideo, loadingUserStatus} = useMuxPlayer()

  if (loadingUserStatus) {
    return (
      <div data-github-link="" role="status">
        {loadingIndicator}
        <span className="sr-only">Loading GitHub link</span>
      </div>
    )
  }

  if (!canShowVideo || !url) {
    return null
  }

  return (
    <div data-github-link="">
      <div data-content="">
        <a
          onClick={() => {
            track('clicked github code link', {
              lesson: exercise.slug,
              module: module.slug.current,
              moduleType: module.moduleType,
              lessonType: exercise._type,
            })
          }}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Icon name="Github" />
          <div>
            {repository && <p data-repo="">{repository}</p>}
            {file && (
              <p data-file="">
                <span>/</span>
                {file}
              </p>
            )}
          </div>
        </a>
      </div>
    </div>
  )
}

export default GitHubLink
