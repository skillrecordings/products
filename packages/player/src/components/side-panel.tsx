import * as React from 'react'

export const SidePanel: React.FC<{children: any}> = ({children}) => {
  return (
    <div className="lg:col-span-3">
      <div className="relative h-full">
        <div className="lg:absolute inset-0 w-full flex flex-col">
          <header className="relative z-[1] flex-shrink-0 p-3 bg-gray-700">
            some headerololo
          </header>
          <div className="flex-grow relative border-b border-r border-gray-800">
            <div className="lg:absolute inset-0 overflow-y-auto">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
