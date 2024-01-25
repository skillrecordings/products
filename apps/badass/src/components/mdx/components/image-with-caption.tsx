import Image from 'next/image'

export type ImageWithCaptionProps = {
  src: string
  width: number
  height: number
  alt?: string
  captionTitle?: string
  captionSubtitle?: string
  reducedMargins?: boolean
  noMarginTop?: boolean
  caption?: string
}

const ImageWithCaption: React.FC<ImageWithCaptionProps> = ({
  src,
  width,
  height,
  alt = '',
  captionTitle,
  captionSubtitle,
  reducedMargins = false,
  noMarginTop = false,
  caption,
}) => {
  return (
    <div
      data-image-with-caption=""
      data-image-reduced-margins={reducedMargins}
      data-image-no-margin-top={noMarginTop}
      className="not-prose"
    >
      <Image src={src} width={width} height={height} alt={alt} />
      {caption && <h4 data-image-with-caption-text="">{caption}</h4>}
      {(captionTitle || captionSubtitle) && (
        <div data-image-with-caption-holder>
          {captionTitle && (
            <h3 data-image-with-caption-title="">{captionTitle}</h3>
          )}
          {captionSubtitle && (
            <h4 data-image-with-caption-subtitle="">{captionSubtitle}</h4>
          )}
        </div>
      )}
    </div>
  )
}

export default ImageWithCaption
