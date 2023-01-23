import * as React from 'react'
import {Contributor} from '@types'
import Image from 'next/legacy/image'
import cx from 'classnames'

type ContributorProfileBoxProps = {
  contributors: Contributor[]
  label: string
}

const ContributorProfileBox: React.FC<
  React.PropsWithChildren<ContributorProfileBoxProps>
> = ({children, label, contributors}) => {
  return (
    <div className="contributor-profile-box not-prose dark:bg-gray-800 bg-gray-100 flex flex-col justify-center">
      {children && <div className="px-5 pt-5">{children}</div>}
      <div
        className={`flex items-center p-5 ${cx({
          'sm:flex-row flex-col sm:space-y-0 space-y-2':
            contributors.length > 1,
        })} `}
      >
        <div className="flex items-center flex-shrink-0 pr-3">
          {contributors &&
            contributors.map((contributor: Contributor, i) => {
              return (
                <div
                  key={contributor.name}
                  className={`
                    sm:w-auto flex rounded-full border-2 dark:border-gray-800 border-gray-100
                    ${contributors.length > 0 && i !== 0 ? '-ml-4' : ''}`}
                  style={{zIndex: i}}
                >
                  <Image
                    src={contributor.image}
                    alt={contributor.name}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                </div>
              )
            })}
        </div>
        <div className="flex flex-col">
          {contributors && (
            <div className="font-bold leading-tight">
              {contributors.map((contributor: Contributor, i) => (
                <span key={contributor.name}>
                  {contributor.name}
                  {contributors.length > 0 &&
                    i + 1 !== contributors.length &&
                    ', '}
                </span>
              ))}
            </div>
          )}
          <div className="text-sm">{label}</div>
        </div>
      </div>
    </div>
  )
}

export default ContributorProfileBox
