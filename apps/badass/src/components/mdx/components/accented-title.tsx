import Image from 'next/image'

export type AccentedTitleProps = {
  title: string
}

const AccentedTitle: React.FC<AccentedTitleProps> = ({title}) => {
  return (
    <div data-accented-title="" className="not-prose">
      {title && (
        <div data-accented-title-wrapper="">
          <h3 data-accented-title-text>{title}</h3>
        </div>
      )}
    </div>
  )
}

export default AccentedTitle
