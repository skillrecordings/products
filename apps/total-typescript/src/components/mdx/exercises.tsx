import {cn} from '@skillrecordings/ui/utils/cn'
import React, {useState} from 'react'

export const Box = (props: {
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
}) => {
  return (
    <div className={cn(props.className, 'overflow-hidden')} style={props.style}>
      {props.children}
    </div>
  )
}

export const HighlightBox = (props: {
  children?: React.ReactNode
  className?: string
}) => {
  return (
    <div className="mt-1">
      <svg height="12" width="16" className="ml-16 fill-current text-gray-700">
        <polygon points="8,0 16,12 0,12" />
      </svg>
      <div
        className={cn(
          'inline-block rounded bg-gray-700 p-6 px-8',
          props.className,
        )}
      >
        {props.children}
      </div>
    </div>
  )
}

export const Divider = () => {
  return (
    <div className="flex h-6 items-center justify-center bg-gray-900 text-4xl text-white"></div>
  )
}

type Input = {
  a: string
  b: string
}

const CodeLine = (props: {children?: React.ReactNode}) => {
  return <pre className="m-0 p-0 text-gray-100">{props.children}</pre>
}

const SingleLineObjectProperty = (props: {
  propKey: string
  value: React.ReactNode
}) => {
  return (
    <CodeLine>
      {`  `}
      <span className="text-sky-300">{props.propKey}</span>: {props.value}
    </CodeLine>
  )
}

const ObjectType = (props: {keys: string[]; typeName: string}) => {
  if (props.keys.length === 0) {
    return (
      <CodeLine>
        <span className="text-blue-400">type</span>{' '}
        <span className="text-green-300">{props.typeName}</span> = {`{};`}
      </CodeLine>
    )
  }
  return (
    <div>
      <CodeLine>
        <span className="text-blue-400">type</span>{' '}
        <span className="text-green-300">{props.typeName}</span> = {`{`}
      </CodeLine>
      {props.keys.map((key) => {
        return (
          <SingleLineObjectProperty
            propKey={key}
            value={
              <>
                <span className="text-green-300">string</span>;
              </>
            }
          ></SingleLineObjectProperty>
        )
      })}
      <CodeLine>{`};`}</CodeLine>
    </div>
  )
}

const EditableObjectType = (props: {
  numOfKeys: number
  setNumOfKeys: React.Dispatch<React.SetStateAction<number>>
  keyNames: string[]
  typeName: string
}) => {
  return (
    <div>
      <CodeLine>
        <span className="text-blue-400">type</span>{' '}
        <span className="text-green-300">{props.typeName}</span> = {`{`}
      </CodeLine>
      {Array.from({length: props.numOfKeys}).map((_, i) => {
        return (
          <SingleLineObjectProperty
            propKey={props.keyNames[i]}
            value={
              <>
                <span className="text-green-300">string</span>;
              </>
            }
          ></SingleLineObjectProperty>
        )
      })}
      <div className="ml-5 mt-2 inline-block overflow-hidden rounded bg-gray-700">
        {props.numOfKeys > 0 && (
          <button
            onClick={() => {
              props.setNumOfKeys(props.numOfKeys - 1)
            }}
            className="inline-flex h-full w-8 items-center justify-center hover:bg-gray-600"
          >
            -
          </button>
        )}
        {props.numOfKeys < props.keyNames.length && (
          <button
            onClick={() => {
              props.setNumOfKeys(props.numOfKeys + 1)
            }}
            className="inline-flex h-full w-8 items-center justify-center hover:bg-gray-600"
          >
            +
          </button>
        )}
      </div>
      <CodeLine>{`}`}</CodeLine>
    </div>
  )
}

export const Example = () => {
  const [numOfKeys, setNumOfKeys] = useState(3)
  const [numOfKeysToOmit, setNumOfKeysToOmit] = useState(1)

  const possibleKeys = ['a', 'b', 'c', 'd']

  const keys = possibleKeys.slice(0, numOfKeys)

  const keysToOmit = keys.slice(0, numOfKeysToOmit)

  return (
    <Box className="not-prose flex flex-col rounded bg-gray-800">
      <Box className="flex justify-center bg-gray-700 p-6">
        <label className="block">
          <span className="block text-center">Number of keys</span>
          <input
            type="range"
            step={1}
            max={4}
            min={1}
            className="w-48"
            onChange={(e) => {
              setNumOfKeys(parseInt(e.target.value))
            }}
            value={numOfKeys}
          />
        </label>
      </Box>
      <Box className="flex items-center justify-center p-10 px-6">
        <ObjectType typeName="Input" keys={keys}></ObjectType>
      </Box>
      <Box className="flex justify-center bg-gray-700 p-6">
        <label className="block">
          <span className="block text-center">Number of keys to Omit</span>
          <input
            type="range"
            step={1}
            max={3}
            min={1}
            className="w-48"
            onChange={(e) => {
              setNumOfKeysToOmit(parseInt(e.target.value))
            }}
            value={numOfKeysToOmit}
          />
        </label>
      </Box>
      <Box className="flex items-center justify-center p-10 px-6">
        <div>
          <CodeLine>
            <CodeLine>
              <span className="text-blue-400">type</span>{' '}
              <span className="text-green-300">Result</span>
              {` = `}
              <span className="text-green-300">Omit</span>
              {`<`}
              <span className="text-green-300">Input</span>
              {`, `}
              {keysToOmit.map((key, index, array) => (
                <>
                  <span className="text-orange-300">"{key}"</span>
                  {index === array.length - 1 ? null : <>{` | `}</>}
                </>
              ))}
              {`>;`}
            </CodeLine>
          </CodeLine>
          <HighlightBox className="">
            <ObjectType
              typeName="Result"
              keys={keys.filter((key) => !keysToOmit.includes(key))}
            ></ObjectType>
          </HighlightBox>
        </div>
      </Box>
    </Box>
  )
}

export {}
