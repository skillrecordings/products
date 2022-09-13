import * as React from 'react'
import {FunctionComponent} from 'react'

const Main: FunctionComponent<React.PropsWithChildren<unknown>> = ({
  children,
}) => {
  return <div className="w-full flex flex-col grow p-5">{children}</div>
}

export default Main
