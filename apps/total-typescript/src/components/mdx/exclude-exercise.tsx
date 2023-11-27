import {AnimatePresence, LayoutGroup, motion} from 'framer-motion'
import {
  Blue,
  Box,
  CodeLine,
  Green,
  HighlightBox,
  LightGreen,
  Orange,
  RangeInput,
  TypeHelperAndVariable,
  Union,
  UnionMember,
} from './interactive-code-elements'
import {useDelayedState} from './use-delayed-state'

export const ExcludeExample = () => {
  const numOfMembers = useDelayedState(3)

  const possibleMembers: UnionMember[] = [
    {
      element: <Orange>"a"</Orange>,
      key: 'a',
    },
    {
      element: <LightGreen>404</LightGreen>,
      key: 404,
    },
    {
      element: <Orange>"c"</Orange>,
      key: 'c',
    },
    {
      element: <LightGreen>400</LightGreen>,
      key: 400,
    },
    {
      element: <Orange>"e"</Orange>,
      key: 'e',
    },
  ]

  const members = possibleMembers.slice(0, numOfMembers.delayedValue)

  const outputMembers = members.filter((mem) => typeof mem.key !== 'string')

  return (
    <div className="not-prose flex flex-col rounded bg-gray-800 text-base">
      <LayoutGroup>
        <Box className="flex justify-center space-x-12 bg-gray-700 p-6">
          <RangeInput
            label="Inputs"
            onChange={(value) => {
              numOfMembers.set(value)
            }}
            value={numOfMembers.currentValue}
            min={1}
            max={possibleMembers.length}
          ></RangeInput>
        </Box>

        <motion.div layout className="space-y-8 p-10 px-12">
          <LayoutGroup>
            <CodeLine>
              <Blue>type</Blue> <Green>Input</Green>
              {` = `}
              <Union members={members}></Union>;
            </CodeLine>
            <motion.div layout>
              <TypeHelperAndVariable
                typeName="Exclude"
                variableName="Result"
                arguments={[
                  {
                    key: 'Input',
                    node: <Green>Input</Green>,
                  },
                  {
                    key: 'Union',
                    node: <Green>string</Green>,
                  },
                ]}
              ></TypeHelperAndVariable>
              <HighlightBox className="">
                <CodeLine>
                  <Blue>type</Blue> <Green>Result</Green>
                  {` = `}
                  <AnimatePresence mode="popLayout">
                    {outputMembers.length === 0 && <Blue>never</Blue>}
                  </AnimatePresence>
                  <Union members={outputMembers}></Union>
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
