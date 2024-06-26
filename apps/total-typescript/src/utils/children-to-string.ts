import React from 'react'

export function childrenToString(children: React.ReactNode): any {
  return React.Children.toArray(children).reduce((str, child) => {
    if (typeof child === 'string') {
      return str + child
    }
    if (React.isValidElement(child) && child.props.children) {
      return str + childrenToString(child.props.children)
    }
    return str
  }, '')
}
