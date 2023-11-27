import {cn} from '@skillrecordings/ui/utils/cn'
import {AnimatePresence, LayoutGroup, motion} from 'framer-motion'
import React, {ReactNode} from 'react'

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
  optional: boolean
  readonly: boolean
}) => {
  return (
    <CodeLine>
      {`  `}
      {props.readonly && <Blue>readonly </Blue>}
      <Sky>{props.propKey}</Sky>
      {`${props.optional ? '?' : ''}`}: {props.value}
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

export const LightGreen = (props: {
  children?: React.ReactNode
  className?: string
}) => {
  return (
    <span className={cn('text-emerald-200', props.className)}>
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

export const DarkGreen = (props: {
  children?: React.ReactNode
  className?: string
}) => {
  return (
    <span className={cn('text-green-600', props.className)}>
      {props.children}
    </span>
  )
}

export const RangeInput = (props: {
  label: string
  onChange: (value: number) => void
  value: number
  min: number
  max: number
}) => {
  return (
    <label className="flex flex-col items-center space-y-2">
      <span className="block">{props.label}</span>
      <input
        type="range"
        step={1}
        max={props.max}
        min={props.min}
        className="w-48"
        onChange={(e) => {
          props.onChange(parseInt(e.target.value))
        }}
        value={props.value}
      />
    </label>
  )
}

export const Box = (props: {
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
}) => {
  return (
    <div className={cn(props.className, 'overflow-hidden')}>
      {props.children}
    </div>
  )
}

export const HighlightBox = (props: {
  children?: React.ReactNode
  className?: string
}) => {
  return (
    <LayoutGroup>
      <motion.div layout className="mt-1">
        <svg
          height="12"
          width="16"
          className="ml-16 fill-current text-gray-700"
        >
          <polygon points="8,0 16,12 0,12" />
        </svg>
        <motion.div
          layout
          className={cn(
            'block overflow-hidden rounded bg-gray-700 p-6 px-8',
            props.className,
          )}
        >
          {props.children}
        </motion.div>
      </motion.div>
    </LayoutGroup>
  )
}

export const ObjectTypeOfStrings = (props: {
  keys: {key: string; optional?: boolean; readonly?: boolean}[]
  typeName: string
}) => {
  return (
    <motion.div layout>
      <AnimatePresence>
        <CodeLine key="line">
          <Blue>type</Blue> <Green>{props.typeName}</Green> = {`{`}
          <AnimatePresence mode="popLayout">
            {props.keys.length === 0 && (
              <motion.span layout>{`};`}</motion.span>
            )}
          </AnimatePresence>
        </CodeLine>
        {props.keys.map((key) => {
          return (
            <SingleLineObjectProperty
              key={JSON.stringify(key)}
              propKey={key.key}
              readonly={!!key.readonly}
              optional={!!key.optional}
              value={
                <>
                  <Green>string</Green>;
                </>
              }
            ></SingleLineObjectProperty>
          )
        })}
        {props.keys.length > 0 && <CodeLine key="end">{`};`}</CodeLine>}
      </AnimatePresence>
    </motion.div>
  )
}

export const StringUnion = (props: {members: string[]}) => {
  return (
    <Union
      members={props.members.map((mem) => ({
        element: <Orange>"{mem}"</Orange>,
        key: mem,
      }))}
    />
  )
}

export type UnionMember = {
  element: React.ReactNode
  key: React.Key
}

export const Union = (props: {
  members: UnionMember[]
  fallback?: React.ReactNode
}) => {
  const fallback = props.fallback ?? <Blue>never</Blue>
  return (
    <AnimatePresence mode="popLayout">
      {props.members.map((member, index, array) => (
        <motion.span
          key={member.key}
          animate={{
            opacity: 1,
          }}
          initial={{opacity: 0}}
          exit={{opacity: 0}}
        >
          {member.element}
          <AnimatePresence mode="popLayout">
            {index === array.length - 1 ? null : (
              <motion.span
                key={`pipe_${member}`}
                animate={{
                  opacity: 1,
                }}
                initial={{opacity: 0}}
                exit={{opacity: 0}}
              >{` | `}</motion.span>
            )}
          </AnimatePresence>
        </motion.span>
      ))}
      {props.members.length === 0 && (
        <motion.span
          key={`never`}
          animate={{
            opacity: 1,
          }}
          initial={{opacity: 0}}
          exit={{opacity: 0}}
        >
          {fallback}
        </motion.span>
      )}
    </AnimatePresence>
  )
}

export const TypeHelperAndVariable = (props: {
  variableName: string
  typeName: string
  arguments: {node: ReactNode; key: string}[]
}) => {
  return (
    <CodeLine>
      <Blue>type</Blue> <Green>{props.variableName}</Green>
      {` = `}
      <Green>{props.typeName}</Green>
      {`<`}
      <AnimatePresence>
        {props.arguments.map((arg, index, array) => {
          return (
            <React.Fragment key={arg.key}>
              {arg.node}
              <AnimatePresence mode="popLayout">
                {index === array.length - 1 ? null : (
                  <motion.span
                    key={`comma_${arg.key}`}
                    animate={{
                      opacity: 1,
                    }}
                    initial={{opacity: 0}}
                    exit={{opacity: 0}}
                  >{`, `}</motion.span>
                )}
              </AnimatePresence>
            </React.Fragment>
          )
        })}
      </AnimatePresence>
      {`>;`}
    </CodeLine>
  )
}

export const InputBox = (props: {children?: React.ReactNode}) => {
  return (
    <Box className="flex justify-center space-x-12 bg-gray-700 p-6">
      {props.children}
    </Box>
  )
}

export const Checkboxes = (props: {
  label: string
  checkboxes: {
    value: string
    label: React.ReactNode
    checked: boolean
  }[]
  onChange: (value: (current: string[]) => string[]) => void
}) => {
  return (
    <div>
      <p className="mb-1 text-center">{props.label}</p>
      <div className="flex items-center space-x-4">
        {props.checkboxes.map((checkbox) => {
          return (
            <label key={checkbox.value} className="flex items-center space-x-2">
              <input
                type="checkbox"
                value={checkbox.value}
                checked={checkbox.checked}
                onChange={(e) => {
                  if (e.target.checked) {
                    props.onChange((current) => [...current, checkbox.value])
                  } else {
                    props.onChange((current) =>
                      current.filter((c) => c !== checkbox.value),
                    )
                  }
                }}
              ></input>
              <span>{checkbox.label}</span>
            </label>
          )
        })}
      </div>
    </div>
  )
}
