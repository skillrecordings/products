import * as React from 'react'
import {FunctionComponent} from 'react'
import CodeBlock from 'components/code-block'
import {LoadedScript} from 'utils/types'

const ScriptDetail: FunctionComponent<
  React.PropsWithChildren<LoadedScript>
> = ({command, description, content, url, author, twitter, github}) => {
  let [origin, setOrigin] = React.useState('')
  React.useEffect(() => {
    setOrigin(window.location.origin)
  }, [])

  return (
    <div key={command}>
      <CodeBlock
        className="text-base font-mono"
        value={content}
        language="javascript"
      />
    </div>
  )
}

export default ScriptDetail
