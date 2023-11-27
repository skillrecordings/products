import {LayoutGroup, motion} from 'framer-motion'
import {
  Blue,
  Box,
  CodeLine,
  CommaSeparatedList,
  Green,
  HighlightBox,
  InputBox,
  ListMember,
  RangeInput,
  SingleLineTuple,
  Sky,
  TypeHelperAndVariable,
} from './interactive-code-elements'
import {useDelayedState} from './use-delayed-state'

const parameters: ListMember[] = [
  {
    element: <Green>string</Green>,
    key: 'key',
  },
  {
    element: <Green>number</Green>,
    key: 'id',
  },
]

export const ParametersExercise = () => {
  const numberOfParameters = useDelayedState(0)

  const inputParameters = parameters.slice(0, numberOfParameters.delayedValue)

  return (
    <div className="not-prose flex flex-col rounded bg-gray-800 text-base">
      <LayoutGroup>
        <InputBox>
          <RangeInput
            label="Number of Parameters"
            max={2}
            min={0}
            value={numberOfParameters.currentValue}
            onChange={numberOfParameters.set}
          ></RangeInput>
        </InputBox>

        <motion.div layout className="space-y-8 p-10 px-12">
          <LayoutGroup>
            <CodeLine>
              <Blue>type</Blue> <Green>MyFunc</Green>
              {` = (`}
              <CommaSeparatedList
                members={inputParameters.map((param) => {
                  return {
                    ...param,
                    element: (
                      <>
                        <Sky>{param.key}</Sky>: {param.element}
                      </>
                    ),
                  }
                })}
              ></CommaSeparatedList>
              {`) `}
              <Blue>{`=> `}</Blue>
              <Green>string</Green>
              {`;`}
            </CodeLine>
            <motion.div layout>
              <TypeHelperAndVariable
                typeName="Parameters"
                variableName="Result"
                arguments={[
                  {
                    key: 'Input',
                    node: <Green>Input</Green>,
                  },
                ]}
              ></TypeHelperAndVariable>
              <HighlightBox className="">
                <CodeLine>
                  <Blue>type</Blue> <Green>Result</Green>
                  {` = `}
                  <SingleLineTuple
                    members={inputParameters.map((member) => {
                      return {
                        ...member,
                        element: (
                          <>
                            {member.key}: {member.element}
                          </>
                        ),
                      }
                    })}
                  ></SingleLineTuple>
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
