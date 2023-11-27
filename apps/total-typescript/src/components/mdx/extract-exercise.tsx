import {AnimatePresence, LayoutGroup, motion} from 'framer-motion'
import {
  Blue,
  Box,
  Checkboxes,
  CodeLine,
  Green,
  HighlightBox,
  LightGreen,
  Orange,
  RangeInput,
  TypeHelperAndVariable,
  Union,
  ListMember,
  InputBox,
} from './interactive-code-elements'
import {useDelayedState} from './use-delayed-state'

const possibleMembers = [
  {
    element: <Orange>"a"</Orange>,
    key: 'a',
  },
  {
    element: <Orange>"b"</Orange>,
    key: 'b',
  },
  {
    element: <Orange>"c"</Orange>,
    key: 'c',
  },
  {
    element: <LightGreen>404</LightGreen>,
    key: '404',
  },
  {
    element: <LightGreen>400</LightGreen>,
    key: '400',
  },
] satisfies ListMember[]

export const ExtractExample = () => {
  const members = useDelayedState(possibleMembers.map((mem) => mem.key))

  const outputMembers = possibleMembers.filter(
    (mem) =>
      members.delayedValue.includes(mem.key) &&
      mem.key !== '404' &&
      mem.key !== '400',
  )

  const inputMembers = possibleMembers.filter((mem) => {
    return members.delayedValue.includes(mem.key)
  })

  return (
    <div className="not-prose flex flex-col rounded bg-gray-800 text-base">
      <LayoutGroup>
        <InputBox>
          <Checkboxes
            label="Input"
            checkboxes={possibleMembers.map((mem) => ({
              value: mem.key,
              label: <code>{mem.key}</code>,
              checked: members.currentValue.includes(mem.key),
            }))}
            onChange={members.set}
          ></Checkboxes>
        </InputBox>

        <motion.div layout className="space-y-8 p-10 px-12">
          <LayoutGroup>
            <CodeLine>
              <Blue>type</Blue> <Green>Input</Green>
              {` = `}
              <Union members={inputMembers}></Union>;
            </CodeLine>
            <motion.div layout>
              <TypeHelperAndVariable
                typeName="Extract"
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
