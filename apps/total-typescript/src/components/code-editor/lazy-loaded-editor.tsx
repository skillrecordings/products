import React from 'react'
import type {Language} from './code-editor'

export const LazyLoadedEditor = React.lazy(() =>
  import('./code-editor').then((res) => {
    return {
      default: res.EagerlyLoadedEditor,
    }
  }),
)

export const MDXEditor = (props: {
  language?: Language
  code: string
  children?: React.ReactNode
}) => {
  return <LazyLoadedEditor language={props.language} code={props.code} />
}

export const EditorTest = () => {
  return <LazyLoadedEditor language="ts" code={`const wow = () => {}`} />
}
