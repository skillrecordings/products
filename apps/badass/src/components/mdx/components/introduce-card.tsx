import Image from 'next/image'
import Balancer from 'react-wrap-balancer'

export type IntroduceCardProps = {
  image: {
    imageUrl: string
    width: number
    height: number
  }
  name: string
  title: string
}

export const IntroduceCard: React.FC<IntroduceCardProps> = ({
  image,
  name,
  title,
}) => {
  const {imageUrl, width, height} = image
  return (
    <div data-introduce-card="" className="not-prose">
      <div data-introduce-card-image="">
        <Image src={imageUrl} width={width} height={height} alt={name} />
      </div>
      <div data-introduce-card-info="">
        <h3 data-introduce-card-heading="">Introducing</h3>
        <h4 data-introduce-card-name="">{name}</h4>
        <p data-introduce-card-title="">
          <Balancer>{title}</Balancer>
        </p>
      </div>
    </div>
  )
}

export default IntroduceCard
