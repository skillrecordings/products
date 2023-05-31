import React, {FunctionComponent} from 'react'
import {GeneralObserver} from '../general-observer'
import {handleTwttrLoad} from './utils'
export interface ITwitterTimelineProps {
  /** Twitter username */
  username: string
  /** Show Tweets liked by the username */
  showLikes?: boolean | null
  /** Color theme of the Timeline */
  theme?: 'light' | 'dark'
  /** Width for the iFrame */
  width?: number | string
  /** Height for the iFrame. Null is full height */
  height?: number | string | null
}

export const TwitterTimeline: FunctionComponent<ITwitterTimelineProps> = ({
  username,
  theme = 'light',
  showLikes = null,
  width = '498px',
  height = null,
}: ITwitterTimelineProps) => (
  <GeneralObserver onEnter={() => handleTwttrLoad()}>
    <div style={{overflow: 'auto'}}>
      <a
        data-testid="twitter-timeline"
        className="twitter-timeline twitter-timeline-mdx-embed"
        data-theme={theme}
        data-width={width}
        data-height={height}
        href={`https://twitter.com/${username}${
          showLikes ? `/likes` : ''
        }?ref_src=twsrc%5Etfw`}
      >
        {`Tweets by @${username}`}
      </a>
    </div>
  </GeneralObserver>
)
