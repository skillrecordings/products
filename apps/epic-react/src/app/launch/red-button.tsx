'use client'

import {useState, useEffect} from 'react'
import Confetti from 'react-confetti'
import Starfield from './starfield'
import {useSocket} from '@/hooks/useSocket'
import {useRouter} from 'next/navigation'

export default function RedButton({canPress}: {canPress: boolean}) {
  const [isConfetti, setIsConfetti] = useState(false)
  const [isPressed, setIsPressed] = useState(false)
  const [shake, setShake] = useState(false)
  const [confettiKey, setConfettiKey] = useState(0)
  const [starfieldSpeed, setStarfieldSpeed] = useState(0.5)
  const router = useRouter()

  function letItRip() {
    setIsPressed(true)
    setShake(true)
    setIsConfetti(true)
    setConfettiKey((prevKey) => prevKey + 1) // Force confetti re-render
    setStarfieldSpeed(20)

    // Sequence of animations
    setTimeout(() => setShake(false), 500) // Stop shaking after 500ms
    setTimeout(() => setIsPressed(false), 250)
  }

  useSocket({
    onMessage: async (messageEvent) => {
      const data = JSON.parse(messageEvent.data)
      const invalidateOn = ['launch.initiated']

      if (invalidateOn.includes(data.name)) {
        letItRip()
      }
    },
  })

  const handleClick = () => {
    letItRip()

    setTimeout(() => {
      router.push('/buy')
    }, 3000)
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        handleClick()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  return (
    <div
      className={`flex min-h-screen w-full items-center justify-center bg-gray-900 ${
        shake ? 'animate-shake' : ''
      }`}
      style={{
        perspective: '1000px',
      }}
    >
      <Starfield speed={starfieldSpeed} />
      <h1 className="left-.5 absolute top-7 z-10 text-5xl font-bold text-white opacity-50">
        epicreact.dev/launch
      </h1>
      <button
        onClick={handleClick}
        className={`
          relative
          flex size-80
          items-center justify-center 
          overflow-hidden rounded-full bg-gradient-to-br
          from-red-500 
          to-red-700 text-4xl font-bold
          text-white
          ${
            isPressed
              ? 'shadow-[0_5px_0_0_#7f1d1d,0_15px_30px_-5px_rgba(0,0,0,0.5)]'
              : 'shadow-[0_17px_0_0_#7f1d1d,0_15px_30px_-5px_rgba(0,0,0,0.5)]'
          }
          transition-all 
          duration-300 ease-in-out hover:brightness-110
          focus:outline-none active:shadow-[0_17px_0_0_#7f1d1d,0_15px_30px_-5px_rgba(0,0,0,0.5)]
          
          `}
      >
        <span className="relative z-10 translate-y-[5px] uppercase drop-shadow-lg">
          Launch
        </span>
        <div
          className={`
          absolute inset-0 bg-gradient-to-br from-yellow-400 to-red-600
          transition-opacity duration-300
          ${isPressed ? 'opacity-80' : 'opacity-0'}
        `}
        />
        <div
          className={`
          absolute inset-0 rounded-full 
          ${isPressed ? 'animate-pulse-glow' : 'animate-subtle-pulse-glow'}
        `}
        />
      </button>

      {isConfetti && (
        <Confetti
          key={confettiKey}
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={2000}
          gravity={0.2}
          initialVelocityX={{min: -20, max: 20}}
          initialVelocityY={{min: -40, max: 40}}
        />
      )}
      <style jsx global>{`
        button {
          transform-style: preserve-3d;
          transform: rotateX(40deg) rotateY(0) rotateZ(0);
        }

        @keyframes pulse-glow {
          0%,
          100% {
            box-shadow: 0 0 20px 10px rgba(255, 0, 0, 0.5),
              0 0 40px 20px rgba(255, 0, 0, 0.3),
              0 0 60px 30px rgba(255, 0, 0, 0.1);
          }
          50% {
            box-shadow: 0 0 30px 15px rgba(255, 0, 0, 0.8),
              0 0 60px 30px rgba(255, 0, 0, 0.5),
              0 0 90px 45px rgba(255, 0, 0, 0.2);
          }
        }

        @keyframes subtle-pulse-glow {
          0%,
          100% {
            box-shadow: 0 0 10px 5px rgba(255, 0, 0, 0.3),
              0 0 20px 10px rgba(255, 0, 0, 0.1);
          }
          50% {
            box-shadow: 0 0 15px 7px rgba(255, 0, 0, 0.4),
              0 0 30px 15px rgba(255, 0, 0, 0.2);
          }
        }

        .animate-pulse-glow {
          animation: pulse-glow 2s infinite;
        }

        .animate-subtle-pulse-glow {
          animation: subtle-pulse-glow 3s infinite;
        }

        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          10%,
          30%,
          50%,
          70%,
          90% {
            transform: translate3d(-15px, -5px, -2px);
          }
          20%,
          40%,
          60%,
          80% {
            transform: translate3d(15px, 5px, 2px);
          }
        }

        .animate-shake {
          animation: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
        }

        /* Hide scrollbar for Chrome, Safari and Opera */
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }

        /* Hide scrollbar for IE, Edge and Firefox */
        .no-scrollbar {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }

        /* Ensure the page takes up full height and hides overflow */
        html,
        body {
          height: 100%;
          overflow: hidden;
        }
      `}</style>
    </div>
  )
}
