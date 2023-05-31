import type {Transformer} from 'unified'
import {createShikiHighlighter, renderCodeToHTML} from 'shiki-twoslash'

interface MarkdownNode {
  type: string
  children?: MarkdownNode[]
}

interface CodeNode extends MarkdownNode {
  value: string
  lang: string
  meta: string | null
}

const visitCodeNodes = async (
  node: MarkdownNode,
  transformer: (node: CodeNode) => Promise<void>,
) => {
  if (node.type === 'code') {
    await transformer(node as CodeNode)
  }

  if (node.children) {
    for (const child of node.children) {
      await visitCodeNodes(child, transformer)
    }
  }
}

export interface ShikiRemotePluginOptions {
  endpoint: string
  authorization: string
  theme?: string
}

type Highlighter = Awaited<ReturnType<typeof createShikiHighlighter>>

let highlighter: Highlighter | undefined = undefined

export function shikiRemotePlugin(opts: ShikiRemotePluginOptions): Transformer {
  return async (ast) => {
    await visitCodeNodes(ast, async (node) => {
      const code = node.value

      if (!highlighter) {
        highlighter = await createShikiHighlighter({
          theme: opts.theme || 'dark-plus',
        })
      }

      /**
       * We only need to call the remote service when necessary:
       * when 'twoslash' is specified in the code fence. Otherwise,
       * we can just run renderCodeToHTML which just acts like a
       * normal syntax highlighter without twoslash's magic powers.
       */
      if (!node.meta?.includes('twoslash')) {
        const html = await renderCodeToHTML(
          code,
          node.lang,
          {},
          {
            themeName: opts.theme || 'dark-plus',
          },
          highlighter,
        )

        node.type = 'html'
        node.value = html
        node.children = []

        return
      }

      try {
        const response = await fetch(opts.endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: opts.authorization,
          },
          body: JSON.stringify({
            code,
            lang: node.lang,
            meta: node.meta,
            theme: opts.theme,
          }),
        })

        if (response.ok) {
          node.type = 'html'
          node.value = await response.text()
          node.children = []
        } else {
          console.error(await response.text())
        }
      } catch (e) {
        console.error(e)
      }
    })
  }
}
