import React from 'react'
import type {Language} from './code-editor'

export const LazyLoadedEditor = React.lazy(() =>
  import('./code-editor').then((res) => {
    return {
      default: res.EagerlyLoadedEditor,
    }
  }),
)

export const MDXEditor = (props: {children?: any}) => {
  // Yes, we're diving into React's internals to grab the
  // code from the <pre> element
  const code = props.children?.props?.children?.props?.children

  if (!code) {
    return null
  }

  let language = props.children?.props?.children?.props?.className

  if (language) {
    language = language.replace('language-', '') as Language
  }

  return <LazyLoadedEditor code={code} language={language} />
}

export const EditorTest = () => {
  return <LazyLoadedEditor language="ts" code={`const wow = () => {}`} />
}
