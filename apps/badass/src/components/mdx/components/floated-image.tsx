import Image from 'next/image'

export type FloatedImageProps = {
  src: string
  width: number
  height: number
  alt?: string
  floatSide: 'left' | 'right'
}

const FloatedImage: React.FC<FloatedImageProps> = ({
  src,
  width,
  height,
  alt = '',
  floatSide,
}) => {
  return (
    <div
      data-floated-image=""
      data-floated-image-side={floatSide}
      className="not-prose"
    >
      <Image src={src} width={width} height={height} alt={alt} />
    </div>
  )
}

export default FloatedImage
