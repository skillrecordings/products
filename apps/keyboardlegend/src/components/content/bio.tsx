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
    <div>
      <ProfilePics />
      <p>
        Cassidy is Director of Developer Experience at Netlify. She&apos;s
        worked for several other places, large and small, and she&apos;s had the
        honor of working with various non-profits, including cKeys and Hacker
        Fund as their Director of Outreach. She&apos;s active in the developer
        community, and one of Glamour Magazine&apos;s 35 Women Under 35 Changing
        the Tech Industry and LinkedIn&apos;s Top Professionals 35 {'&'} Under.
        As an avid speaker, Cassidy has participated in many events including
        the Grace Hopper Celebration for Women in Computing, TEDx, the United
        Nations, and hundreds of other technical events. She wants to inspire
        generations of STEM students to be the best they can be, and her
        favorite quote is from Helen Keller: &quot;One can never consent to
        creep when one feels an impulse to soar.&quot; She loves mechanical
        keyboards and karaoke.
      </p>
    </div>
  )
}

export default Bio
