'use client'

import {useState, useEffect} from 'react'
import Confetti from 'react-confetti'

export default function RedButton() {
  const [isConfetti, setIsConfetti] = useState(false)
  const [isPressed, setIsPressed] = useState(false)
  const [shake, setShake] = useState(false)
  const [confettiKey, setConfettiKey] = useState(0)

  const handleClick = () => {
    setIsPressed(true)
    setShake(true)
    setIsConfetti(true)
    setConfettiKey((prevKey) => prevKey + 1) // Force confetti re-render

    // Sequence of animations
    setTimeout(() => setShake(false), 500) // Stop shaking after 500ms
    setTimeout(() => setIsPressed(false), 250) // Return to normal size after 800ms
    // setTimeout(() => setIsConfetti(false), 12000) // Stop confetti after 8 seconds
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
      className={`flex min-h-screen items-center justify-center bg-gray-900 ${
        shake ? 'animate-shake' : ''
      }`}
    >
      <button
        onClick={handleClick}
        className={`
relative
          flex h-80 
          w-80 items-center justify-center 
          overflow-hidden rounded-full bg-gradient-to-br
          from-red-500 
          to-red-700 text-4xl font-bold
          text-white shadow-[0_10px_0_0_#7f1d1d,0_15px_20px_-5px_rgba(0,0,0,0.5)] transition-all
          duration-300 ease-in-out focus:outline-none
          focus:ring-4
          focus:ring-red-300
          active:shadow-[0_5px_0_0_#7f1d1d,0_10px_10px_-5px_rgba(0,0,0,0.3)]
          ${
            isPressed
              ? 'translate-y-2 rotate-3 scale-95'
              : 'translate-y-0 rotate-0 scale-100'
          }
        `}
      >
        <span className="relative z-10 translate-y-[-4px]">Launch! 🚀</span>
        <div
          className={`
          absolute inset-0 bg-gradient-to-br from-yellow-400 to-red-600
          transition-opacity duration-300
          ${isPressed ? 'opacity-80' : 'opacity-0'}
        `}
        ></div>
        <div
          className={`
          absolute inset-0 rounded-full 
          ${isPressed ? 'animate-pulse-glow' : 'animate-subtle-pulse-glow'}
        `}
        ></div>
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
