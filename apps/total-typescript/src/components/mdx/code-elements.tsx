import {cn} from '@skillrecordings/ui/utils/cn'
import {motion} from 'framer-motion'
import React from 'react'

export const CodeLine = (props: {children?: React.ReactNode}) => {
  return (
    <motion.pre
      layout
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
      }}
      initial={{opacity: 0}}
      className="m-0 overflow-visible p-0 text-gray-100"
    >
      {props.children}
    </motion.pre>
  )
}

export const SingleLineObjectProperty = (props: {
  propKey: string
  value: React.ReactNode
  delay?: number
}) => {
  return (
    <CodeLine delay={props.delay}>
      {`  `}
      <Sky>{props.propKey}</Sky>: {props.value}
    </CodeLine>
  )
}

export const Blue = (props: {
  children?: React.ReactNode
  className?: string
}) => {
  return (
    <span className={cn('text-blue-400', props.className)}>
      {props.children}
    </span>
  )
}

export const Sky = (props: {
  children?: React.ReactNode
  className?: string
}) => {
  return (
    <span className={cn('text-sky-300', props.className)}>
      {props.children}
    </span>
  )
}

export const Orange = (props: {
  children?: React.ReactNode
  className?: string
}) => {
  return (
    <span className={cn('text-orange-300', props.className)}>
      {props.children}
    </span>
  )
}

export const Green = (props: {
  children?: React.ReactNode
  className?: string
}) => {
  return (
    <span className={cn('text-green-400', props.className)}>
      {props.children}
    </span>
  )
}
