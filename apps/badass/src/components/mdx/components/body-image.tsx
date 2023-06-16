import Image from 'next/image'

export type BodyImageProps = {
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

export default BodyImage
