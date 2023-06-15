import Image from 'next/image'
import ReactMarkdown from 'react-markdown'
import Balancer from 'react-wrap-balancer'

type BodyBlockquoteProps = {
  color: 'blue' | 'green' | 'red' | 'pink' | 'yellow'
}

const BodyBlockquote: React.FC<
  React.PropsWithChildren<BodyBlockquoteProps>
> = ({children, color}) => {
  return (
    <div
      data-body-blockquote=""
      data-body-blockquote-color={color}
      className="not-prose"
    >
      <blockquote data-color={color} className="pl-6 py-4">
        <Balancer>{children}</Balancer>
      </blockquote>
    </div>
  )
}

type BodyImageProps = {
  src: string
  width: number
  height: number
  alt?: string
}

const BodyImage: React.FC<BodyImageProps> = ({
  src,
  width,
  height,
  alt = '',
}) => {
  return (
    <div data-body-image="">
      <Image src={src} width={width} height={height} alt={alt} />
    </div>
  )
}

const mdxComponents = {
  BodyBlockquote: ({
    children,
    color,
  }: React.PropsWithChildren<BodyBlockquoteProps>) => {
    return <BodyBlockquote color={color}>{children}</BodyBlockquote>
  },
  BodyImage: ({
    src,
    width,
    height,
    alt,
  }: React.PropsWithChildren<BodyImageProps>) => {
    return <BodyImage src={src} width={width} height={height} alt={alt} />
  },
}

export default mdxComponents
