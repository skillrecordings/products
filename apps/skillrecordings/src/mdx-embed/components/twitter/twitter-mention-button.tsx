import React, {FunctionComponent} from 'react'
import {GeneralObserver} from '../general-observer'
import {handleTwttrLoad} from './utils'
export interface ITwitterMentionButtonProps {
  /** Twitter username */
  username: string
  /** The size of the button */
  size?: 'large' | 'small'
}

export const TwitterMentionButton: FunctionComponent<
  ITwitterMentionButtonProps
> = ({username, size = 'small'}: ITwitterMentionButtonProps) => (
  <GeneralObserver onEnter={() => handleTwttrLoad()}>
    <a
      data-testid="twitter-mention-button"
      href={`https://twitter.com/intent/tweet?screen_name=${username}&ref_src=twsrc%5Etfw`}
      className="twitter-mention-button twitter-mention-button-mdx-embed"
      data-size={size}
    >{`Tweet to @${username}`}</a>
  </GeneralObserver>
)
