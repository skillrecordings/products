import Image from 'next/image'
import {Icon} from '../icons'
import ReactMarkdown from 'react-markdown'

type TweetProps = {
  text: string
  url: string
  author: {
    name: string
    handle: string
    avatar: string
  }
}

const Tweet: React.FC<TweetProps> = ({text, url, author}) => {
  const {avatar, name, handle} = author
  return (
    <blockquote data-body-tweet="">
      <div data-header="">
        <a
          href={`https://twitter.com/${handle}`}
          target="_blank"
          rel="noopener noreferrer"
          data-author=""
        >
          <Image src={avatar} alt={name} width={48} height={48} />
          <div data-name="">
            {name} <div data-handle="">@{handle}</div>
          </div>
        </a>
        <a href={url} target="_blank" rel="noopener noreferrer">
          <Icon name="Twitter" size="20" />
        </a>
      </div>
      <div data-body="">
        <ReactMarkdown>{text}</ReactMarkdown>
      </div>
    </blockquote>
  )
}

const mdxComponents = {
  Tweet: ({text, url, author}: TweetProps) => {
    return <Tweet text={text} url={url} author={author} />
  },
}

export default mdxComponents
