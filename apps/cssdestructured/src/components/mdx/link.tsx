import React from 'react'

const Link: React.FC<React.PropsWithChildren<any>> = (props) => {
  return (
    <a
      className="border-b-2 focus:ring-1 focus:ring-offset-2 focus:ring-offset-background focus:ring-brand-cream rounded-sm focus:outline-none border-brand-brightYellow border-opacity-75 hover:border-opacity-100 transition-all ease-in-out duration-300"
      {...props}
    >
      {props.children}
    </a>
  )
}

export {Link}
