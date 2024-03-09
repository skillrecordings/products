import Editor from '@monaco-editor/react'
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

/**
 * Eagerly loaded code editor
 *
 * This should not be used directly, instead use ./lazy-loaded-editor.tsx
 */
export const EagerlyLoadedEditor = (props: CodeEditorProps) => {
  return (
    <div className="h-72 rounded bg-[#1e2632] py-6">
      <Editor
        path="main.ts"
        loading={<div>Loading Code Editor...</div>}
        defaultValue={props.code}
        language={resolveLanguage(props.language)}
        options={{
          minimap: {enabled: false, showSlider: 'mouseover'},
          fontSize: 16,
          glyphMargin: false,
          tabSize: 2,
          lineNumbers: 'off',
          scrollbar: {
            vertical: 'auto',
            horizontal: 'auto',
          },
          scrollBeyondLastLine: false,
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
                      text: await prettierLoader.format(editor.getValue()),
                      range: model.getFullModelRange(),
                    },
                  ]
                } catch (err) {
                  console.error(err)
                } finally {
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
              editor.getAction('editor.action.formatDocument')?.run()
            },
          })
        }}
      />
    </div>
  )
}
