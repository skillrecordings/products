import React from 'react'

const Li: React.FC<any> = (props) => {
  return <li className="before:bg-transparent">{props.children}</li>
}

export {Li}
