import React, {FunctionComponent} from 'react'
import {GeneralObserver} from '../general-observer'
import {handleTwttrLoad} from './utils'
export interface ITwitterListProps {
  /** Twitter username */
  username: string
  /** The Twitter list name */
  listName: string
  /** Color theme of the Timeline */
  theme?: 'light' | 'dark'
  /** Width for the iFrame */
  width?: number | string
  /** Height for the iFrame. Null is full height */
  height?: number | string | null
}

export const TwitterList: FunctionComponent<ITwitterListProps> = ({
  username,
  theme = 'light',
  listName,
  width = '498px',
  height = null,
}: ITwitterListProps) => (
  <GeneralObserver onEnter={() => handleTwttrLoad()}>
    <div style={{overflow: 'auto'}}>
      <a
        data-testid="twitter-list"
        className="twitter-timeline twitter-timeline-mdx-embed"
        data-theme={theme}
        data-width={width}
        data-height={height}
        href={`https://twitter.com/${username}/lists/${listName}?ref_src=twsrc%5Etfw`}
      >
        {`A Twitter List by @${username}`}
      </a>
    </div>
  </GeneralObserver>
)
