import Image from 'next/image'
import cx from 'classnames'

export type BodyBlockquoteProps = {
  color: 'blue' | 'green' | 'red' | 'pink' | 'yellow'
  subtitle?: string
  image?: string
  imageWidth: number
  imageHeight?: number
}

const BodyBlockquote: React.FC<
  React.PropsWithChildren<BodyBlockquoteProps>
> = ({children, color, subtitle, image, imageWidth, imageHeight}) => {
  return (
    <div
      data-body-blockquote=""
      data-body-blockquote-color={color}
      className="not-prose"
    >
      <div
        className={cx('flex flex-col md:flex-row', {
          'items-center': image,
        })}
      >
        <blockquote>
          {children}
          {subtitle && (
            <span className="block mt-10 text-badass-gray-300">{subtitle}</span>
          )}
        </blockquote>
        {image && imageWidth && imageHeight && (
          <div className="shrink-0 w-1/2 md:pl-6 mr-6 mt-8 md:mt-0">
            <Image src={image} width={imageWidth} height={imageHeight} alt="" />
          </div>
        )}
      </div>
    </div>
  )
}

export default BodyBlockquote
