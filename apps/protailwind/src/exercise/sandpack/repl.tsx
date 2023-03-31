import React from 'react'
import {
  SandpackProvider,
  SandpackPreview,
  SandpackLayout,
  FileTabs,
  SandpackStack,
} from '@codesandbox/sandpack-react'
import MonacoEditor from './monaco-editor'

const Repl: React.FC<any> = ({files, isPreview, visibleFiles}) => {
  return (
    <SandpackProvider
      customSetup={{
        entry: '/app.js',
        environment: 'parcel',
        dependencies: {react: '^18.2.0', 'react-dom': '^18.2.0'},
        devDependencies: {
          parcel: '^2.7.0',
        },
      }}
      files={files}
      options={{
        visibleFiles: visibleFiles,
        externalResources: ['https://cdn.tailwindcss.com'],
        classes: {
          'sp-stack': 'min-h-full',
          // 'sp-wrapper': 'h-full',
          'sp-layout': 'aspect-video relative',
          // 'sp-preview-container': 'min-h-full',
        },
      }}
      theme="light"
    >
      <SandpackLayout>
        <SandpackStack
          style={
            {
              // height: '100%',
            }
          }
        >
          {visibleFiles.length > 1 && <FileTabs />}
          <MonacoEditor isPreview={isPreview} />
        </SandpackStack>

        <SandpackPreview />
      </SandpackLayout>
    </SandpackProvider>
  )
}

export default Repl
