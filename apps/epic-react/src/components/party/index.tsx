import React from 'react'
import useWindowSize from 'react-use/lib/useWindowSize'
import Confetti from 'react-confetti'
import Polygon from './polygon.png'

const Party = ({
  initialVelocityY = 20,
  initialVelocityX = 0,
  gravity = 0.2,
  recycle = false,
}) => {
  const {width, height} = useWindowSize()
  const [party, setParty] = React.useState(false)

  React.useEffect(() => setParty(true), [])

  function randomInt(min: number, max: number) {
    return Math.floor(min + Math.random() * (max - min + 1))
  }

  function drawStar(this: any, ctx: any) {
    const numPoints = this.numPoints || (randomInt(4, 6) as number)
    this.numPoints = numPoints
    const outerRadius = this.w
    const innerRadius = outerRadius / 2
    ctx.beginPath()
    ctx.moveTo(0, 0 - outerRadius)

    for (let n = 1; n < numPoints * 2; n++) {
      const radius = n % 2 === 0 ? outerRadius : innerRadius
      const x = radius * Math.sin((n * Math.PI) / numPoints)
      const y = -1 * radius * Math.cos((n * Math.PI) / numPoints)
      ctx.lineTo(x, y)
    }
    ctx.fill()
    ctx.closePath()
  }

  if (!party) {
    return null
  }

  return (
    <div
      style={{
        pointerEvents: 'none',
        position: 'absolute',
        zIndex: 999,
        left: 0,
        top: 0,
      }}
    >
      <Confetti
        width={width - 20}
        height={height}
        numberOfPieces={party ? 25 : 0}
        recycle={recycle}
        onConfettiComplete={(confetti) => {
          setParty(false)
          confetti?.reset()
        }}
        drawShape={(ctx) => {
          const image = new Image()
          image.src = Polygon.src
          ctx.drawImage(image, 0, 0)
        }}
        gravity={gravity}
        initialVelocityX={initialVelocityX}
        initialVelocityY={initialVelocityY}
      />
      <Confetti
        width={width - 20}
        height={height}
        numberOfPieces={party ? 500 : 0}
        recycle={recycle}
        onConfettiComplete={(confetti) => {
          setParty(false)
          confetti?.reset()
        }}
        drawShape={drawStar}
        gravity={gravity}
        initialVelocityX={initialVelocityX}
        initialVelocityY={initialVelocityY}
      />
    </div>
  )
}

export default Party
