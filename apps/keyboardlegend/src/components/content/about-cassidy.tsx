import * as React from 'react'
import Image from 'next/image'

export const ProfilePics = () => {
  const numberOfPics = 14
  const duration = 5000
  const images = new Array(numberOfPics)
    .fill(null)
    .map((_, i) => require(`../../../public/cassidy/cassidy-williams-${i}.jpg`))
  const [idx, setIdx] = React.useState(0)
  const [currentImage, setCurrentImage] = React.useState(images[idx])

  React.useEffect(() => {
    setTimeout(() => {
      if (idx === numberOfPics - 1) {
        setIdx(0)
      } else {
        setIdx(idx + 1)
      }
    }, duration)
    setCurrentImage(images[idx])
    return () => {
      setCurrentImage(images[0])
    }
  }, [idx, images])

  return (
    <Image
      src={currentImage}
      placeholder="blur"
      width={240}
      height={240}
      quality={100}
      className="rounded-full"
      alt="Cassidy Williams"
    />
  )
}

const Bio = () => {
  return (
    <div className="pt-10">
      <div className="flex items-center justify-center w-full">
        <ProfilePics />
      </div>
      <p>
        I'm{' '}
        <a
          href="https://cassidoo.co/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Cassidy Williams
        </a>
        , and I've been obsessed with keyboards for years.
      </p>
      <p>
        I've built them, programmed them, and even designed mass-produced keycap
        sets.
      </p>
      <p>
        By the time you finish this miniseries, you'll have narrowed down the
        parts list for your dream keyboard. Of course, dreams are subject to
        change and you can never have enough keyboards!
      </p>
    </div>
  )
}

export default Bio
