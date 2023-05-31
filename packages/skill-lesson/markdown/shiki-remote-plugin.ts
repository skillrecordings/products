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

export function shikiRemotePlugin(): Transformer {
  return async (ast) => {
    await visitCodeNodes(ast, async (node) => {
      const code = node.value

      const endpoint = 'https://shiki-service.fly.dev/v1'

      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            code,
            lang: node.lang,
            meta: node.meta,
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
