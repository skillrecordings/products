import React from 'react'
import {BlockEditor} from 'sanity'
import {htmlToBlocks} from '@sanity/block-tools'
import {micromark} from 'micromark'

function formatCodeBlock(nodes) {
  let code = ''

  nodes.forEach((node, index) => {
    if (index === 0 && index === nodes.length - 1) {
      code += node.textContent
    } else if (index === 0) {
      code += node.textContent + '\n'
    } else if (index === nodes.length - 1) {
      code += '\n' + node.textContent
    } else {
      code += '\n' + node.textContent + '\n'
    }
  })

  return code
}

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

              const code = formatCodeBlock(childNodes)

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

export default class CommentBlockEditor extends React.PureComponent {
  render() {
    return <BlockEditor {...this.props} onPaste={handlePaste} />
  }
}

// function handlePaste(input) {
//   const {event, type, path} = input
//   const html = event.clipboardData.getData('text/html')
//   // check if schema has the code type
//   const hasCodeType = type.of.map(({name}) => name).includes('code')
//   if (!hasCodeType) {
//     console.log(
//       'Run `sanity install @sanity/code-input, and add `type: "code"` to your schema.',
//     )
//   }
//   if (html && hasCodeType) {
//     const blocks = htmlToBlocks(html, type, {
//       rules: [
//         {
//           deserialize(el, next, block) {
//             /**
//              *  `el` and `next` is DOM Elements
//              * learn all about them:
//              * https://developer.mozilla.org/en-US/docs/Web/API/Element
//              **/

//             if (
//               !el ||
//               !el.children ||
//               (el.tagName && el.tagName.toLowerCase() !== 'pre')
//             ) {
//               return undefined
//             }
//             const code = el.children[0]
//             const childNodes =
//               code && code.tagName.toLowerCase() === 'code'
//                 ? code.childNodes
//                 : el.childNodes
//             let text = ''
//             childNodes.forEach((node) => {
//               text += node.textContent
//             })
//             /**
//              * Return this as an own block (via block helper function),
//              * instead of appending it to a default block's children
//              */
//             return block({
//               _type: 'code',
//               code: text,
//             })
//           },
//         },
//       ],
//     })
//     // return an insert patch
//     return {insert: blocks, path}
//   }
//   return undefined
// }
