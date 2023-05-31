import React, {FunctionComponent} from 'react'
import {GeneralObserver} from '../general-observer'
import {handleTwttrLoad} from './utils'
export interface ITwitterHashtagButtonProps {
  /** Twitter hashtag */
  hashtag: string
  /** The size of the button */
  size?: 'large' | 'small'
}

export const TwitterHashtagButton: FunctionComponent<
  ITwitterHashtagButtonProps
> = ({hashtag, size = 'small'}: ITwitterHashtagButtonProps) => (
  <GeneralObserver onEnter={() => handleTwttrLoad()}>
    <a
      data-testid="twitter-hashtag-button"
      href={`https://twitter.com/intent/tweet?button_hashtag=${hashtag}&ref_src=twsrc%5Etfw`}
      className="twitter-hashtag-button twitter-hashtag-button-mdx-embed"
      data-size={size}
    >{`Tweet #${hashtag}`}</a>
  </GeneralObserver>
)
