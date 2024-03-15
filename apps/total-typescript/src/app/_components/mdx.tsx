import {codeToHtml} from '@/utils/shiki'

export const mdxComponents = {
  pre: async (props: any) => {
    const children = props?.children.props.children
    const language =
      props?.children.props.className?.split('-')[1] || 'typescript'

    const html = await codeToHtml({
      code: children,
      language,
    })
    return <div dangerouslySetInnerHTML={{__html: html}} />
  },
}
