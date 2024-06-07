import {Highlighter, getHighlighter} from 'shiki'
import type {Transformer} from 'unified'
import defaultTheme from './vs-dark-theme.json'

import {createTransformerFactory, rendererClassic} from '@shikijs/twoslash/core'
import {createTwoslashFromCDN} from 'twoslash-cdn'
import {createStorage} from 'unstorage'
import {codeToHtml} from 'shiki'
import type {CompilerOptions} from 'typescript'
import fsDriver from 'unstorage/drivers/fs'
import memoryDriver from 'unstorage/drivers/memory'
import path from 'path'

// CI is enabled on build, but not on rebuild.
const isRebuild = Boolean(process.env.CI)

const storage = createStorage({
  driver: isRebuild
    ? fsDriver({
        base: path.resolve(process.cwd(), '.twoslash-cache'),
      })
    : memoryDriver(),
})

const LANGS = ['typescript', 'ts', 'js', 'json', 'tsx', 'html', 'bash']

const compilerOptions: CompilerOptions = {
  target: 9 /* ES2022 */,
  strict: true,
  allowJs: true,
  checkJs: true,
  noEmit: true,
  module: 99 /* ESNext */,
  moduleResolution: 100 /* Bundler */,
  jsx: 2 /* React */,
}

const twoslash = createTwoslashFromCDN({
  storage,
  compilerOptions,
})

const transformerTwoslash = createTransformerFactory(twoslash.runSync)({
  renderer: rendererClassic(),
  throws: true,
  langs: LANGS,
  twoslashOptions: {
    compilerOptions,
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

export interface ShikiTwoslashPluginOptions {
  endpoint: string
  authorization: string
  theme?: string
}

let highlighter: Highlighter | undefined = undefined

const prepHighlighter = async (theme: string | undefined) => {
  if (!highlighter) {
    highlighter = await getHighlighter({
      themes: [theme ? theme : defaultTheme],
      langs: LANGS,
    })
  }
}

const CUT_REGEX = /\/\/ ---cut---\n\n/g

export function shikiTwoslashPlugin(
  opts: ShikiTwoslashPluginOptions,
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

      try {
        const newCode = code.replace(CUT_REGEX, ['// ---cut---', ''].join('\n'))

        await twoslash.prepareTypes(newCode)
        const html = await codeToHtml(newCode, {
          lang: node.lang ?? 'typescript',
          theme: opts.theme || defaultTheme,
          transformers: [transformerTwoslash],
        })

        node.type = 'html'
        node.value = html
        node.children = []
      } catch (e) {
        console.error('Failed to run twoslash')
        console.error(e)
      }
    })
  }
}
