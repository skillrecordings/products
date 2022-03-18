import * as React from 'react'
import ReactMarkdown from 'react-markdown'
import gfm from 'remark-gfm'

const Markdown: React.FunctionComponent<any> = (props) => {
  return <ReactMarkdown remarkPlugins={[gfm]} {...props} />
}

export default Markdown
