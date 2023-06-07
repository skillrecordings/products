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

type VideoProps = {
  url: string
  title?: string
}

const Video: React.FC<VideoProps> = ({url, title}) => {
  return (
    <figure data-body-video="" className="video">
      <video
        autoPlay={false}
        loop={true}
        controls={true}
        className="rounded-md"
      >
        <source src={url} type="video/mp4" />
      </video>
      {title && (
        <div className="pt-2 pb-4 text-base font-medium text-slate-400">
          {title}
        </div>
      )}
    </figure>
  )
}

const mdxComponents = {
  Tweet: ({text, url, author}: TweetProps) => {
    return <Tweet text={text} url={url} author={author} />
  },
  Video: ({url, title}: VideoProps) => {
    return <Video url={url} title={title} />
  },
}

export default mdxComponents
