import Image from 'next/image'
import ReactMarkdown from 'react-markdown'
import Balancer from 'react-wrap-balancer'

type QuoteProps = {
  color: 'blue' | 'green' | 'red' | 'pink' | 'yellow'
}

const Quote: React.FC<React.PropsWithChildren<QuoteProps>> = ({
  children,
  color,
}) => {
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

const mdxComponents = {
  Quote: ({children, color}: React.PropsWithChildren<QuoteProps>) => {
    return <Quote color={color}>{children}</Quote>
  },
}

export default mdxComponents
