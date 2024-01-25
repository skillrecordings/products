import Image from 'next/image'

export type BodyImageProps = {
  src: string
  width: number
  height: number
  alt?: string
  caption?: string
}

const BodyImage: React.FC<BodyImageProps> = ({
  src,
  width,
  height,
  alt = '',
  caption,
}) => {
  return (
    <div data-body-image="" className="not-prose">
      <Image src={src} width={width} height={height} alt={alt} />
      {caption && <h4 data-body-image-caption="">{caption}</h4>}
    </div>
  )
}

export default BodyImage
