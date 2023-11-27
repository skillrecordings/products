import {AnimatePresence, LayoutGroup, motion} from 'framer-motion'
import {
  Checkboxes,
  CodeLine,
  DarkGreen,
  Green,
  HighlightBox,
  InputBox,
  ObjectTypeOfStrings,
  RangeInput,
  StringUnion,
  TypeHelperAndVariable,
} from './interactive-code-elements'
import {useDelayedState} from './use-delayed-state'

const possibleKeys = ['a', 'b', 'c', 'd']

export const PickExample = () => {
  const numOfInputKeys = useDelayedState(3, 300)
  const keysToPick = useDelayedState(['a', 'b', 'c'])

  const inputKeys = possibleKeys.slice(0, numOfInputKeys.delayedValue)

  const shouldShowError = keysToPick.delayedValue.some((key) => {
    return !inputKeys.includes(key)
  })

  const outputKeys = possibleKeys.filter((key) => {
    return keysToPick.delayedValue.includes(key)
  })

  return (
    <div className="not-prose flex flex-col rounded bg-gray-800 text-base">
      <LayoutGroup>
        <InputBox>
          <RangeInput
            label="Input Keys"
            onChange={(value) => {
              numOfInputKeys.set(value)
            }}
            value={numOfInputKeys.currentValue}
            min={1}
            max={4}
          ></RangeInput>
          <Checkboxes
            label="Keys To Pick"
            onChange={keysToPick.set}
            checkboxes={possibleKeys.map((key) => {
              return {
                checked: keysToPick.currentValue.includes(key),
                label: <code>{key}</code>,
                value: key,
              }
            })}
          />
        </InputBox>

        <motion.div layout className="space-y-8 p-10 px-12">
          <ObjectTypeOfStrings
            typeName="Input"
            keys={inputKeys.map((key) => ({key}))}
          ></ObjectTypeOfStrings>
          <div>
            <AnimatePresence mode="popLayout">
              {shouldShowError && (
                <CodeLine>
                  <DarkGreen>{`// You can't pick keys that don't exist in the input!`}</DarkGreen>
                </CodeLine>
              )}
            </AnimatePresence>
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
                          {shouldShowError && (
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
                        <StringUnion members={outputKeys} />
                      </div>
                    </>
                  ),
                },
              ]}
            ></TypeHelperAndVariable>

            <HighlightBox className="">
              <ObjectTypeOfStrings
                typeName="Result"
                keys={inputKeys
                  .filter((key) => outputKeys.includes(key))
                  .map((key) => ({key}))}
              ></ObjectTypeOfStrings>
            </HighlightBox>
          </div>
        </motion.div>
      </LayoutGroup>
    </div>
  )
}

export {}
