import React from 'react'

export const RandomShape = ({className}: {className?: string}) => {
  const [randomColor, setRandomColor] = React.useState<string>('#5069FF')
  const [randomShape, setRandomShape] = React.useState<React.ReactNode>(
    shapes[0],
  )

  React.useEffect(() => {
    const randomColor = getRandomColor()
    setRandomColor(randomColor)
    const randomShape = getRandomShape()
    setRandomShape(randomShape)
  }, [])

  return (
    <SVGElementWrapper className={className}>{randomShape}</SVGElementWrapper>
  )
}

function getRandomColor() {
  return colors[Math.floor(Math.random() * colors.length)]
}
function getRandomShape() {
  return shapes[Math.floor(Math.random() * shapes.length)]
}

const colors = ['#5069FF', '#EB5228', '#FDB854', '#2BC370']

const shapes = [
  <rect width="18" height="18" x="3" y="3" fill={'currentColor'} />,
  <path
    fill={'currentColor'}
    d="M9.634 3.5c1.154-2 4.041-2 5.196 0l8.227 14.25c1.155 2-.289 4.5-2.598 4.5H4.004c-2.309 0-3.752-2.5-2.598-4.5L9.634 3.5Z"
  />,
  <path
    fill={'currentColor'}
    d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z"
  />,
  <path
    fill={'currentColor'}
    d="M12 22H4.361A2.363 2.363 0 0 1 2 19.638V4.362A2.363 2.363 0 0 1 4.362 2h7.571c4.891 0 9.147 3.498 9.931 8.325C22.879 16.59 18.071 22 11.999 22Z"
  />,
  <path
    fill={'currentColor'}
    d="M1.842 14.032a2.873 2.873 0 0 1 0-4.064l8.126-8.126a2.873 2.873 0 0 1 4.064 0l8.126 8.126a2.873 2.873 0 0 1 0 4.064l-8.126 8.126a2.873 2.873 0 0 1-4.064 0l-8.126-8.126Z"
  />,
]

const SVGElementWrapper = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}) => {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="none"
      viewBox="0 0 24 24"
    >
      {children}
    </svg>
  )
}
