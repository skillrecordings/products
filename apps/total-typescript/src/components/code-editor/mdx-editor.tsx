import Image from 'next/image'
import {useState} from 'react'
import type {CodeEditorProps, Language} from './code-editor'
import {LazyLoadedEditor} from './lazy-loaded-editor'
import tsSvg from './ts-logo.svg'
import jsSvg from './js-logo.svg'

const getHeight = (code: string) => {
  return (code.split('\n').length + 3) * 24
}

const extractCodeAndLanguage = (props: {children?: any}) => {
  const code = props.children?.props?.children?.props?.children
  let language = props.children?.props?.children?.props?.className

  if (!code || !language) {
    return null
  }

  language = language.replace('language-', '') as Language

  return {code, language}
}

export const MDXEditor = (props: {children?: any}) => {
  // Yes, we're diving into React's internals to grab the
  // code from the <pre> element
  const extracted = extractCodeAndLanguage(props)

  if (!extracted) {
    return null
  }

  const {code, language} = extracted

  return (
    <div
      className="my-10 h-72 rounded bg-[#1e2632] py-6"
      style={{
        height: getHeight(code),
      }}
    >
      <LazyLoadedEditor code={code} language={language} />
    </div>
  )
}

export const MDXTranspilePreview = (props: {children?: any}) => {
  const extracted = extractCodeAndLanguage(props)
  const [jsCode, setJsCode] = useState<string | undefined>(undefined)

  if (!extracted) {
    return null
  }

  const {code, language} = extracted

  return (
    <div className="not-prose my-10  grid grid-cols-1 gap-2   md:grid-cols-2">
      <div className="relative h-60 rounded bg-[#1e2632] py-6 md:h-72">
        <LazyLoadedEditor
          code={code}
          language={language}
          onEmittedJavaScript={setJsCode}
          fontSize={16}
        />
        <div className="absolute bottom-6 left-6 flex items-center space-x-3 rounded bg-gray-700 pr-3">
          <Image src={tsSvg} alt="TypeScript Logo" className="size-7 rounded" />
          <span className="text-xs text-gray-100">TypeScript Code</span>
        </div>
      </div>
      <div className="relative h-60 rounded bg-[#1e2632] py-6 md:h-72">
        <LazyLoadedEditor
          code={jsCode ?? ''}
          language="js"
          readonly
          fontSize={12}
        />
        <div className="absolute bottom-6 left-6 flex items-center space-x-3 rounded bg-gray-700 pr-3">
          <Image src={jsSvg} alt="JavaScript Logo" className="size-7 rounded" />
          <span className="text-xs text-gray-100">Emitted JavaScript</span>
        </div>
      </div>
    </div>
  )
}
