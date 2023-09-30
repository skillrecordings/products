import {useMotionValue, useTransform} from 'framer-motion'
import React from 'react'

export const useCursorPosition = ({parentRef}: {parentRef: any}) => {
  const cursorX = useMotionValue(0)
  const cursorY = useMotionValue(0)
  const objectX = useMotionValue(0)
  const objectY = useMotionValue(0)

  const handleMouseMove = (e: any) => {
    cursorX.set(e.clientX)
    cursorY.set(e.clientY)
  }

  //   const parentRef = React.useRef<any>(null)

  // Calculate the offset between cursor and object position
  const offsetX = useTransform(
    cursorX,
    (x) => x - parentRef?.current?.getBoundingClientRect().left,
  )
  const offsetY = useTransform(
    cursorY,
    (y) => y - parentRef?.current?.getBoundingClientRect().top,
  )

  // Update object position relative to the cursor
  objectX.set(offsetX.get())
  objectY.set(offsetY.get())

  return {
    handleMouseMove,
    x: offsetX,
    y: offsetY,
  }
}
