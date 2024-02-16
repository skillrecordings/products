import Link from 'next/link'

export type AccentedTitleProps = {
  text: string
  color?: string
  href?: string
}

const AccentedTitle: React.FC<AccentedTitleProps> = ({text, color, href}) => {
  return href ? (
    <Link
      href={href}
      data-accented-title=""
      data-accented-title-color={color || ''}
      className="not-prose hover:brightness-75 duration-200"
    >
      {text && (
        <div data-accented-title-wrapper="">
          <h3 data-accented-title-text="">{text}</h3>
        </div>
      )}
    </Link>
  ) : (
    <div
      data-accented-title=""
      data-accented-title-color={color || ''}
      className="not-prose"
    >
      {text && (
        <div data-accented-title-wrapper="">
          <h3 data-accented-title-text="">{text}</h3>
        </div>
      )}
    </div>
  )
}

export default AccentedTitle
