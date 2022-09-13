import * as React from 'react'
import Code from './code'
import {AnimatedList, CheckList} from './list'

const mdxComponents = {
  pre: (props: any) => (
    <Code
      language={props.children.props.className}
      metastring={props.children.props.metastring}
    >
      {props.children.props.children}
    </Code>
  ),
  AnimatedList,
  CheckList,
}

export default mdxComponents
