import Balancer from 'react-wrap-balancer'
export type CalloutTitleProps = {
  text: string
  color?: string
}

const CalloutTitle: React.FC<CalloutTitleProps> = ({text, color}) => {
  return (
    <div data-callout-title-wrapper="" className="not-prose">
      <h2 data-callout-title="" data-callout-title-color={color || ''}>
        {/* <Balancer>{text}</Balancer> */}
        {text}
      </h2>
    </div>
  )
}

export default CalloutTitle
