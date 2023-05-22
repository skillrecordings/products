import {remarkCodeHike} from '@code-hike/mdx'
import {type MDXRemoteSerializeResult} from 'next-mdx-remote'
import {serialize} from 'next-mdx-remote/serialize'
import defaultTheme from 'shiki/themes/github-dark.json'

/**
 * Serialize MDX with next-mdx-remote. Uses remark-code-hike for syntax highlighting.
 * @param {string} text - The text to serialize
 * @param {object} options - The options to pass to the remarkCodeHike plugin
 * @param {ShikiTheme} options.theme - The theme to use for syntax highlighting, defaults to `github-dark`
 * @param {boolean} options.lineNumbers - Whether to render line numbers, defaults to `false`
 * @param {boolean} options.showCopyButton - Whether to render a copy button, defaults to `false`
 * @see themes https://github.com/shikijs/shiki/blob/main/docs/themes.md
 * @returns {Promise<MDXRemoteSerializeResult>} The serialized MDX
 * @example
 * const mdx = await serializeMDX('# Hello World')
 * // <h1>Hello World</h1>
 * @example
 * const mdx = await serializeMDX('# Hello World', {theme: 'github-light', lineNumbers: true, showCopyButton: true})
 */

const serializeMDX = async (
  text: string,
  {
    theme,
    lineNumbers,
    showCopyButton,
  }: {theme?: ShikiTheme; lineNumbers?: boolean; showCopyButton?: boolean} = {},
): Promise<MDXRemoteSerializeResult> => {
  const mdxContent = await serialize(text, {
    mdxOptions: {
      useDynamicImport: true,
      remarkPlugins: [
        [
          remarkCodeHike,
          {
            theme: theme ? require(`shiki/themes/${theme}.json`) : defaultTheme,
            autoImport: false,
            lineNumbers,
            showCopyButton,
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
