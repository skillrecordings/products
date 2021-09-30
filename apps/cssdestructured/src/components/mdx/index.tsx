import {H1, H2, H3, H4} from './headings'
import {HighlightedText, WithStars} from './highlights'
import {Li} from './lists'
import {Hr, Hr2} from './separators'
import {Link} from './link'
import CodeBlock from './code-block'

const MDXComponents = {
  h1: (props: any) => <H1 {...props} />,
  h2: (props: any) => <H2 {...props} />,
  h3: (props: any) => <H3 {...props} />,
  h4: (props: any) => <H4 {...props} />,
  HighlightedText: (props: any) => <HighlightedText {...props} />,
  WithStars: (props: any) => <WithStars {...props} />,
  li: (props: any) => <Li {...props} />,
  hr: () => <Hr2 />,
  a: (props: any) => <Link {...props} />,
  pre: (props: any) => (
    <CodeBlock
      language={props.children.props.className || ''}
      metastring={props.children.props.metastring}
    >
      {props.children.props.children}
    </CodeBlock>
  ),
}

export default MDXComponents
