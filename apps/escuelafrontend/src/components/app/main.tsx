import * as React from 'react'
import {FunctionComponent} from 'react'

const Main: FunctionComponent = ({children}) => {
  return (
    <div className="flex flex-col min-h-screen p-5">
      <main className="flex flex-col justify-center flex-grow">{children}</main>
    </div>
  )
}

export default Main
