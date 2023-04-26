import Image from 'next/legacy/image'

const Logo = () => {
  return (
    <Image
      src={require('../../public/assets/logo.png')}
      quality={100}
      priority
      alt="Script Kit Logo"
    />
  )
}

export const Favicon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="55"
      height="55"
      fill="none"
      viewBox="0 0 55 55"
    >
      <path
        fill="url(#a)"
        d="M0 17.6C0 4.4 4.4 0 17.6 0h19.8C50.6 0 55 4.4 55 17.6v19.8C55 50.6 50.6 55 37.4 55H17.6C4.4 55 0 50.6 0 37.4V17.6Z"
      />
      <rect
        width="15.469"
        height="3.438"
        x="27.5"
        y="34.375"
        fill="#000"
        rx="1.03"
      />
      <path
        fill="#000"
        d="M13.75 18.201a1.5 1.5 0 0 1 2.305-1.265l14.613 9.299a1.5 1.5 0 0 1 0 2.53l-14.613 9.3a1.5 1.5 0 0 1-2.305-1.266V18.2Z"
      />
      <defs>
        <linearGradient
          id="a"
          x1="27.5"
          x2="27.5"
          y1="0"
          y2="55"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FFE86F" />
          <stop offset=".333" stopColor="#FED533" />
          <stop offset=".714" stopColor="#FFB800" />
          <stop offset="1" stopColor="#FFA800" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export default Logo
