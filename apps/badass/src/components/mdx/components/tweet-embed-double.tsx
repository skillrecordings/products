import {TwitterTweetEmbed} from 'react-twitter-embed'

import Spinner from 'components/spinner'

export type TweetEmbedDoubleProps = {
  tweetId_1: string
  tweetId_2: string
}

const TweetEmbedDouble: React.FC<TweetEmbedDoubleProps> = ({
  tweetId_1,
  tweetId_2,
}) => {
  return (
    <div data-tweet-embed-double="">
      <div data-tweet-embed="">
        <TwitterTweetEmbed
          tweetId={tweetId_1}
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
      </div>
      <div data-tweet-embed="">
        <TwitterTweetEmbed
          tweetId={tweetId_2}
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
      </div>
    </div>
  )
}

export default TweetEmbedDouble
