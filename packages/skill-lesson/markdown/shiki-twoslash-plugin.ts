import {Highlighter, getHighlighter} from 'shiki'
import type {Transformer} from 'unified'
import defaultTheme from './vs-dark-theme.json'

import {createTransformerFactory, rendererClassic} from '@shikijs/twoslash/core'
import {codeToHtml} from 'shiki'
import {createTwoslashFromCDN} from 'twoslash-cdn'
import {createStorage} from 'unstorage'

const storage = createStorage()

const twoslash = createTwoslashFromCDN({
  storage,
  compilerOptions: {
    lib: ['dom', 'dom.iterable', 'esnext'],
    target: 99 /* ESNext */,
    strict: true,
    isolatedModules: true,
  },
})

const transformerTwoslash = createTransformerFactory(twoslash.runSync)({
  renderer: rendererClassic(),
  throws: false,
  twoslashOptions: {
    compilerOptions: {
      lib: ['dom', 'dom.iterable', 'esnext'],
    },
  },
})

interface MarkdownNode {
  type: string
  name?: string
  children?: MarkdownNode[]
}

interface CodeNode extends MarkdownNode {
  value: string
  lang: string | null
  meta: string | null
}

const NODES_TO_ABORT = ['Editor', 'TranspilePreview']

const visitCodeNodes = async (
  node: MarkdownNode,
  transformer: (node: CodeNode) => Promise<void>,
) => {
  /**
   * Abort if the wrapping node is an Editor component
   */
  if (
    node.type === 'mdxJsxFlowElement' &&
    node.name &&
    NODES_TO_ABORT.includes(node.name)
  ) {
    return
  }

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

let highlighter: Highlighter | undefined = undefined

const prepHighlighter = async (theme: string | undefined) => {
  if (!highlighter) {
    highlighter = await getHighlighter({
      themes: [theme ? theme : defaultTheme],
      langs: ['typescript'],
    })
  }
}

const CUT_REGEX = /\/\/ ---cut---\n\n/g

export function shikiTwoslashPlugin(
  opts: ShikiRemotePluginOptions,
): Transformer {
  return async (ast) => {
    await visitCodeNodes(ast, async (node) => {
      const code = node.value

      try {
        /**
         * We only need to call the remote service when necessary:
         * when 'twoslash' is specified in the code fence. Otherwise,
         * we can just use shiki
         */
        if (!node.meta?.includes('twoslash')) {
          await prepHighlighter(opts.theme)
          const html = highlighter!.codeToHtml(code, {
            lang: node.lang ?? 'typescript',
            theme: opts.theme || defaultTheme,
          })

          node.type = 'html'
          node.value = html
          node.children = []

          return
        }
      } catch (e) {
        console.error('Local shiki failed, falling back to remote')
        console.error(e)
      }

      const newCode = code.replace(CUT_REGEX, ['// ---cut---', ''].join('\n'))

      await twoslash.prepareTypes(newCode)
      const html = await codeToHtml(newCode, {
        lang: node.lang ?? 'typescript',
        theme: opts.theme || defaultTheme,
        transformers: [transformerTwoslash as any],
      })

      node.type = 'html'
      node.value = html
      node.children = []
    })
  }
}
