import React from 'react'

export const MDXComponents = {
  TypeError: ({children}: TypeErrorProps) => <TypeError>{children}</TypeError>,
}

type TypeErrorProps = {
  children: React.ReactNode
}

const TypeError: React.FC<TypeErrorProps> = ({children}) => {
  return (
    <div className="not-prose font-mono sm:text-lg text-base p-5 border border-dashed text-red-500 border-red-500 max-w-screen-md mx-auto leading-loose">
      {children}
    </div>
  )
}
