import {useState} from 'react'
import {CodeEditorProps, EagerlyLoadedEditor} from './code-editor'
import tsSvg from './ts-logo.svg'
import jsSvg from './js-logo.svg'
import Image from 'next/image'

export const EagerlyLoadedTranspilePreview = (
  props: Omit<CodeEditorProps, 'onEmittedJavaScript'>,
) => {
  const [code, setCode] = useState<string | undefined>(undefined)

  return (
    <div className="not-prose my-10  grid grid-cols-1 gap-2   md:grid-cols-2">
      <div className="relative h-60 rounded bg-[#1e2632] py-6 md:h-72">
        <EagerlyLoadedEditor
          {...props}
          onEmittedJavaScript={setCode}
          fontSize={16}
        />
        <div className="absolute bottom-6 left-6 flex items-center space-x-3 rounded bg-gray-700 pr-3">
          <Image src={tsSvg} alt="TypeScript Logo" className="size-7 rounded" />
          <span className="text-xs text-gray-100">TypeScript Code</span>
        </div>
      </div>
      <div className="relative h-60 rounded bg-[#1e2632] py-6 md:h-72">
        <EagerlyLoadedEditor
          code={code ?? ''}
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
