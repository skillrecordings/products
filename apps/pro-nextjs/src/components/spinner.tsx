import * as React from 'react'

const Spinner: React.FunctionComponent<
  React.PropsWithChildren<{
    className?: string
  }>
> = ({className = '', ...rest}) => {
  const css = `.nc-loop-slideshow-anim-48-icon-f,.nc-loop-slideshow-anim-48-icon-f>*{--animation-duration:0.8s}.nc-loop-slideshow-anim-48-icon-f{transform-origin:50% 50%;animation:nc-loop-slideshow-anim-48 var(--animation-duration) infinite cubic-bezier(.215,.61,.355,1)}.nc-loop-slideshow-anim-48-icon-f>:nth-child(1){transform-origin:-8px 24px;transform:scale(.7)}.nc-loop-slideshow-anim-48-icon-f>:nth-child(2){transform-origin:8px 24px;animation:nc-loop-slideshow-anim-48-scale-up var(--animation-duration) infinite cubic-bezier(.215,.61,.355,1)}.nc-loop-slideshow-anim-48-icon-f>:nth-child(3){transform-origin:50% 50%;transform:scale(.7);animation:nc-loop-slideshow-anim-48-scale-down var(--animation-duration) infinite cubic-bezier(.215,.61,.355,1)}.nc-loop-slideshow-anim-48-icon-f>:nth-child(4){transform-origin:40px 24px;transform:scale(.7)}@keyframes nc-loop-slideshow-anim-48{0%{transform:translateX(0)}100%{transform:translateX(16px)}}@keyframes nc-loop-slideshow-anim-48-scale-down{0%{transform:scale(1)}100%{transform:scale(.7)}}@keyframes nc-loop-slideshow-anim-48-scale-up{0%{transform:scale(.7)}100%{transform:scale(1)}}`
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
        <g className="nc-loop-slideshow-anim-48-icon-f">
          <rect fill="currentColor" height="38" width="14" x="-15" y="5" />
          <rect fill="currentColor" height="38" width="14" x="1" y="5" />
          <rect fill="currentColor" height="38" width="14" x="17" y="5" />
          <rect fill="currentColor" height="38" width="14" x="33" y="5" />
        </g>
        <style>{css}</style>
      </g>
    </svg>
  )
}

export default Spinner
