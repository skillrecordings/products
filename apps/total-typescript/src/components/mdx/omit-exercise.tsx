import {LayoutGroup, motion} from 'framer-motion'
import {
  Box,
  Checkboxes,
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

export const OmitExample = () => {
  const numOfKeys = useDelayedState(3)
  const keysToOmit = useDelayedState(possibleKeys.slice(0, 1))

  const keys = possibleKeys.slice(0, numOfKeys.delayedValue)

  return (
    <div className="not-prose flex flex-col rounded bg-gray-800 text-base">
      <LayoutGroup>
        <InputBox>
          <RangeInput
            label="Number of keys"
            onChange={(value) => {
              numOfKeys.set(value)
            }}
            value={numOfKeys.currentValue}
            min={1}
            max={4}
          ></RangeInput>

          <Checkboxes
            label="Keys to Omit"
            onChange={keysToOmit.set}
            checkboxes={possibleKeys.map((key) => {
              return {
                checked: keysToOmit.currentValue.includes(key),
                label: <code>{key}</code>,
                value: key,
              }
            })}
          />
        </InputBox>

        <motion.div layout className="space-y-8 p-10 px-12">
          <LayoutGroup>
            <ObjectTypeOfStrings
              typeName="Input"
              keys={keys.map((key) => ({key}))}
            ></ObjectTypeOfStrings>
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
                    node: (
                      <StringUnion
                        members={possibleKeys.filter((key) =>
                          keysToOmit.delayedValue.includes(key),
                        )}
                      />
                    ),
                  },
                ]}
              ></TypeHelperAndVariable>
              <HighlightBox className="">
                <ObjectTypeOfStrings
                  typeName="Result"
                  keys={keys
                    .filter((key) => !keysToOmit.delayedValue.includes(key))
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
