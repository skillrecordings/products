import React from 'react'

type IconProperties = {
  className?: string
  viewBox?: string
  title?: string
  role?: string
  size?: '16' | '24' | '32' | '40'
  name: IconNames
}

const Icons = {
  Palm: () => (
    <path
      fill="#10B981"
      fillRule="evenodd"
      d="M10.605 3.563a5.5 5.5 0 0 1 2.166.856 5.664 5.664 0 0 1 2.29 4.207.729.729 0 0 1-1.126.696L7.463 5.008l-4.93 6.34a.728.728 0 0 1-1.253-.178 4.923 4.923 0 0 1 .5-4.711 6.578 6.578 0 0 1 2.379-2.087l-3.107-.776a.728.728 0 0 1-.279-1.275 5.089 5.089 0 0 1 3.879-1.025 4.03 4.03 0 0 1 2.3 1.528A5.162 5.162 0 0 1 9.84.176a5.261 5.261 0 0 1 4.175.648.729.729 0 0 1-.109 1.272l-3.301 1.467ZM8.378 16a16.06 16.06 0 0 0 .858-5.142 16.007 16.007 0 0 0-.312-3.126l-1.14-.764-.402.517c.264 1.104.398 2.235.399 3.37A14.62 14.62 0 0 1 6.837 16h1.541Z"
      clipRule="evenodd"
    />
  ),
  Checkmark: () => (
    <polygon
      points="0.5,7.5 2,6 5.5,8.5 14,2 15.5,3.5 5.5,13.5"
      fill="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  Playmark: () => (
    <path
      fill="currentColor"
      d="m13.6 7.2-10-7A1 1 0 0 0 2 1v14a1 1 0 0 0 1.6.8l10-7c.5-.4.5-1.2 0-1.6Z"
    />
  ),
  Anchor: () => (
    <path
      fill="#F8A729"
      d="m12.143 9.789 1.857.08v1.484c0 1.308-.939 2.502-2.24 2.634A2.503 2.503 0 0 1 9 11.5V5.816a2.992 2.992 0 0 0 1.941-3.417A3.01 3.01 0 0 0 8.565.052 3.005 3.005 0 0 0 5 3c0 1.302.838 2.402 2 2.816v5.537c0 1.308-.939 2.502-2.24 2.634A2.503 2.503 0 0 1 2 11.5V9.869l1.857-.08a.5.5 0 0 0 .255-.916L0 6.131v5.165c0 2.327 1.677 4.415 3.99 4.675 1.628.184 3.087-.524 4.01-1.678.923 1.154 2.382 1.862 4.01 1.678 2.313-.26 3.99-2.348 3.99-4.675V6.13l-4.112 2.742a.5.5 0 0 0 .255.916ZM8 2a1.001 1.001 0 0 1 0 2 1.001 1.001 0 0 1 0-2Z"
    />
  ),
  // ... more icons
} as const

type IconNames = keyof typeof Icons

const Icon: React.FC<IconProperties> = ({
  viewBox,
  title,
  size,
  name,
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox={viewBox}
    aria-hidden={!title}
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    {title && <title>{title}</title>}
    {Icons[name]()}
  </svg>
)

Icon.defaultProps = {
  viewBox: '0 0 16 16',
  size: '16',
  role: 'img',
}

export default Icon
