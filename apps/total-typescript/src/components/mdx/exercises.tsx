import {AnimatePresence, LayoutGroup, motion} from 'framer-motion'
import {
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

export const PickExample = () => {
  const numOfKeys = useDelayedState(3, 300)
  const numOfKeysToPick = useDelayedState(1, 300)

  const possibleKeys = ['a', 'b', 'c', 'd']

  const keys = possibleKeys.slice(0, numOfKeys.delayedValue)

  const keysToPick = possibleKeys.slice(0, numOfKeysToPick.delayedValue)

  const shouldShowError = keysToPick.length > keys.length

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
          <ObjectTypeOfStrings
            typeName="Input"
            keys={keys.map((key) => ({key}))}
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
              <ObjectTypeOfStrings
                typeName="Result"
                keys={keys
                  .filter((key) => keysToPick.includes(key))
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
