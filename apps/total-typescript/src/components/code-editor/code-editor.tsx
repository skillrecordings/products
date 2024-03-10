import Editor from '@monaco-editor/react'
import {ComponentProps, useRef, useState} from 'react'
import {prettierLoader} from './prettier-loader'

type Editor = Parameters<
  NonNullable<ComponentProps<typeof Editor>['onMount']>
>[0]

type Monaco = Parameters<
  NonNullable<ComponentProps<typeof Editor>['onMount']>
>[1]

const resolveLanguage = (language: Language | undefined): Language => {
  switch (language) {
    case 'ts':
    case undefined:
      return 'typescript'
    case 'js':
      return 'javascript'
    default:
      return language
  }
}

export type Language =
  | 'ts'
  | 'tsx'
  | 'typescript'
  | 'json'
  | 'js'
  | 'javascript'

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
  className?: string
  fontSize?: number
  readonly?: boolean
  onChange?: (code: string | undefined) => void
  onEmittedJavaScript?: (code: string) => void
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

  const monacoRef = useRef<Monaco | undefined>(undefined)
  const editorRef = useRef<Editor | undefined>(undefined)

  const reportEmittedJavaScript = async (): Promise<void> => {
    if (!props.onEmittedJavaScript) {
      return
    }

    if (!editorRef.current || !monacoRef.current) {
      return
    }

    const uri = editorRef.current?.getModel()?.uri

    if (!uri) {
      return
    }

    const worker =
      await monacoRef.current.languages.typescript.getTypeScriptWorker()

    const client = await worker(uri)

    const emitOutput = await client.getEmitOutput(uri.toString())

    props.onEmittedJavaScript(emitOutput.outputFiles[0].text)
  }

  return (
    <Editor
      className={props.className}
      path={path}
      loading={<div>Loading Code Editor...</div>}
      // height={getHeight(props.code)}
      {...(props.readonly
        ? {
            value: props.code,
          }
        : {
            defaultValue: props.code,
          })}
      onChange={(code) => {
        props.onChange?.(code)

        reportEmittedJavaScript()
      }}
      language={resolveLanguage(props.language)}
      options={{
        minimap: {enabled: false, showSlider: 'mouseover'},
        fontSize: props.fontSize ?? 16,
        glyphMargin: false,
        tabSize: 2,
        lineNumbers: 'off',
        scrollbar: {
          vertical: 'hidden',
          horizontal: 'auto',
        },
        automaticLayout: true,
        readOnly: props.readonly,
        scrollBeyondLastLine: true,
      }}
      onMount={(editor, monaco) => {
        monacoRef.current = monaco
        editorRef.current = editor

        // Enable prettier
        monaco.languages.registerDocumentFormattingEditProvider('typescript', {
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
        })

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

        reportEmittedJavaScript()
      }}
    />
  )
}

export const EagerlyLoadedFullWidthEditor = (props: CodeEditorProps) => {
  return (
    <div className="my-10 rounded bg-[#1e2632] py-6">
      <EagerlyLoadedEditor {...props} />
    </div>
  )
}
