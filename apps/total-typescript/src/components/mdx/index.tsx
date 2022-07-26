import React from 'react'

export const MDXComponents = {
  TypeError: (props: TypeErrorProps) => <TypeError {...props} />,
  Topics: (props: TopicsProps) => <Topics {...props} />,
}

type TypeErrorProps = {
  children: React.ReactNode
  header?: React.ReactNode
}

const TypeError: React.FC<TypeErrorProps> = ({children, header}) => {
  return (
    <div className="max-w-2xl prose-p:max-w-none font-mono mx-auto bg-black/50 rounded-sm border border-gray-700/50 text-[70%] leading-normal first-of-type:prose-p:mt-0 last-of-type:prose-p:mb-0">
      {header && (
        <div className="px-5 py-3 border-b border-gray-800/50">{header}</div>
      )}
      <div className="not-prose px-5 py-4">{children}</div>
    </div>
  )
}

type TopicsProps = {
  children: React.ReactNode
  header?: React.ReactNode
}

const Topics: React.FC<TopicsProps> = ({children, header}) => {
  const childrenArr = React.Children.toArray(children)
  return (
    <div className="">
      <ul className="max-w-2xl">
        {childrenArr.map((children) => {
          return (
            <li className="relative before:absolute before:left-0 before:w-0.5 before:h-full before:bg-cyan-300/80 -ml-2 list-none">
              {children}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

// const str = 'name' as string

// const obj = {
//   str,
// }

// console.log(obj[str])
