import {H1, H2, H3, H4} from './headings'
import {Link} from './link'

const MDXComponents = {
  h1: (props: any) => <H1 {...props} />,
  h2: (props: any) => <H2 {...props} />,
  h3: (props: any) => <H3 {...props} />,
  h4: (props: any) => <H4 {...props} />,
  a: (props: any) => <Link {...props} />,
}

export default MDXComponents
