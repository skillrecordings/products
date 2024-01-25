export type AccentedSubtitleProps = {
  color?: string
}

const AccentedSubtitle: React.FC<
  React.PropsWithChildren<AccentedSubtitleProps>
> = ({children, color}) => {
  return (
    <div data-accented-subtitle-wrapper="" className="not-prose">
      <h3 data-accented-subtitle="" data-accented-subtitle-color={color || ''}>
        {children}
      </h3>
    </div>
  )
}

export default AccentedSubtitle
