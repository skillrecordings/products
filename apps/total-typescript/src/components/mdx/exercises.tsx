import {cn} from '@skillrecordings/ui/utils/cn'
import React, {ReactNode, useEffect, useState} from 'react'
import {AnimatePresence, LayoutGroup, motion} from 'framer-motion'
import {
  Blue,
  CodeLine,
  Green,
  Orange,
  SingleLineObjectProperty,
} from './code-elements'

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
            'inline-block overflow-hidden rounded bg-gray-700 p-6 px-8',
            props.className,
          )}
        >
          {props.children}
        </motion.div>
      </motion.div>
    </LayoutGroup>
  )
}

const ObjectType = (props: {keys: string[]; typeName: string}) => {
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
              key={key}
              propKey={key}
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

const RangeInput = (props: {
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

const useDelayedState = <T,>(initialState: T, delay: number) => {
  const [currentState, setState] = useState(initialState)
  const [delayedState, setDelayedState] = useState(initialState)

  const timeoutRef = React.useRef<NodeJS.Timeout>()

  useEffect(() => {
    clearTimeout(timeoutRef.current)

    timeoutRef.current = setTimeout(() => {
      setDelayedState(currentState)
    }, delay)
    return () => {
      clearTimeout(timeoutRef.current)
    }
  }, [currentState, delay])

  return {
    delayedValue: delayedState,
    currentValue: currentState,
    set: setState,
  }
}

const StringUnion = (props: {members: string[]}) => {
  return (
    <AnimatePresence mode="popLayout">
      {props.members.map((key, index, array) => (
        <motion.span
          key={key}
          animate={{
            opacity: 1,
          }}
          initial={{opacity: 0}}
          exit={{opacity: 0}}
        >
          <Orange>"{key}"</Orange>
          <AnimatePresence mode="popLayout">
            {index === array.length - 1 ? null : (
              <motion.span
                key={`pipe_${key}`}
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
    </AnimatePresence>
  )
}

const TypeHelperAndVariable = (props: {
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

export const OmitExample = () => {
  const numOfKeys = useDelayedState(3, 300)
  const numOfKeysToOmit = useDelayedState(1, 300)

  const possibleKeys = ['a', 'b', 'c', 'd']

  const keys = possibleKeys.slice(0, numOfKeys.delayedValue)

  const keysToOmit = possibleKeys.slice(0, numOfKeysToOmit.delayedValue)

  return (
    <div className="not-prose flex flex-col rounded bg-gray-800 text-base">
      <LayoutGroup>
        <Box className="flex justify-center space-x-12 bg-gray-700 p-6">
          <RangeInput
            label="Number of keys"
            onChange={(value) => {
              numOfKeys.set(value)
            }}
            value={numOfKeys.currentValue}
            min={1}
            max={4}
          ></RangeInput>
          <RangeInput
            label="Number of keys to Omit"
            onChange={(value) => {
              numOfKeysToOmit.set(value)
            }}
            value={numOfKeysToOmit.currentValue}
            min={1}
            max={3}
          />
        </Box>

        <motion.div layout className="space-y-8 p-10 px-12">
          <LayoutGroup>
            <ObjectType typeName="Input" keys={keys}></ObjectType>
            <motion.div layout>
              <TypeHelperAndVariable
                typeName="Omit"
                variableName="Result"
                arguments={[
                  {
                    key: 'Input',
                    node: <Green>Input</Green>,
                  },
                  {
                    key: 'Union',
                    node: <StringUnion members={keysToOmit} />,
                  },
                ]}
              ></TypeHelperAndVariable>
              <HighlightBox className="">
                <ObjectType
                  typeName="Result"
                  keys={keys.filter((key) => !keysToOmit.includes(key))}
                ></ObjectType>
              </HighlightBox>
            </motion.div>
          </LayoutGroup>
        </motion.div>
      </LayoutGroup>
    </div>
  )
}

export const InputBox = (props: {children?: React.ReactNode}) => {
  return (
    <Box className="flex justify-center space-x-12 bg-gray-700 p-6">
      {props.children}
    </Box>
  )
}

export const PickExample = () => {
  const numOfKeys = useDelayedState(3, 300)
  const numOfKeysToPick = useDelayedState(1, 300)

  const possibleKeys = ['a', 'b', 'c', 'd']

  const keys = possibleKeys.slice(0, numOfKeys.delayedValue)

  const keysToPick = possibleKeys.slice(0, numOfKeysToPick.delayedValue)

  return (
    <div className="not-prose flex flex-col rounded bg-gray-800 text-base">
      <LayoutGroup>
        <InputBox>
          <RangeInput
            label="Input Keys"
            onChange={(value) => {
              numOfKeys.set(value)
            }}
            value={numOfKeys.currentValue}
            min={1}
            max={4}
          ></RangeInput>
          <RangeInput
            label="Keys To Pick"
            onChange={(value) => {
              numOfKeysToPick.set(value)
            }}
            value={numOfKeysToPick.currentValue}
            min={1}
            max={4}
          />
        </InputBox>

        <motion.div layout className="space-y-8 p-10 px-12">
          <ObjectType typeName="Input" keys={keys}></ObjectType>
          <div>
            <TypeHelperAndVariable
              typeName="Pick"
              variableName="Result"
              arguments={[
                {
                  key: 'Input',
                  node: <Green>Input</Green>,
                },
                {
                  key: 'Union',
                  node: (
                    <>
                      <div className="relative inline-block">
                        <AnimatePresence>
                          {keysToPick.length > keys.length && (
                            <motion.div
                              animate={{
                                opacity: 1,
                              }}
                              exit={{
                                opacity: 0,
                              }}
                              initial={{
                                opacity: 0,
                              }}
                              className="absolute bottom-[-2px] z-20 block h-1 w-full rounded bg-red-500"
                            />
                          )}
                        </AnimatePresence>
                        <StringUnion members={keysToPick} />
                      </div>
                    </>
                  ),
                },
              ]}
            ></TypeHelperAndVariable>

            <HighlightBox className="">
              <ObjectType
                typeName="Result"
                keys={keys.filter((key) => keysToPick.includes(key))}
              ></ObjectType>
            </HighlightBox>
          </div>
        </motion.div>
      </LayoutGroup>
    </div>
  )
}

export {}
