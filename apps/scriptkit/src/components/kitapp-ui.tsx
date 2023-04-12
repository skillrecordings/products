import * as React from 'react'
import classNames from 'classnames'
import {LoadedScript} from 'utils/types'
import Link from 'next/link'
import CodeBlock from './code-block'
import theme from 'prism-react-renderer/themes/nightOwl'
import find from 'lodash/find'
import SimpleBar from 'simplebar-react'

const S = SimpleBar as any

type Props = {
  scripts: LoadedScript[]
}

const KitAppUI: React.FC<React.PropsWithChildren<Props>> = ({scripts}) => {
  const [hovered, setHovered] = React.useState<string>('')

  return (
    <div className="bg-blur flex flex-col text-left h-full max-h-[400px] bg-opacity-[85%] bg-black border border-white border-opacity-5 rounded-lg flex-grow">
      <header className="border-b border-white border-opacity-5">
        {/* top-bar */}
        <div className="text-[0.6rem] uppercase font-mono p-3 pb-2 flex items-center justify-between">
          <span>script kit</span>
          {/* <span>main</span> */}
        </div>
        {/* input */}
        <div className="flex items-center relative">
          <input
            className="px-3 placeholder-gray-500 bg-transparent w-full border-none relative before:bg-red-500 before:absolute before:left-0 before:w-1 before:h-1"
            disabled
            type="text"
            placeholder="Run script"
          />
          {/* blink */}
          <div className="bg-gray-200 animate-blink absolute w-px h-2/5 left-3 z-10" />
        </div>
        {/* tabs */}
        <nav className="pointer-events-none">
          <ul className="flex items-center space-x-1">
            {Array.of('Script', 'Kit', 'API', 'Guide', 'Community').map(
              (tab, i) => {
                let active = 0
                return (
                  <div
                    className={`border-b-2 px-3 py-1 text-xs ${classNames({
                      'border-yellow-500': i === active,
                      'border-none opacity-80': i !== active,
                    })}`}
                    key={tab}
                  >
                    {tab}
                  </div>
                )
              },
            )}
          </ul>
        </nav>
      </header>
      <main className="flex flex-grow overflow-hidden">
        {/* scripts */}
        <ul className="flex w-full flex-grow sm:max-w-[300px] sm:border-r border-white border-opacity-5">
          <S className="flex-grow">
            {scripts?.map((script: LoadedScript) => {
              return (
                <li className="" key={script.command}>
                  <Link
                    href={`/${script.user}/${script.command}`}
                    onMouseOver={() => setHovered(script.command)}
                    className="flex flex-col px-3 py-2 bg-transparent bg-opacity-5 hover:bg-white hover:bg-opacity-5 group"
                  >
                    <div>{script.title}</div>
                    <p className="text-xs group-hover:text-yellow-500 group-hover:opacity-100 opacity-70">
                      {script.description}
                    </p>
                  </Link>
                </li>
              )
            })}
          </S>
        </ul>
        {/* preview pane */}
        <div className="sm:flex hidden w-full">
          <CodeBlock
            className="font-mono w-full text-xs"
            value={
              find(scripts, {command: hovered})?.content || scripts[0].content
            }
            language="javascript"
            // @ts-ignore
            theme={theme}
          />
        </div>
      </main>
    </div>
  )
}

export default KitAppUI
