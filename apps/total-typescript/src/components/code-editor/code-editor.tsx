import Editor from '@monaco-editor/react'
import {useState} from 'react'
import {prettierLoader} from './prettier-loader'

const resolveLanguage = (language: Language | undefined): Language => {
  switch (language) {
    case 'ts':
    case undefined:
      return 'typescript'
    default:
      return language
  }
}

export type Language = 'ts' | 'tsx' | 'typescript' | 'json'

const THEME_NAME = 'total-typescript'

const EDITOR_THEME = {
  base: 'vs-dark' as const,
  inherit: true,
  rules: [],
  name: THEME_NAME,
  colors: {'editor.background': '#1e2632'},
}

export type CodeEditorProps = {
  language?: Language
  code: string
}

const getHeight = (code: string) => {
  return code.split('\n').length * 24
}

let incrementable = 0

/**
 * Eagerly loaded code editor
 *
 * This should not be used directly, instead use ./lazy-loaded-editor.tsx
 */
export const EagerlyLoadedEditor = (props: CodeEditorProps) => {
  // Needs to be a different file name for each editor on-screen
  const [path] = useState(() => {
    incrementable++
    return `main-${incrementable}.ts`
  })

  return (
    <div className="my-10 rounded bg-[#1e2632] py-6">
      <Editor
        path={path}
        loading={<div>Loading Code Editor...</div>}
        height={getHeight(props.code)}
        defaultValue={props.code}
        language={resolveLanguage(props.language)}
        options={{
          minimap: {enabled: false, showSlider: 'mouseover'},
          fontSize: 16,
          glyphMargin: false,
          tabSize: 2,
          lineNumbers: 'off',
          scrollbar: {
            vertical: 'hidden',
            horizontal: 'auto',
          },
          scrollBeyondLastLine: true,
        }}
        onMount={(editor, monaco) => {
          // Enable prettier
          monaco.languages.registerDocumentFormattingEditProvider(
            'typescript',
            {
              provideDocumentFormattingEdits: async (model) => {
                try {
                  return [
                    {
                      text: await prettierLoader.format(model.getValue()),
                      range: model.getFullModelRange(),
                    },
                  ]
                } catch (err) {
                  console.error(err)
                }
              },
            },
          )

          // Adjust the compiler options
          monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
            ...monaco.languages.typescript.typescriptDefaults.getCompilerOptions(),
            module: monaco.languages.typescript.ModuleKind.ESNext,
            moduleResolution:
              monaco.languages.typescript.ModuleResolutionKind.NodeJs,
            strict: true,
          })

          // Define the custom theme
          monaco.editor.defineTheme(THEME_NAME, EDITOR_THEME)
          monaco.editor.setTheme(THEME_NAME)

          // Enable auto formatting on save
          editor.addAction({
            id: 'save',
            label: 'Save',
            keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS],
            run: () => {
              editor.getAction('editor.action.formatDocument')?.run(path)
            },
          })
        }}
      />
    </div>
  )
}
