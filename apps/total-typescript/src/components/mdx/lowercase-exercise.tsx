import {AnimatePresence, LayoutGroup, motion} from 'framer-motion'
import {
  Blue,
  Box,
  CodeLine,
  Green,
  HighlightBox,
  InputBox,
  Orange,
  RadioButtons,
  TypeHelperAndVariable,
} from './interactive-code-elements'
import {useDelayedState} from './use-delayed-state'

const choices = {
  Lowercase: 'OH DEAR',
  Uppercase: 'upper case me please',
  Capitalize: 'camelCaseToPascal',
  Uncapitalize: 'PascalToCamelCase',
} as const

const choicesAsArray = Object.keys(choices) as (keyof typeof choices)[]

export const StringManipulationExercises = () => {
  const typeHelper = useDelayedState<keyof typeof choices>('Lowercase')

  const inputText = choices[typeHelper.delayedValue]

  const output = (() => {
    switch (typeHelper.delayedValue) {
      case 'Lowercase':
        return inputText.toLowerCase()
      case 'Uppercase':
        return inputText.toUpperCase()
      case 'Capitalize':
        return inputText.charAt(0).toUpperCase() + inputText.slice(1)
      case 'Uncapitalize':
        return inputText.charAt(0).toLowerCase() + inputText.slice(1)
    }
  })()

  return (
    <div className="not-prose flex flex-col rounded bg-gray-800 text-base">
      <LayoutGroup>
        <InputBox>
          <RadioButtons
            label="Choice"
            choices={choicesAsArray.map((choice) => ({
              label: choice,
              value: choice,
            }))}
            onChange={typeHelper.set}
            value={typeHelper.currentValue}
          ></RadioButtons>
        </InputBox>

        <motion.div layout className="p-10 px-12">
          <TypeHelperAndVariable
            typeName={typeHelper.delayedValue}
            variableName="Result"
            arguments={[
              {
                key: 'Input',
                node: (
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
                    key={inputText}
                  >
                    <Orange>"{inputText}"</Orange>
                  </motion.span>
                ),
              },
            ]}
          ></TypeHelperAndVariable>
          <HighlightBox className="">
            <CodeLine>
              <Blue>type</Blue> <Green>Result</Green>
              {` = `}
              <AnimatePresence mode="popLayout">
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
                  key={typeHelper.delayedValue}
                >
                  <Orange>"{output}"</Orange>
                </motion.span>
              </AnimatePresence>
              {`;`}
            </CodeLine>
          </HighlightBox>
        </motion.div>
      </LayoutGroup>
    </div>
  )
}

type Yeah = (yeah: string) => string
