import {AnimatePresence, LayoutGroup, motion} from 'framer-motion'
import {
  Box,
  CodeLine,
  DarkGreen,
  Green,
  HighlightBox,
  ObjectTypeOfStrings,
  RangeInput,
  StringUnion,
  TypeHelperAndVariable,
} from './interactive-code-elements'
import {useDelayedState} from './use-delayed-state'

export const OmitExample = () => {
  const numOfKeys = useDelayedState(3)
  const numOfKeysToOmit = useDelayedState(1)

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
            <ObjectTypeOfStrings
              typeName="Input"
              keys={keys.map((key) => ({key}))}
            ></ObjectTypeOfStrings>
            <motion.div layout>
              <AnimatePresence mode="popLayout">
                {keysToOmit.length > 1 && (
                  <CodeLine>
                    <DarkGreen>{`// You can omit more than one key!`}</DarkGreen>
                  </CodeLine>
                )}
              </AnimatePresence>
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
                <ObjectTypeOfStrings
                  typeName="Result"
                  keys={keys
                    .filter((key) => !keysToOmit.includes(key))
                    .map((key) => ({key}))}
                ></ObjectTypeOfStrings>
              </HighlightBox>
            </motion.div>
          </LayoutGroup>
        </motion.div>
      </LayoutGroup>
    </div>
  )
}
