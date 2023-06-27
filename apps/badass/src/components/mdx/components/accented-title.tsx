import Balancer from 'react-wrap-balancer'
export type AccentedTitleProps = {
  text: string
  color?: string
}

const AccentedTitle: React.FC<AccentedTitleProps> = ({text, color}) => {
  return (
    <div
      data-accented-title=""
      data-accented-title-color={color || ''}
      className="not-prose"
    >
      {text && (
        <div data-accented-title-wrapper="">
          <h3 data-accented-title-text>
            <Balancer>{text}</Balancer>
          </h3>
        </div>
      )}
    </div>
  )
}

export default AccentedTitle
