import * as React from 'react'
import config from '../config.json'
import {FunctionComponent} from 'react'

type LogoProps = {
  className?: string
}

const Logo: FunctionComponent<LogoProps> = ({className}) => {
  return (
    <div
      className={`flex items-center space-x-2 font-fibra dark:hover:text-white hover:text-gray-900 sm:text-3xl text-2xl font-bold tracking-tight leading-tight transition-colors ease-in-out duration-100 ${className}`}
    >
      <span aria-hidden={true} className="font-medium font-sicret">
        {'/'}
      </span>
      <span className="text-xl">{config.title}</span>
    </div>
  )
}

export default Logo
