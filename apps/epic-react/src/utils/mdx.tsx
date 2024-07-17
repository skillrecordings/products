import React from 'react'
import {visit} from 'unist-util-visit'
import {type Element, type Root as HastRoot} from 'hast'
import {cn} from '@skillrecordings/ui/utils/cn'

export function trimCodeBlocks() {
  return async function transformer(tree: HastRoot) {
    visit(tree, 'element', (preNode: Element) => {
      if (preNode.tagName !== 'pre' || !preNode.children.length) {
        return
      }
      const codeNode = preNode.children[0]
      if (
        !codeNode ||
        codeNode.type !== 'element' ||
        codeNode.tagName !== 'code'
      ) {
        return
      }
      const [codeStringNode] = codeNode.children
      if (!codeStringNode) return

      if (codeStringNode.type !== 'text') {
        console.warn(
          `trimCodeBlocks: Unexpected: codeStringNode type is not "text": ${codeStringNode.type}`,
        )
        return
      }
      codeStringNode.value = codeStringNode.value.trimEnd()
    })
  }
}

export function removePreContainerDivs() {
  return async function preContainerDivsTransformer(tree: HastRoot) {
    visit(
      tree,
      {type: 'element', tagName: 'pre'},
      function visitor(node, index, parent) {
        if (parent?.type !== 'element') return
        if (parent.tagName !== 'div') return
        if (parent.children.length !== 1 && index === 0) return
        Object.assign(parent, node)
      },
    )
  }
}

type DataProps = {
  'data-buttons'?: string
  'data-filename'?: string
  'data-fullpath'?: string
  'data-nocopy'?: string
  'data-sep'?: string
  'data-start'?: string
  'data-type'?: string
}

const safePath = (s: string) => s.replace(/\\/g, '/')

function getRelativePath(file: string, separator?: string, type?: string) {
  const [, relativePath] = file
    .replace(/\\|\//g, separator ?? '/')
    .split(`${type === 'playground' ? 'example' : 'exercises'}${separator}`)
  return relativePath
}

export function PreWithButtons({children, ...props}: any) {
  const {
    'data-buttons': buttons,
    'data-filename': filename,
    'data-fullpath': fullPath,
    'data-nocopy': hideCopyButton,
    'data-sep': separator,
  } = props as DataProps
  const showCopyButton = hideCopyButton === undefined

  function updateFilename() {
    if (fullPath && separator) {
      if (!filename || filename.includes('..')) {
        return {'data-filename': getRelativePath(fullPath, separator)}
      } else {
        return {'data-filename': filename.replace(/\//g, separator)}
      }
    }
  }

  return (
    <div className="group prose relative max-w-none sm:prose-lg">
      <div className="absolute right-0 top-2 z-50 m-2 flex items-baseline justify-end gap-4 opacity-0 transition duration-300 ease-in-out focus-within:opacity-100 group-hover:opacity-100">
        {buttons ? <OpenInEditor {...props} /> : null}
        {showCopyButton ? CopyButton() : null}
      </div>
      <pre
        {...props}
        className={cn(
          'scrollbar-thumb-scrollbar scrollbar-thin scrollbar-track-foreground/5 scrollbar-thumb-foreground/10',
          props.className ?? '',
        )}
        {...updateFilename()}
      >
        {children}
      </pre>
    </div>
  )
}

function OpenInEditor({
  'data-buttons': buttons,
  'data-filename': filename,
  'data-fullpath': fullPath,
  'data-sep': separator,
  'data-start': start,
  'data-type': type,
}: DataProps) {
  // const data = useLoaderData<typeof loader>()
  const KCDSHOP_DEPLOYED = false

  if (type === 'other' || !buttons || !filename || !fullPath) return null

  // const currentAppFullPath = safePath(data[data.type]?.fullPath ?? '')
  // const isFileFromDifferentApp = !fullPath.startsWith(currentAppFullPath)
  const validButtons = KCDSHOP_DEPLOYED
    ? (['problem', 'solution'] as const)
    : (['problem', 'solution', 'playground'] as const)
  const buttonList = buttons.split(',')
  const apps = validButtons.filter((button) =>
    buttonList.includes(button),
  ) as (typeof validButtons)[number][]

  return (
    <span
      className="line-through opacity-50"
      title="Only supported in Workshop App"
    >
      Open in editor
    </span>
  )
}

function CopyButton(): React.ReactNode {
  const [copied, setCopied] = React.useState(false)
  const buttonClassName =
    'border-border hover:bg-foreground/20 active:bg-foreground/30 text-foreground box-content block rounded border-2 px-2 py-0.5 font-mono text-xs font-semibold outline-none transition duration-300 ease-in-out'

  React.useEffect(() => {
    if (copied) {
      const timeoutId = setTimeout(() => setCopied(false), 1500)
      return () => clearTimeout(timeoutId)
    }
  }, [copied])

  return (
    <button
      className={cn(buttonClassName, 'w-12 uppercase')}
      onClick={(event) => {
        setCopied(true)
        const button = event.currentTarget
        const code =
          button.parentElement?.parentElement?.querySelector('pre')
            ?.textContent || ''
        navigator.clipboard.writeText(code)
      }}
    >
      {copied ? 'copied' : 'copy'}
    </button>
  )
}
