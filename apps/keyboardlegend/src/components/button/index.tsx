import * as React from 'react'
import {Button} from '@skillrecordings/react/dist/components'

const StyledButton: React.FC<React.PropsWithChildren<unknown>> = (props) => {
  return (
    <Button
      className="relative flex items-center justify-center group rounded-lg focus:outline-none"
      {...props}
    >
      <div
        className={`overflow-hidden group-focus:border-purple-500 relative flex items-center justify-center group-focus:translate-y-[2px] group-hover:translate-y-[2px] transition-transform ease-in-out duration-200 border-2 border-brand-pink-500 rounded-lg z-10 bg-white text-brand-pink-500 px-6 py-3 leading-none text-center`}
      >
        <span className="font-semibold">{props.children}</span>
      </div>
      <div
        className="w-[108%] bg-brand-pink-500 bg-opacity-50 h-[116%] flex absolute top-[2px] z-0 rounded-xl border-brand-pink-500 border-2"
        aria-hidden="true"
      >
        <div className="w-[2px] absolute rotate-[30deg] h-1/4 bottom-1 left-1 bg-brand-pink-500" />
        <div className="w-[2px] absolute rotate-[-30deg] h-1/4 bottom-1 right-1 bg-brand-pink-500" />
      </div>
    </Button>
  )
}

export default StyledButton
