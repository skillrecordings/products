// import Balancer from 'react-wrap-balancer'
export type CalloutTitleProps = {
  color?: string
}

const CalloutTitle: React.FC<React.PropsWithChildren<CalloutTitleProps>> = ({
  children,
  color,
}) => {
  return (
    <div data-callout-title-wrapper="" className="not-prose">
      <h2 data-callout-title="" data-callout-title-color={color || ''}>
        {/* <Balancer>{text}</Balancer> */}
        {children}
      </h2>
    </div>
  )
}

export default CalloutTitle
