/* Remember: 
sanity install @sanity/code-input
yarn add micromark 
*/
import {micromark} from 'micromark'
import {htmlToBlocks} from '@sanity/block-tools'

export async function handlePaste(input) {
  const {event, type, path} = input
  const text = event.clipboardData.getData('text/plain')

  if (text) {
    const html = micromark(text)

    if (html) {
      const blocks = htmlToBlocks(html, type, {
        rules: [
          {
            deserialize(el, next, block) {
              if (
                !el ||
                !el.children ||
                (el.tagName && el.tagName.toLowerCase() !== 'pre')
              ) {
                return undefined
              }
              const codeElement = el.children[0]
              const childNodes =
                codeElement && codeElement.tagName.toLowerCase() === 'code'
                  ? codeElement.childNodes
                  : el.childNodes
              let code = ''
              childNodes.forEach((node) => {
                code += '\n' + node.textContent + '\n'
              })
              const language =
                codeElement && codeElement.className
                  ? codeElement.className.replace('language-', '')
                  : ''
              return block({
                _type: 'code',
                language,
                code,
              })
            },
          },
        ],
      })
      // return an insert patch
      return {insert: blocks, path}
    }
  }
}
