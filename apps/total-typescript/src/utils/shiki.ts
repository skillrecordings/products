import {getHighlighter} from 'shiki'

export const codeToHtml = async ({
  code,
  language,
}: {
  code: string
  language: string
}) => {
  const highlighter = await getHighlighter({
    themes: ['github-dark'],
  })

  return highlighter.codeToHtml(code, {
    lang: language,
  })
}
