import * as React from 'react'
import {FunctionComponent} from 'react'

const Main: FunctionComponent = ({children}) => {
  return (
    <div
      className={`mx-auto flex w-full flex-grow flex-col px-4 py-8 sm:px-6 lg:px-8`}
    >
      {children}
    </div>
  )
}

export default Main
