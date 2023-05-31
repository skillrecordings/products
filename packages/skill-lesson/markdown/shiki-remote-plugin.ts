import type {Transformer} from 'unified'

interface MarkdownNode {
  type: string
  children?: MarkdownNode[]
}

interface CodeNode extends MarkdownNode {
  value: string
  lang: string
  meta: string
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

export function shikiRemotePlugin(opts: ShikiRemotePluginOptions): Transformer {
  return async (ast) => {
    await visitCodeNodes(ast, async (node) => {
      const code = node.value

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
