import * as React from 'react'

const Spinner: React.FunctionComponent<
  React.PropsWithChildren<{
    className?: string
  }>
> = ({className = '', ...rest}) => {
  const css = `.nc-loop-dots-anim-7-icon-f{--animation-duration:1s;transform-origin:50% 50%;animation:nc-loop-dots-anim-7 var(--animation-duration) infinite cubic-bezier(.645,.045,.355,1)}@keyframes nc-loop-dots-anim-7{0%{transform:scale(1)}50%{transform:scale(.7) rotate(90deg)}100%{transform:scale(1) rotate(180deg)}}`
  return (
    <svg
      className={className}
      aria-hidden="true"
      height="48"
      width="48"
      viewBox="0 0 48 48"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <g fill="currentColor">
        <g className="nc-loop-dots-anim-7-icon-f">
          <circle cx="11" cy="11" r="8" />
          <circle cx="37" cy="11" fill="currentColor" r="8" />
          <circle cx="37" cy="37" r="8" />
          <circle cx="11" cy="37" fill="currentColor" r="8" />
        </g>
        <style>{css}</style>
      </g>
    </svg>
  )
}

export default Spinner
