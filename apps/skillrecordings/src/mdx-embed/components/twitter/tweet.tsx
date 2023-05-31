import React, {FunctionComponent} from 'react'
import {GeneralObserver} from '../general-observer'
import {handleTwttrLoad} from './utils'

export interface ITweetProps {
  /** Tweet link */
  tweetLink: string
  /** Color theme of the Tweet */
  theme?: 'light' | 'dark'
  /** Alignment of the Tweet */
  align?: 'left' | 'center' | 'right'
  /** Hides the conversation */
  hideConversation?: boolean
}

export const Tweet: FunctionComponent<ITweetProps> = ({
  tweetLink,
  theme = 'light',
  align = 'left',
  hideConversation = false,
}: ITweetProps) => (
  <GeneralObserver onEnter={() => handleTwttrLoad()}>
    <div
      data-testid="twitter-tweet"
      className="twitter-tweet-mdx-embed"
      style={{overflow: 'auto'}}
    >
      <blockquote
        className="twitter-tweet"
        data-theme={theme}
        data-align={align}
        data-conversation={hideConversation ? 'none' : ''}
      >
        <a href={`https://twitter.com/${tweetLink}?ref_src=twsrc%5Etfw`}>
          {typeof window !== 'undefined' && !(window as any).twttr
            ? 'Loading'
            : ''}
        </a>
      </blockquote>
    </div>
  </GeneralObserver>
)
