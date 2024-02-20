export type FancyTitleWithSubtitleProps = {
  title: string
  subtitle: string
}

const FancyTitleWithSubtitle: React.FC<FancyTitleWithSubtitleProps> = ({
  title,
  subtitle,
}) => {
  return (
    <div data-fancy-title-with-subtitle="" className="not-prose">
      <h4 data-fancy-subtitle="">{subtitle}</h4>
      <h3 data-fancy-title="">{title}</h3>
    </div>
  )
}

export default FancyTitleWithSubtitle
