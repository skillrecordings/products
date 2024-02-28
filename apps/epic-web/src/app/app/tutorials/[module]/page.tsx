import {getTutorial} from 'lib/tutorials'
import type React from 'react'

const ModulePage: React.FC<{
  params: {resource: string; module: string}
}> = async ({params}) => {
  const moduleLoader = getTutorial(params.module)
  const module = await moduleLoader

  return (
    <div>
      <h1>{module?.title}</h1>
    </div>
  )
}

export default ModulePage
