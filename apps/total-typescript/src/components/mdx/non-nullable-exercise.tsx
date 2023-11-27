import {AnimatePresence, LayoutGroup, motion} from 'framer-motion'
import {
  Blue,
  Box,
  Checkboxes,
  CodeLine,
  Green,
  HighlightBox,
  TypeHelperAndVariable,
  Union,
  UnionMember,
} from './interactive-code-elements'
import {useDelayedState} from './use-delayed-state'

const possibleMembers = [
  {
    element: <Green>string</Green>,
    key: 'string',
  },
  {
    element: <Green>number</Green>,
    key: 'number',
  },
  {
    element: <Blue>null</Blue>,
    key: 'null',
  },
  {
    element: <Blue>undefined</Blue>,
    key: 'undefined',
  },
] satisfies UnionMember[]

export const NonNullableExercise = () => {
  const members = useDelayedState(possibleMembers.map((mem) => mem.key))

  const outputMembers = possibleMembers.filter(
    (mem) =>
      members.delayedValue.includes(mem.key) &&
      mem.key !== 'undefined' &&
      mem.key !== 'null',
  )

  const inputMembers = possibleMembers.filter((mem) => {
    return members.delayedValue.includes(mem.key)
  })

  return (
    <div className="not-prose flex flex-col rounded bg-gray-800 text-base">
      <LayoutGroup>
        <Box className="flex justify-center space-x-12 bg-gray-700 p-6">
          <Checkboxes
            label="Input Members"
            checkboxes={possibleMembers.map((mem) => ({
              value: mem.key,
              label: <code>{mem.key}</code>,
              checked: members.currentValue.includes(mem.key),
            }))}
            onChange={members.set}
          ></Checkboxes>
        </Box>

        <motion.div layout className="space-y-8 p-10 px-12">
          <LayoutGroup>
            <CodeLine>
              <Blue>type</Blue> <Green>Input</Green>
              {` = `}
              <Union members={inputMembers}></Union>;
            </CodeLine>
            <motion.div layout>
              <TypeHelperAndVariable
                typeName="NonNullable"
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
                  <Union
                    members={outputMembers}
                    fallback={<span>{`{}`}</span>}
                  ></Union>
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
