'use client'

import React from 'react'

export const StackblitzIframe: React.FC<{
  repo?: string | null
  file?: string | null
}> = ({repo, file}) => {
  const stackblitzEmbedOptions = {
    githubOrg: 'total-typescript',
    githubRepo: 'total-typescript-book',
    file: encodeURI(`${repo}/` + file),
    isEmbed: Number(true),
    clickToLoad: Number(false),
    hideExplorer: Number(true),
    startCommand: getStartCommand({_type: 'exercise'}, file),
    theme: 'dark',
    terminalHeight: 1,
  }
  const {
    githubOrg,
    githubRepo,
    file: _file,
    isEmbed,
    clickToLoad,
    startCommand,
    hideExplorer,
    theme,
    terminalHeight,
  } = stackblitzEmbedOptions
  const [showEditor, setShowEditor] = React.useState(false)

  return (
    <div>
      {!showEditor && (
        <button
          className="aspect-video h-full w-full bg-gray-100"
          onClick={() => {
            setShowEditor((showEditor) => !showEditor)
          }}
        >
          Run Exercise
        </button>
      )}
      {showEditor && (
        <iframe
          id="embed"
          className="aspect-video h-full w-full"
          src={`https://stackblitz.com/github/${githubOrg}/${githubRepo}?file=${_file}&embed=${isEmbed}&view=editor&hideExplorer=${hideExplorer}&ctl=${clickToLoad}&theme=${theme}&terminalHeight=${terminalHeight}${
            startCommand ? `&terminal=${startCommand}` : ''
          }`}
        />
      )}
    </div>
  )
}

export const getStartCommand = (
  exercise: {_type: string},
  stackblitz: string | null | undefined,
) => {
  // Reasonably sensbile fallback, not sure
  // what we should do when Stacblitz is not defined
  if (!stackblitz) return 'e-01'

  const stackblitzSplit = stackblitz.split('/')

  const lastPathPart = stackblitzSplit[stackblitzSplit.length - 1]

  const codeFileNumber = lastPathPart.split('-')[0]

  const startCommand = `${exercise._type.substring(0, 1)}-${codeFileNumber}`

  return startCommand
}
