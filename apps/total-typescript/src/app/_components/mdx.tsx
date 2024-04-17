import {codeToHtml} from '@/utils/shiki'
import type {MergeComponents} from '@mdx-js/react/lib'
import type {MDXComponents} from 'mdx/types'

export const mdxComponents = {
  pre: async (props: any) => {
    const children = props?.children.props.children
    const language =
      props?.children.props.className?.split('-')[1] || 'typescript'

    try {
      const html = await codeToHtml({
        code: children,
        language,
      })
      return <div dangerouslySetInnerHTML={{__html: html}} />
    } catch (error) {
      console.error(error)
      return <pre {...props} />
    }
  },
} as MDXComponents | MergeComponents
