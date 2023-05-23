import remarkShikiTwoslash, {type Options} from 'remark-shiki-twoslash'
import {type MDXRemoteSerializeResult} from 'next-mdx-remote'
import defaultTheme from 'shiki/themes/github-dark.json'
import {serialize} from 'next-mdx-remote/serialize'
import {remarkCodeHike} from '@code-hike/mdx'
import {nodeTypes} from '@mdx-js/mdx'
import rehypeRaw from 'rehype-raw'

/**
 * Serialize MDX with next-mdx-remote. Uses Code Hike or Shiki Twoslash for syntax highlighting.
 * @param {string} text - The text to serialize
 * @param {object} options - The options object
 * @param {scope} options.scope - Pass-through variables for use in the MDX content
 * @param {SyntaxHighlighter} options.syntaxHighlighter - Choose between `code-hike` or `shiki-twoslash`, defaults to `code-hike`
 * @param {ShikiTwoslashPluginOptions} options.shikiTwoslashPluginOptions - Shiki Twoslash options
 * @param {CodeHikePluginOptions} options.codeHikePluginOptions - Code Hike options
 * @param {ShikiTheme} options.highlighterOptions.theme - The theme to use for syntax highlighting, defaults to `github-dark`
 * @see themes Shiki themes https://github.com/shikijs/shiki/blob/main/docs/themes.md
 * @returns {Promise<MDXRemoteSerializeResult>} The serialized MDX
 * @example
 * const mdx = await serializeMDX('# Hello World')
 * // <h1>Hello World</h1>
 * @example
 * const mdx = await serializeMDX('# Hello World', {theme: 'github-light', lineNumbers: true, showCopyButton: true})
 */

type SerializeMDXProps = {
  scope?: Record<string, unknown>
  syntaxHighlighter?: SyntaxHighlighter
  shikiTwoslashPluginOptions?: ShikiTwoslashPluginOptions
  codeHikePluginOptions?: CodeHikePluginOptions
}

type SyntaxHighlighter = 'code-hike' | 'shiki-twoslash'

type CodeHikePluginOptions = {
  theme?: ShikiTheme
  lineNumbers?: boolean
  showCopyButton?: boolean
}

type ShikiTwoslashPluginOptions = {
  theme?: ShikiTheme
} & Options

const serializeMDX = async (
  text: string,
  {
    scope,
    syntaxHighlighter,
    shikiTwoslashPluginOptions,
    codeHikePluginOptions,
  }: SerializeMDXProps = {},
): Promise<MDXRemoteSerializeResult> => {
  const highlighterOptions =
    syntaxHighlighter === 'code-hike'
      ? codeHikePluginOptions
      : shikiTwoslashPluginOptions

  const theme = highlighterOptions?.theme
    ? require(`shiki/themes/${highlighterOptions.theme}.json`)
    : defaultTheme

  const lineNumbers =
    highlighterOptions && 'lineNumbers' in highlighterOptions
      ? highlighterOptions.lineNumbers
      : false

  const showCopyButton =
    highlighterOptions && 'showCopyButton' in highlighterOptions
      ? highlighterOptions.showCopyButton
      : false

  const mdxContent = await serialize(text, {
    scope: scope ? scope : undefined,
    mdxOptions: {
      useDynamicImport: true,
      rehypePlugins: [[rehypeRaw, {passThrough: nodeTypes}]],
      remarkPlugins: [
        syntaxHighlighter === 'code-hike'
          ? [
              remarkCodeHike,
              {
                theme,
                lineNumbers,
                showCopyButton,
                ...highlighterOptions,
              },
            ]
          : [
              remarkShikiTwoslash,
              {
                theme,
                ...highlighterOptions,
              },
            ],
      ],
    },
  })
  return mdxContent
}

export default serializeMDX

type ShikiTheme =
  | 'css-variables'
  | 'dark-plus'
  | 'dracula-soft'
  | 'dracula'
  | 'github-dark-dimmed'
  | 'github-dark'
  | 'github-light'
  | 'hc_light'
  | 'light-plus'
  | 'material-theme-darker'
  | 'material-theme-lighter'
  | 'material-theme-ocean'
  | 'material-theme-palenight'
  | 'material-theme'
  | 'min-dark'
  | 'min-light'
  | 'monokai'
  | 'nord'
  | 'one-dark-pro'
  | 'poimandres'
  | 'rose-pine-dawn'
  | 'rose-pine-moon'
  | 'rose-pine'
  | 'slack-dark'
  | 'slack-ochin'
  | 'solarized-dark'
  | 'solarized-light'
  | 'vitesse-dark'
  | 'vitesse-light'
