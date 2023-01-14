import React from 'react'
import {
  useActiveCode,
  SandpackStack,
  useSandpack,
} from '@codesandbox/sandpack-react'
import MonacoEditor, {useMonaco, loader} from '@monaco-editor/react'
import {configureMonacoTailwindcss, tailwindcssData} from 'monaco-tailwindcss'
import get from 'lodash/get'

const Editor: React.FC<any> = ({activeFile, isPreview}) => {
  const {code, updateCode} = useActiveCode()

  const {sandpack} = useSandpack()
  const [mounted, setMounted] = React.useState(false)

  const parseTailwindConfigFromCdn = (config: string) => {
    const trueConfig = config.replace('tailwind.config', 'module.exports')
    // need to define a module because of eval below
    // eslint-disable-next-line @next/next/no-assign-module-variable
    const module = {
      exports: {},
    }
    return eval(trueConfig)
  }

  const fileExtension = sandpack.activeFile.split('.').pop()

  const tailwindConfig = get(get(sandpack.files, '/tailwind.config.js'), 'code')

  React.useEffect(() => {
    setMounted(true)
    activeFile && sandpack.setActiveFile(activeFile)
  }, [])

  React.useEffect(() => {
    updateCode(code)
  }, [code])

  const monaco = useMonaco()

  const [monacoTailwindcss, setMonacoTailwindcss] = React.useState<any>()

  React.useEffect(() => {
    if (monaco && mounted) {
      monaco.languages.css.cssDefaults.setOptions({
        data: {
          dataProviders: {
            tailwindcssData,
          },
        },
      })

      const monacoTailwindcss = configureMonacoTailwindcss(monaco, {
        tailwindConfig: parseTailwindConfigFromCdn(tailwindConfig),
      })
      setMonacoTailwindcss(monacoTailwindcss)

      // monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      //   jsx: 'React',
      // })
      monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
        jsx: monaco.languages.typescript.JsxEmit.Preserve,
        target: monaco.languages.typescript.ScriptTarget.ES2020,
        esModuleInterop: true,
      })
    }
  }, [monaco])

  const updateTailwindConfig = (value: string) => {
    monacoTailwindcss.setTailwindConfig(parseTailwindConfigFromCdn(value))
  }

  return mounted ? (
    <SandpackStack>
      <div
        className="h-full"
        // style={{
        //   flex: 1,
        //   paddingTop: 16,
        //   background: '#1e1e1e',
        // }}
      >
        <MonacoEditor
          width="100%"
          height="100%"
          language={
            fileExtension === 'js'
              ? 'javascript'
              : fileExtension === 'tsx'
              ? 'typescript'
              : fileExtension
          }
          theme="vs-dark"
          key={sandpack.activeFile}
          // defaultValue={code}
          value={code}
          onChange={(value = '') => {
            updateCode(value)
            updateTailwindConfig(value)
          }}
          options={{
            padding: {
              bottom: 16,
              top: 16,
            },
            fontSize: 14,
            lineHeight: 1.5,
            useShadowDOM: false,
            acceptSuggestionOnCommitCharacter: true,
            acceptSuggestionOnEnter: 'on',
            accessibilitySupport: 'auto',
            autoIndent: 'full',
            automaticLayout: true,
            codeLens: true,
            colorDecorators: true,
            contextmenu: true,
            cursorBlinking: 'blink',
            cursorSmoothCaretAnimation: false,
            cursorStyle: 'line',
            disableLayerHinting: false,
            disableMonospaceOptimizations: false,
            dragAndDrop: false,
            fixedOverflowWidgets: false,
            folding: true,
            foldingStrategy: 'auto',
            fontLigatures: false,
            formatOnPaste: false,
            formatOnType: false,
            hideCursorInOverviewRuler: false,
            links: true,
            mouseWheelZoom: false,
            multiCursorMergeOverlapping: true,
            multiCursorModifier: 'alt',
            overviewRulerBorder: true,
            overviewRulerLanes: 2,
            quickSuggestions: true,
            quickSuggestionsDelay: 100,
            readOnly: isPreview || false,
            renderControlCharacters: false,
            renderFinalNewline: true,
            renderLineHighlight: 'all',
            renderWhitespace: 'none',
            revealHorizontalRightPadding: 30,
            roundedSelection: true,
            rulers: [],
            scrollBeyondLastColumn: 5,
            scrollBeyondLastLine: true,
            selectOnLineNumbers: true,
            selectionClipboard: true,
            selectionHighlight: true,
            showFoldingControls: 'mouseover',
            smoothScrolling: false,
            suggestOnTriggerCharacters: true,
            wordBasedSuggestions: true,
            wordSeparators: '~!@#$%^&*()-=+[{]}|;:\'",.<>/?',
            wordWrap: 'off',
            wordWrapBreakAfterCharacters: '\t})]?|&,;',
            wordWrapBreakBeforeCharacters: '{([+',
            wordWrapColumn: 80,
            wrappingIndent: 'none',
            minimap: {enabled: false},
          }}
        />
      </div>
    </SandpackStack>
  ) : null
}
export default Editor

// @ts-ignore-next-line
window.MonacoEnvironment = {
  // @ts-ignore-next-line
  getWorker(moduleId, label) {
    switch (label) {
      case 'editorWorkerService':
        return new Worker(
          new URL('monaco-editor/esm/vs/editor/editor.worker', import.meta.url),
        )
      case 'css':
      case 'less':
      case 'scss':
        return new Worker(
          new URL(
            'monaco-editor/esm/vs/language/css/css.worker',
            import.meta.url,
          ),
        )
      case 'handlebars':
      case 'html':
      case 'razor':
        return new Worker(
          new URL(
            'monaco-editor/esm/vs/language/html/html.worker',
            import.meta.url,
          ),
        )
      case 'json':
        return new Worker(
          new URL(
            'monaco-editor/esm/vs/language/json/json.worker',
            import.meta.url,
          ),
        )
      case 'javascript':
        return new Worker(
          new URL(
            'monaco-editor/esm/vs/language/typescript/ts.worker',
            import.meta.url,
          ),
        )
      case 'typescript':
        return new Worker(
          new URL(
            'monaco-editor/esm/vs/language/typescript/ts.worker',
            import.meta.url,
          ),
        )
      case 'tailwindcss':
        return new Worker(
          new URL('monaco-tailwindcss/tailwindcss.worker', import.meta.url),
        )
      default:
        throw new Error(`Unknown label ${label}`)
    }
  },
}
