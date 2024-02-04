import {TwitterTweetEmbed} from 'react-twitter-embed'

import Spinner from 'components/spinner'

export type TweetEmbedProps = {
  tweetId: string
  caption?: string
}

const TweetEmbed: React.FC<TweetEmbedProps> = ({tweetId, caption}) => {
  return (
    <div data-tweet-embed>
      <TwitterTweetEmbed
        tweetId={tweetId}
        options={{
          theme: 'dark',
          cards: 'hidden',
          width: 550,
          align: 'center',
        }}
        placeholder={
          <div className="flex aspect-square h-full w-full items-center justify-center">
            <Spinner className="h-5 w-5" />
          </div>
        }
      />
      {caption && (
        <div data-tweet-embed-caption-holder="">
          <h4 data-tweet-embed-caption="">{caption}</h4>
        </div>
      )}
    </div>
  )
}

export default TweetEmbed
