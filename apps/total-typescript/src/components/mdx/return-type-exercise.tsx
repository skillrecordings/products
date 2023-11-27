import {LayoutGroup, motion} from 'framer-motion'
import {
  Blue,
  Box,
  CodeLine,
  Green,
  HighlightBox,
  InputBox,
  RadioButtons,
  TypeHelperAndVariable,
} from './interactive-code-elements'
import {useDelayedState} from './use-delayed-state'

const choices = [
  {
    element: <Green>string</Green>,
    key: 'string',
  },
  {
    element: (
      <motion.span
        animate={{
          opacity: 1,
        }}
        initial={{
          opacity: 0,
        }}
        exit={{
          opacity: 0,
        }}
        layout
        key="number"
      >
        <Green>number</Green>
      </motion.span>
    ),
    key: 'number',
  },
  {
    element: (
      <motion.span
        animate={{
          opacity: 1,
        }}
        initial={{
          opacity: 0,
        }}
        exit={{
          opacity: 0,
        }}
        layout
        key="boolean"
      >
        <Green>boolean</Green>
      </motion.span>
    ),
    key: 'boolean',
  },
]

export const ReturnTypeExercise = () => {
  const returnType = useDelayedState(choices[0].key)

  const returnTypeElement = choices.find(
    (choice) => choice.key === returnType.delayedValue,
  )

  return (
    <div className="not-prose flex flex-col rounded bg-gray-800 text-base">
      <LayoutGroup>
        <InputBox>
          <RadioButtons
            label="Return Type"
            choices={choices.map((choice) => ({
              value: choice.key,
              label: <code>{choice.key}</code>,
            }))}
            onChange={returnType.set}
            value={returnType.currentValue}
          ></RadioButtons>
        </InputBox>

        <motion.div layout className="space-y-8 p-10 px-12">
          <LayoutGroup>
            <CodeLine>
              <Blue>type</Blue> <Green>MyFunc</Green>
              {` = () `}
              <Blue>{`=> `}</Blue>
              <motion.span
                animate={{
                  opacity: 1,
                }}
                initial={{
                  opacity: 0,
                }}
                exit={{
                  opacity: 0,
                }}
                layout
                key={returnTypeElement?.key}
              >
                {returnTypeElement?.element}
              </motion.span>
              {`;`}
            </CodeLine>
            <motion.div layout>
              <TypeHelperAndVariable
                typeName="ReturnType"
                variableName="Result"
                arguments={[
                  {
                    key: 'MyFunc',
                    node: <Green>MyFunc</Green>,
                  },
                ]}
              ></TypeHelperAndVariable>
              <HighlightBox className="">
                <CodeLine>
                  <Blue>type</Blue> <Green>Result</Green>
                  {` = `}
                  <motion.span
                    animate={{
                      opacity: 1,
                    }}
                    initial={{
                      opacity: 0,
                    }}
                    exit={{
                      opacity: 0,
                    }}
                    layout
                    key={returnTypeElement?.key}
                  >
                    {returnTypeElement?.element}
                  </motion.span>
                  {`;`}
                </CodeLine>
              </HighlightBox>
            </motion.div>
          </LayoutGroup>
        </motion.div>
      </LayoutGroup>
    </div>
  )
}

type Yeah = (yeah: string) => string
