import * as React from 'react'
import {FunctionComponent} from 'react'

const Main: FunctionComponent = ({children}) => {
  return (
    <div className="p-5 flex flex-col min-h-screen">
      <main className="flex-grow flex flex-col justify-center">{children}</main>
    </div>
  )
}

export default Main
