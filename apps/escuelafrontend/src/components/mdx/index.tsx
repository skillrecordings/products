import * as React from 'react'
import Code from './code'

const mdxComponents = {
  pre: (props: any) => (
    <Code
      language={props.children.props.className}
      metastring={props.children.props.metastring}
    >
      {props.children.props.children}
    </Code>
  ),
}

export default mdxComponents
