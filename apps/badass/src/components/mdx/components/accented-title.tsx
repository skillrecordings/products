import Balancer from 'react-wrap-balancer'

export type AccentedTitleProps = {
  text: string
  color?: string
  balanced?: boolean
}

const AccentedTitle: React.FC<AccentedTitleProps> = ({
  text,
  color,
  balanced,
}) => {
  return (
    <div
      data-accented-title=""
      data-accented-title-color={color || ''}
      className="not-prose"
    >
      {text && (
        <div data-accented-title-wrapper="">
          <h3 data-accented-title-text="">
            {text}
            {/* <Balancer>{text}</Balancer> */}
            {/* {balanced ? <Balancer>{text}</Balancer> : text} */}
          </h3>
        </div>
      )}
    </div>
  )
}

export default AccentedTitle
