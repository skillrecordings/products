import React from 'react'
import type {CodeEditorProps} from './code-editor'

const _LazyLoadedEditor = React.lazy(() =>
  import('./code-editor').then((res) => {
    return {
      default: res.EagerlyLoadedEditor,
    }
  }),
)

const LoadWhenVisible = (props: {children: React.ReactNode}) => {
  const [isVisible, setIsVisible] = React.useState(false)

  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting)
    })

    observer.observe(ref.current!)

    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <div ref={ref} className="h-full">
      {isVisible ? props.children : null}
    </div>
  )
}

export const LazyLoadedEditor = (props: CodeEditorProps) => {
  return (
    <LoadWhenVisible>
      <_LazyLoadedEditor {...props} />
    </LoadWhenVisible>
  )
}
