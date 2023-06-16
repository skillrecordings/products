import Balancer from 'react-wrap-balancer'

export type BodyBlockquoteProps = {
  color: 'blue' | 'green' | 'red' | 'pink' | 'yellow'
}

const BodyBlockquote: React.FC<
  React.PropsWithChildren<BodyBlockquoteProps>
> = ({children, color}) => {
  return (
    <div
      data-body-blockquote=""
      data-body-blockquote-color={color}
      className="not-prose"
    >
      <blockquote data-color={color} className="pl-6 py-4">
        <Balancer>{children}</Balancer>
      </blockquote>
    </div>
  )
}

export default BodyBlockquote
