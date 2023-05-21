import * as React from 'react'
import {MDXRemote, MDXRemoteSerializeResult} from 'next-mdx-remote'
import {CH} from '@code-hike/mdx/components'

const components = {CH}

/**
 * Renders compiled source from @skillrecordings/skill-lesson/markdown/serialize-mdx
 * with syntax highlighting and code-hike components.
 * @param {MDXRemoteSerializeResult} contents
 * @returns <MDXRemote components={components} {...contents} />
 */

const MDX: React.FC<{contents: MDXRemoteSerializeResult}> = ({contents}) => {
  return <MDXRemote components={components} {...contents} />
}

export default MDX
